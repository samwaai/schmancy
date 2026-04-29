// Storage adapters for the state() module. Lifted from the v1
// store/storage-manager.ts and tightened — same four backends
// (memory / local / session / indexeddb), same Map/Set JSON tunnel,
// gives the state() factory a uniform async interface to load + save.
//
// The microtask write-debouncer lives in state.ts (the consumer of
// this module) — adapters here are plain load/save/clear.

export type StorageBackend = 'memory' | 'local' | 'session' | 'indexeddb'

export interface StorageAdapter<T> {
	load(): Promise<T | null>
	save(value: T): Promise<void>
	clear(): Promise<void>
	close?(): Promise<void>
}

export class StateStorageError<T = unknown> extends Error {
	readonly cause?: T
	readonly context?: Record<string, unknown>
	readonly timestamp: Date
	constructor(message: string, cause?: T, context?: Record<string, unknown>) {
		super(message)
		this.name = 'StateStorageError'
		this.cause = cause
		this.context = context
		this.timestamp = new Date()
	}
}

// ---------------------------------------------------------------------------
// JSON tunnel for Map/Set values stored in string-backed storage.
// IDB stores native objects so doesn't need this — only used by local/session.

const MAP_TAG = '__schmancy_state_Map'
const SET_TAG = '__schmancy_state_Set'

interface TaggedMap {
	$kind: typeof MAP_TAG
	entries: Array<[unknown, unknown]>
}
interface TaggedSet {
	$kind: typeof SET_TAG
	values: unknown[]
}

function replacer(_key: string, value: unknown): unknown {
	if (value instanceof Map) {
		return { $kind: MAP_TAG, entries: Array.from(value.entries()) } satisfies TaggedMap
	}
	if (value instanceof Set) {
		return { $kind: SET_TAG, values: Array.from(value.values()) } satisfies TaggedSet
	}
	return value
}

function reviver(_key: string, value: unknown): unknown {
	if (value && typeof value === 'object' && '$kind' in value) {
		const tagged = value as { $kind: unknown; entries?: unknown; values?: unknown }
		const kind = tagged.$kind
		if (kind === MAP_TAG) {
			if (!Array.isArray(tagged.entries)) return value
			const ok = tagged.entries.every(e => Array.isArray(e) && e.length === 2)
			if (!ok) return value
			return new Map(tagged.entries as Iterable<readonly [unknown, unknown]>)
		}
		if (kind === SET_TAG) {
			if (!Array.isArray(tagged.values)) return value
			return new Set(tagged.values)
		}
	}
	return value
}

// ---------------------------------------------------------------------------

class MemoryAdapter<T> implements StorageAdapter<T> {
	#data: T | null = null
	async load(): Promise<T | null> {
		return this.#data
	}
	async save(value: T): Promise<void> {
		this.#data = value
	}
	async clear(): Promise<void> {
		this.#data = null
	}
}

class WebStorageAdapter<T> implements StorageAdapter<T> {
	constructor(
		private readonly storage: Storage,
		private readonly key: string,
		private readonly label: string,
	) {}
	async load(): Promise<T | null> {
		try {
			const raw = this.storage.getItem(this.key)
			return raw ? (JSON.parse(raw, reviver) as T) : null
		} catch (err) {
			console.error(`[state] ${this.label} load failed (${this.key}):`, err)
			return null
		}
	}
	async save(value: T): Promise<void> {
		try {
			this.storage.setItem(this.key, JSON.stringify(value, replacer))
		} catch (err) {
			throw new StateStorageError(
				`[state] ${this.label} save failed (${this.key})`,
				err,
			)
		}
	}
	async clear(): Promise<void> {
		this.storage.removeItem(this.key)
	}
}

class IndexedDBAdapter<T> implements StorageAdapter<T> {
	private static readonly DB_NAME = 'SchmancyState'
	private static readonly STORE_NAME = 'states'
	private static readonly DB_VERSION = 1

	#db: IDBDatabase | null = null
	#opening: Promise<IDBDatabase> | null = null

	constructor(private readonly key: string) {}

	private openDB(): Promise<IDBDatabase> {
		if (this.#db) return Promise.resolve(this.#db)
		if (this.#opening) return this.#opening
		this.#opening = new Promise<IDBDatabase>((resolve, reject) => {
			const req = indexedDB.open(IndexedDBAdapter.DB_NAME, IndexedDBAdapter.DB_VERSION)
			req.onupgradeneeded = () => {
				const db = req.result
				if (!db.objectStoreNames.contains(IndexedDBAdapter.STORE_NAME)) {
					db.createObjectStore(IndexedDBAdapter.STORE_NAME)
				}
			}
			req.addEventListener('success', () => {
				this.#db = req.result
				resolve(req.result)
			}, { once: true })
			req.addEventListener('error', () => reject(req.error), { once: true })
		})
		return this.#opening
	}

	async load(): Promise<T | null> {
		try {
			const db = await this.openDB()
			return await new Promise<T | null>((resolve, reject) => {
				const tx = db.transaction(IndexedDBAdapter.STORE_NAME, 'readonly')
				const req = tx.objectStore(IndexedDBAdapter.STORE_NAME).get(this.key)
				req.addEventListener('success', () => resolve((req.result ?? null) as T | null), { once: true })
				req.addEventListener('error', () => reject(req.error), { once: true })
			})
		} catch (err) {
			console.error(`[state] IDB load failed (${this.key}):`, err)
			return null
		}
	}

	async save(value: T): Promise<void> {
		const db = await this.openDB()
		return new Promise<void>((resolve, reject) => {
			const tx = db.transaction(IndexedDBAdapter.STORE_NAME, 'readwrite')
			const req = tx.objectStore(IndexedDBAdapter.STORE_NAME).put(value, this.key)
			req.addEventListener('success', () => resolve(), { once: true })
			req.addEventListener('error', () => reject(
				new StateStorageError(`[state] IDB save failed (${this.key})`, req.error),
			), { once: true })
		})
	}

	async clear(): Promise<void> {
		const db = await this.openDB()
		return new Promise<void>((resolve, reject) => {
			const tx = db.transaction(IndexedDBAdapter.STORE_NAME, 'readwrite')
			const req = tx.objectStore(IndexedDBAdapter.STORE_NAME).delete(this.key)
			req.addEventListener('success', () => resolve(), { once: true })
			req.addEventListener('error', () => reject(req.error), { once: true })
		})
	}

	async close(): Promise<void> {
		if (this.#db) {
			this.#db.close()
			this.#db = null
		}
		this.#opening = null
	}
}

export function createAdapter<T>(backend: StorageBackend, key: string): StorageAdapter<T> {
	switch (backend) {
		case 'local':
			return new WebStorageAdapter<T>(localStorage, key, 'localStorage')
		case 'session':
			return new WebStorageAdapter<T>(sessionStorage, key, 'sessionStorage')
		case 'indexeddb':
			return new IndexedDBAdapter<T>(key)
		case 'memory':
		default:
			return new MemoryAdapter<T>()
	}
}

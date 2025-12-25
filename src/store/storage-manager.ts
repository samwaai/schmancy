import { IStorageManager, StorageType, StoreError } from './types'

/**
 * Custom JSON replacer to handle Map and Set serialization
 *
 * LIMITATIONS:
 * - Only supports Maps with string/number/primitive keys
 * - Object keys will be stringified and may collide (e.g., {id: 1} and {id: 2} both become "[object Object]")
 * - Circular references are not supported (JSON.stringify limitation)
 *
 * @example
 * ```typescript
 * // ✅ Supported
 * new Map([['key', 'value'], [123, 'number-key']])
 *
 * // ❌ Not supported (object keys will become strings)
 * new Map([[{id: 1}, 'value']])
 * ```
 */
function mapSetReplacer(_key: string, value: unknown): unknown {
	if (value instanceof Map) {
		return {
			__type: 'Map',
			entries: Array.from(value.entries()),
		}
	}
	if (value instanceof Set) {
		return {
			__type: 'Set',
			values: Array.from(value.values()),
		}
	}
	return value
}

/**
 * Custom JSON reviver to handle Map and Set deserialization
 *
 * Includes validation to prevent malformed data or __type injection attacks.
 * Invalid structures are ignored and returned as-is.
 */
function mapSetReviver(_key: string, value: unknown): unknown {
	if (value && typeof value === 'object' && '__type' in value) {
		const typed = value as { __type: string; entries?: unknown[]; values?: unknown[] }

		// Validate and reconstruct Map
		if (typed.__type === 'Map') {
			if (!Array.isArray(typed.entries)) {
				console.warn('Invalid Map structure in storage (entries not an array), ignoring')
				return value
			}
			// Validate all entries are [key, value] pairs
			const isValid = typed.entries.every(e => Array.isArray(e) && e.length === 2)
			if (!isValid) {
				console.warn('Invalid Map structure in storage (malformed entries), ignoring')
				return value
			}
			return new Map(typed.entries as Iterable<readonly [unknown, unknown]>)
		}

		// Validate and reconstruct Set
		if (typed.__type === 'Set') {
			if (!Array.isArray(typed.values)) {
				console.warn('Invalid Set structure in storage (values not an array), ignoring')
				return value
			}
			return new Set(typed.values)
		}

		// Unknown __type marker, log warning and ignore
		console.warn(`Unknown __type "${typed.__type}" in storage, ignoring`)
	}
	return value
}

/**
 * Memory storage manager implementation
 */
export class MemoryStorageManager<T> implements IStorageManager<T> {
	private data: T | null = null

	async load(): Promise<T | null> {
		return this.data
	}

	async save(state: T): Promise<void> {
		this.data = state
	}

	async clear(): Promise<void> {
		this.data = null
	}
}

/**
 * Local storage manager implementation
 */
export class LocalStorageManager<T> implements IStorageManager<T> {
	constructor(private key: string) {}

	async load(): Promise<T | null> {
		try {
			const data = localStorage.getItem(this.key)
			return data ? JSON.parse(data, mapSetReviver) : null
		} catch (err) {
			console.error(`Failed to load from localStorage (${this.key}):`, err)
			return null
		}
	}

	async save(state: T): Promise<void> {
		try {
			localStorage.setItem(this.key, JSON.stringify(state, mapSetReplacer))
		} catch (err) {
			console.error(`Failed to save to localStorage (${this.key}):`, err)
			throw new StoreError<unknown>(`Failed to save to localStorage (${this.key})`, err)
		}
	}

	async clear(): Promise<void> {
		localStorage.removeItem(this.key)
	}
}

/**
 * Session storage manager implementation
 */
export class SessionStorageManager<T> implements IStorageManager<T> {
	constructor(private key: string) {}

	async load(): Promise<T | null> {
		try {
			const data = sessionStorage.getItem(this.key)
			return data ? JSON.parse(data, mapSetReviver) : null
		} catch (err) {
			console.error(`Failed to load from sessionStorage (${this.key}):`, err)
			return null
		}
	}

	async save(state: T): Promise<void> {
		try {
			sessionStorage.setItem(this.key, JSON.stringify(state, mapSetReplacer))
		} catch (err) {
			console.error(`Failed to save to sessionStorage (${this.key}):`, err)
			throw new StoreError<unknown>(`Failed to save to sessionStorage (${this.key})`, err)
		}
	}

	async clear(): Promise<void> {
		sessionStorage.removeItem(this.key)
	}
}

/**
 * IndexedDB storage manager implementation with better error typing
 */
export class IndexedDBStorageManager<T> implements IStorageManager<T> {
	private static DB_NAME = 'StoreDB'
	private static STORE_NAME = 'states'
	private static DB_VERSION = 1

	constructor(private key: string) {}

	private openDB(): Promise<IDBDatabase> {
		return new Promise<IDBDatabase>((resolve, reject) => {
			const request = indexedDB.open(IndexedDBStorageManager.DB_NAME, IndexedDBStorageManager.DB_VERSION)

			request.onupgradeneeded = () => {
				const db = request.result
				if (!db.objectStoreNames.contains(IndexedDBStorageManager.STORE_NAME)) {
					db.createObjectStore(IndexedDBStorageManager.STORE_NAME)
				}
			}

			request.onsuccess = () => resolve(request.result)
			request.onerror = () => reject(request.error)
		})
	}

	async load(): Promise<T | null> {
		try {
			const db = await this.openDB()
			return new Promise<T | null>((resolve, reject) => {
				const transaction = db.transaction(IndexedDBStorageManager.STORE_NAME, 'readonly')
				const store = transaction.objectStore(IndexedDBStorageManager.STORE_NAME)
				const request = store.get(this.key)

				request.onsuccess = () => {
					db.close()
					resolve(request.result || null)
				}

				request.onerror = () => {
					db.close()
					reject(request.error)
				}
			})
		} catch (err) {
			console.error(`Failed to load from IndexedDB (${this.key}):`, err)
			return null
		}
	}

	async save(state: T): Promise<void> {
		try {
			const db = await this.openDB()
			return new Promise<void>((resolve, reject) => {
				const transaction = db.transaction(IndexedDBStorageManager.STORE_NAME, 'readwrite')
				const store = transaction.objectStore(IndexedDBStorageManager.STORE_NAME)
				const request = store.put(state, this.key)

				request.onsuccess = () => {
					db.close()
					resolve()
				}

				request.onerror = () => {
					db.close()
					reject(request.error)
				}
			})
		} catch (err) {
			console.error(`Failed to save to IndexedDB (${this.key}):`, err)
			throw new StoreError<unknown>(`Failed to save to IndexedDB (${this.key})`, err)
		}
	}

	async clear(): Promise<void> {
		try {
			const db = await this.openDB()
			return new Promise<void>((resolve, reject) => {
				const transaction = db.transaction(IndexedDBStorageManager.STORE_NAME, 'readwrite')
				const store = transaction.objectStore(IndexedDBStorageManager.STORE_NAME)
				const request = store.delete(this.key)

				request.onsuccess = () => {
					db.close()
					resolve()
				}

				request.onerror = () => {
					db.close()
					reject(request.error)
				}
			})
		} catch (err) {
			console.error(`Failed to clear from IndexedDB (${this.key}):`, err)
			throw new StoreError<unknown>(`Failed to clear from IndexedDB (${this.key})`, err)
		}
	}
}

/**
 * Factory function to create the appropriate storage manager
 */
export function createStorageManager<T>(type: StorageType, key: string): IStorageManager<T> {
	switch (type) {
		case 'local':
			return new LocalStorageManager<T>(key)
		case 'session':
			return new SessionStorageManager<T>(key)
		case 'indexeddb':
			return new IndexedDBStorageManager<T>(key)
		case 'memory':
		default:
			return new MemoryStorageManager<T>()
	}
}

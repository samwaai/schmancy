import { IStorageManager, StorageType, StoreError } from './types'

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
			return data ? JSON.parse(data) : null
		} catch (err) {
			console.error(`Failed to load from localStorage (${this.key}):`, err)
			return null
		}
	}

	async save(state: T): Promise<void> {
		try {
			localStorage.setItem(this.key, JSON.stringify(state))
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
			return data ? JSON.parse(data) : null
		} catch (err) {
			console.error(`Failed to load from sessionStorage (${this.key}):`, err)
			return null
		}
	}

	async save(state: T): Promise<void> {
		try {
			sessionStorage.setItem(this.key, JSON.stringify(state))
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

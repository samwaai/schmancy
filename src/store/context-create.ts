import { ICollectionStore, IStore, StorageType } from './types'
import { SchmancyStoreObject } from './context-object'
import SchmancyCollectionStore from './context-collection'

/**
 * Checks if an object is empty
 */
function isEmptyObject(obj: object): boolean {
	if (typeof obj !== 'object' || obj === null) {
		return false
	}
	return Object.keys(obj).length === 0
}

/**
 * Returns true if obj is an iterable collection
 */
function isCollection(obj: any): obj is Iterable<any> {
	// Must be non-null and of type 'object'
	if (obj == null || typeof obj !== 'object') {
		return false
	}

	// Exclude plain objects.
	const proto = Object.getPrototypeOf(obj)
	if (proto === Object.prototype || proto === null) {
		return false
	}

	// Check for Symbol.iterator method
	return typeof obj[Symbol.iterator] === 'function'
}

/**
 * Creates a context for managing state with better type safety
 */
export function createContext<T extends Record<string, any>>(
	initialData: T,
	storage: StorageType,
	key: string,
): IStore<T> & SchmancyStoreObject<T>

export function createContext<V>(
	initialData: Map<string, V>,
	storage: StorageType,
	key: string,
): ICollectionStore<V> & SchmancyCollectionStore<V>

export function createContext<T extends Record<string, any> | Map<string, any>>(
	initialData: T | Map<string, any>,
	storage: StorageType,
	key: string,
): (IStore<T> & SchmancyStoreObject<T>) | (ICollectionStore<any> & SchmancyCollectionStore<any>) {
	if (isCollection(initialData)) {
		// Create a collection store
		const store = SchmancyCollectionStore.getInstance(storage, key, initialData as Map<string, any>)

		// Initialize with provided data if store is empty
		if (!store.value.size) {
			store.$.next(initialData as Map<string, any>)
		}
		return store as ICollectionStore<any> & SchmancyCollectionStore<any>
	} else if (typeof initialData === 'object' && initialData !== null) {
		// Validate storage type for object stores
		if (storage === 'indexeddb') {
			throw new Error('IndexedDB storage is not supported for plain objects.')
		}

		// Create an object store
		const store = SchmancyStoreObject.getInstance<T>(storage, key, initialData as T)

		// Initialize with provided data if store is empty
		if (isEmptyObject(store.value)) {
			store.$.next(initialData as T)
		}
		return store as IStore<T> & SchmancyStoreObject<T>
	} else {
		throw new Error('Initial data must be an object or a Map.')
	}
}

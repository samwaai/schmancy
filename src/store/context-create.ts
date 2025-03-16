// src/store/context-create.ts
import SchmancyCollectionStore from './context-collection'
import { SchmancyStoreObject } from './context-object'
import { ICollectionStore, IStore, StorageType, StoreError } from './types'

/**
 * Type guard to check if an object is empty
 */
function isEmptyObject(obj: unknown): boolean {
	if (typeof obj !== 'object' || obj === null) {
		return false
	}
	return Object.keys(obj).length === 0
}

/**
 * Type guard to check if object is an iterable collection
 */
// function isCollection(obj: unknown): obj is Iterable<unknown> {
// 	// Must be non-null and of type 'object'
// 	if (obj == null || typeof obj !== 'object') {
// 		return false
// 	}

// 	// Exclude plain objects
// 	const proto = Object.getPrototypeOf(obj)
// 	if (proto === Object.prototype || proto === null) {
// 		return false
// 	}

// 	// Check for Symbol.iterator method
// 	return typeof obj[Symbol.iterator] === 'function'
// }

/**
 * Type guard for Map objects
 */
function isMap<K, V>(value: unknown): value is Map<K, V> {
	return value instanceof Map
}

/**
 * Creates a regular object store
 */
function createObjectStore<T extends Record<string, any>>(
	initialData: T,
	storage: StorageType,
	key: string,
): IStore<T> & SchmancyStoreObject<T> {
	// Validate storage type
	if (storage === 'indexeddb') {
		throw new StoreError('IndexedDB storage is not supported for plain objects', null, { storage, key })
	}

	// Create the store instance
	const store = SchmancyStoreObject.getInstance<T>(storage, key, initialData)

	// Initialize with provided data if store is empty
	if (isEmptyObject(store.value)) {
		store.$.next(initialData)
	}

	return store
}

/**
 * Creates a collection store
 */
function createCollectionStore<V>(
	initialData: Map<string, V>,
	storage: StorageType,
	key: string,
): ICollectionStore<V> & SchmancyCollectionStore<V> {
	// Create the store instance
	const store = SchmancyCollectionStore.getInstance(storage, key, initialData)

	// Initialize with provided data if store is empty
	if (!store.value.size) {
		store.$.next(new Map(initialData))
	}

	return store
}

/**
 * Creates a context for managing state with better type safety
 * Overload for object stores
 */
export function createContext<T extends Record<string, any>>(
	initialData: T,
	storage: StorageType,
	key: string,
): IStore<T> & SchmancyStoreObject<T>

/**
 * Creates a context for managing state with better type safety
 * Overload for collection stores
 */
export function createContext<V>(
	initialData: Map<string, V>,
	storage: StorageType,
	key: string,
): ICollectionStore<V> & SchmancyCollectionStore<V>

/**
 * Implementation of the createContext function
 */
export function createContext<T extends Record<string, any> | Map<string, any>>(
	initialData: T | Map<string, any>,
	storage: StorageType,
	key: string,
): (IStore<T> & SchmancyStoreObject<T>) | (ICollectionStore<any> & SchmancyCollectionStore<any>) {
	// Validate input
	if (initialData === null || initialData === undefined) {
		throw new StoreError('Initial data cannot be null or undefined', null, { storage, key })
	}

	// Determine store type based on input data
	if (isMap(initialData)) {
		return createCollectionStore(initialData as Map<string, any>, storage, key)
	} else if (typeof initialData === 'object') {
		return createObjectStore(initialData, storage, key)
	} else {
		throw new StoreError('Initial data must be an object or a Map', null, {
			storage,
			key,
			dataType: typeof initialData,
		})
	}
}

/**
 * Creates a context with type inference, simplifying common patterns
 */
export function createObjectContext<T extends Record<string, any>>(
	initialData: T,
	key: string,
	storage: StorageType = 'local',
): IStore<T> & SchmancyStoreObject<T> {
	return createContext(initialData, storage, key)
}

/**
 * Creates a collection context with type inference
 */
export function createCollectionContext<V>(
	initialData: Map<string, V> | V[],
	key: string,
	storage: StorageType = 'local',
): ICollectionStore<V> & SchmancyCollectionStore<V> {
	// Convert array to Map if needed
	const dataMap = Array.isArray(initialData)
		? new Map(initialData.map((item, index) => [String(index), item]))
		: initialData

	return createContext<V>(dataMap, storage, key)
}

// src/store/context-create.ts - Modified to support arrays
import SchmancyCollectionStore from './context-collection'
import { SchmancyStoreObject } from './context-object'
import { SchmancyArrayStore } from './context-array'
import { ICollectionStore, IStore, IArrayStore, StorageType, StoreError } from './types'

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
 * Type guard for Map objects
 */
function isMap<K, V>(value: unknown): value is Map<K, V> {
	return value instanceof Map
}

/**
 * Type guard for Array objects
 */
function isArray<T>(value: unknown): value is Array<T> {
	return Array.isArray(value)
}

/**
 * Creates a regular object store with better typing
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
		store.$.next({ ...initialData }) // Use spread to create a copy
	}

	return store
}

/**
 * Creates a collection store with better typing
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
		// Create a new Map instance to avoid modifying the input
		store.$.next(new Map(initialData))
	}

	return store
}

/**
 * Creates an array store with better typing
 */
function createArrayStore<T>(
	initialData: T[],
	storage: StorageType,
	key: string,
): IArrayStore<T> & SchmancyArrayStore<T> {
	// Create the store instance
	const store = SchmancyArrayStore.getInstance(storage, key, initialData)

	// Initialize with provided data if store is empty
	if (!store.value.length) {
		// Create a new array instance to avoid modifying the input
		store.$.next([...initialData])
	}

	return store
}

// Function overloads for better type inference
/**
 * Creates a context for managing object state
 * @param initialData The initial object data
 * @param storage Storage type to use
 * @param key Unique key for the store
 * @returns A store instance for the object
 */
export function createContext<T extends Record<string, any>>(
	initialData: T,
	storage: StorageType,
	key: string,
): IStore<T> & SchmancyStoreObject<T>

/**
 * Creates a context for managing collection state
 * @param initialData The initial Map collection
 * @param storage Storage type to use
 * @param key Unique key for the store
 * @returns A collection store instance
 */
export function createContext<V>(
	initialData: Map<string, V>,
	storage: StorageType,
	key: string,
): ICollectionStore<V> & SchmancyCollectionStore<V>

/**
 * Creates a context for managing array state
 * @param initialData The initial array
 * @param storage Storage type to use
 * @param key Unique key for the store
 * @returns An array store instance
 */
export function createContext<T>(
	initialData: T[],
	storage: StorageType,
	key: string,
): IArrayStore<T> & SchmancyArrayStore<T>

/**
 * Implementation of the createContext function with complete type checking
 */
export function createContext<T extends Record<string, any> | Map<string, any> | any[]>(
	initialData: T,
	storage: StorageType,
	key: string,
):
	| (IStore<T> & SchmancyStoreObject<T>)
	| (ICollectionStore<any> & SchmancyCollectionStore<any>)
	| (IArrayStore<any> & SchmancyArrayStore<any>) {
	// Validate input
	if (initialData === null || initialData === undefined) {
		throw new StoreError('Initial data cannot be null or undefined', null, { storage, key })
	}

	// Determine store type based on input data with improved type checking
	if (isMap<string, any>(initialData)) {
		return createCollectionStore<any>(initialData, storage, key)
	} else if (isArray<any>(initialData)) {
		return createArrayStore<any>(initialData, storage, key)
	} else if (typeof initialData === 'object') {
		return createObjectStore<any>(initialData as Record<string, any>, storage, key)
	} else {
		throw new StoreError('Initial data must be an object, an array, or a Map', null, {
			storage,
			key,
			dataType: typeof initialData,
		})
	}
}

/**
 * Creates an array context with simplified API and type inference
 * @param initialData The initial array data
 * @param key Unique key for the store
 * @param storage Storage type to use (defaults to 'local')
 * @returns An array store instance
 */
export function createArrayContext<T>(
	initialData: T[] = [],
	key: string,
	storage: StorageType = 'local',
): IArrayStore<T> & SchmancyArrayStore<T> {
	return createContext<T>(initialData, storage, key)
}

/**
 * Creates a testable array context
 * @param initialData The initial array data
 * @param key Unique key for the store
 * @returns An array store that uses memory storage
 */
export function createTestArrayContext<T>(
	initialData: T[] = [],
	key: string = 'test-array',
): IArrayStore<T> & SchmancyArrayStore<T> {
	return createContext<T>(initialData, 'memory', key)
}

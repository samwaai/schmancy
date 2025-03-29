// src/store/context-create.ts - Improved type safety
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
 * Type guard for Map objects with improved specificity
 */
function isMap<K, V>(value: unknown): value is Map<K, V> {
	return value instanceof Map
}

/**
 * Creates a regular object store with better typing
 * @throws StoreError if the storage type is not supported or if there's an error
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
 * Implementation of the createContext function with complete type checking
 */
export function createContext<T extends Record<string, any> | Map<string, any>>(
	initialData: T,
	storage: StorageType,
	key: string,
): (IStore<T> & SchmancyStoreObject<T>) | (ICollectionStore<any> & SchmancyCollectionStore<any>) {
	// Validate input
	if (initialData === null || initialData === undefined) {
		throw new StoreError('Initial data cannot be null or undefined', null, { storage, key })
	}

	// Determine store type based on input data with improved type checking
	if (isMap<string, any>(initialData)) {
		return createCollectionStore<any>(initialData, storage, key)
	} else if (typeof initialData === 'object') {
		return createObjectStore(initialData as Record<string, any>, storage, key)
	} else {
		throw new StoreError('Initial data must be an object or a Map', null, {
			storage,
			key,
			dataType: typeof initialData,
		})
	}
}

/**
 * Creates an object context with simplified API and type inference
 * @param initialData The initial object data
 * @param key Unique key for the store
 * @param storage Storage type to use (defaults to 'local')
 * @returns A store instance
 */
export function createObjectContext<T extends Record<string, any>>(
	initialData: T,
	key: string,
	storage: StorageType = 'local',
): IStore<T> & SchmancyStoreObject<T> {
	return createContext(initialData, storage, key)
}

/**
 * Creates a collection context with simplified API and type inference
 * @param initialData The initial collection (Map or array)
 * @param key Unique key for the store
 * @param storage Storage type to use (defaults to 'local')
 * @returns A collection store instance
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

/**
 * Creates a testable context that can be easily reset between tests
 * @param initialData The initial data
 * @param key Unique key for the store
 * @returns A store instance that uses memory storage (does not persist)
 */
export function createTestContext<T extends Record<string, any>>(
	initialData: T,
	key: string = 'test-store',
): IStore<T> & SchmancyStoreObject<T> {
	return createContext(initialData, 'memory', key)
}

/**
 * Creates a testable collection context
 * @param initialData The initial collection
 * @param key Unique key for the store
 * @returns A collection store that uses memory storage
 */
export function createTestCollectionContext<V>(
	initialData: Map<string, V> | V[],
	key: string = 'test-collection',
): ICollectionStore<V> & SchmancyCollectionStore<V> {
	const dataMap = Array.isArray(initialData)
		? new Map(initialData.map((item, index) => [String(index), item]))
		: initialData

	return createContext<V>(dataMap, 'memory', key)
}

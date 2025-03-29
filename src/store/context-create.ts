// src/store/context-create.ts - Fixed version

import { SchmancyArrayStore } from './context-array'
import SchmancyCollectionStore from './context-collection'
import { SchmancyStoreObject } from './context-object'
import { IArrayStore, ICollectionStore, IStore, StorageType } from './types'

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
 * Type guard for plain objects (not arrays, maps, null, etc.)
 */
function isPlainObject(value: unknown): boolean {
	return (
		value !== null &&
		typeof value === 'object' &&
		!Array.isArray(value) &&
		!(value instanceof Map) &&
		!(value instanceof Set) &&
		!(value instanceof Date) &&
		!(value instanceof RegExp) &&
		Object.getPrototypeOf(value) === Object.prototype
	)
}

/**
 * Creates a regular object store with better typing and error handling
 */
function createObjectStore<T extends Record<string, any>>(
	initialData: T,
	storage: StorageType,
	key: string,
): IStore<T> & SchmancyStoreObject<T> {
	try {
		// Validate storage type
		if (storage === 'indexeddb') {
			console.warn(`IndexedDB storage is not optimal for plain objects. Using 'local' instead for key: ${key}`)
			storage = 'local'
		}

		// Ensure initialData is a plain object
		if (!isPlainObject(initialData)) {
			console.warn(`Initial data is not a plain object. Converting to object for key: ${key}`)
			initialData = { ...initialData } as T
		}

		// Create the store instance
		const store = SchmancyStoreObject.getInstance<T>(storage, key, initialData)

		// Initialize with provided data if store is empty
		if (isEmptyObject(store.value)) {
			store.set({ ...initialData }) // Use spread to create a copy
		}

		return store
	} catch (err) {
		console.error(`Failed to create object store for key: ${key}`, err)
		// Fall back to a basic implementation that won't throw
		const fallbackStore = SchmancyStoreObject.getInstance<T>(
			'memory', // Fallback to memory storage
			`${key}-fallback`,
			initialData,
		)
		console.warn(`Using fallback memory store for key: ${key}`)
		return fallbackStore
	}
}

/**
 * Creates a collection store with better typing and error handling
 */
function createCollectionStore<V>(
	initialData: Map<string, V>,
	storage: StorageType,
	key: string,
): ICollectionStore<V> & SchmancyCollectionStore<V> {
	try {
		// Create the store instance
		const store = SchmancyCollectionStore.getInstance(storage, key, initialData)

		// Initialize with provided data if store is empty
		if (!store.value.size) {
			// Create a new Map instance to avoid modifying the input
			store.replace(new Map(initialData))
		}

		return store
	} catch (err) {
		console.error(`Failed to create collection store for key: ${key}`, err)
		// Fall back to a basic implementation that won't throw
		const fallbackStore = SchmancyCollectionStore.getInstance<V>(
			'memory', // Fallback to memory storage
			`${key}-fallback`,
			new Map(initialData),
		)
		console.warn(`Using fallback memory store for key: ${key}`)
		return fallbackStore
	}
}

/**
 * Creates an array store with better typing and error handling
 */
function createArrayStore<T>(
	initialData: T[],
	storage: StorageType,
	key: string,
): IArrayStore<T> & SchmancyArrayStore<T> {
	try {
		// Create the store instance
		const store = SchmancyArrayStore.getInstance(storage, key, initialData)

		// Initialize with provided data if store is empty
		if (!store.value.length) {
			// Create a new array instance to avoid modifying the input
			store.replace([...initialData])
		}

		return store
	} catch (err) {
		console.error(`Failed to create array store for key: ${key}`, err)
		// Fall back to a basic implementation that won't throw
		const fallbackStore = SchmancyArrayStore.getInstance<T>(
			'memory', // Fallback to memory storage
			`${key}-fallback`,
			[...initialData],
		)
		console.warn(`Using fallback memory store for key: ${key}`)
		return fallbackStore
	}
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
 * and robust error handling
 */
export function createContext<T extends Record<string, any> | Map<string, any> | any[]>(
	initialData: T,
	storage: StorageType,
	key: string,
):
	| (IStore<T> & SchmancyStoreObject<T>)
	| (ICollectionStore<any> & SchmancyCollectionStore<any>)
	| (IArrayStore<any> & SchmancyArrayStore<any>) {
	try {
		// Validate input
		if (initialData === null || initialData === undefined) {
			console.error('Initial data cannot be null or undefined')
			// Provide a sensible default based on type expected
			if (key.includes('collection') || key.includes('map')) {
				initialData = new Map() as unknown as T
			} else if (key.includes('array') || key.includes('list')) {
				initialData = [] as unknown as T
			} else {
				initialData = {} as T
			}
		}

		// Determine store type based on input data with improved type checking
		if (isMap<string, any>(initialData)) {
			return createCollectionStore<any>(initialData, storage, key)
		} else if (isArray<any>(initialData)) {
			return createArrayStore<any>(initialData, storage, key)
		} else if (typeof initialData === 'object') {
			return createObjectStore<any>(initialData as Record<string, any>, storage, key)
		} else {
			// Handle non-object data by wrapping it
			console.warn(`Initial data must be an object, array, or Map. Got ${typeof initialData}. Creating object wrapper.`)
			return createObjectStore<any>({ value: initialData } as Record<string, any>, storage, key)
		}
	} catch (error) {
		// Last-resort error handling
		console.error(`Fatal error creating context for ${key}:`, error)

		// Create an emergency fallback store that won't throw
		return createObjectStore<any>(
			typeof initialData === 'object' && initialData !== null ? { ...initialData } : { value: initialData },
			'memory',
			`emergency-fallback-${key}`,
		)
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
	try {
		return createContext<T>(initialData, storage, key)
	} catch (err) {
		console.error(`Failed to create array context for key: ${key}`, err)
		// Return a fallback store
		return createArrayStore<T>(initialData, 'memory', `${key}-fallback`)
	}
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
	try {
		return createContext<T>(initialData, 'memory', key)
	} catch (err) {
		console.error(`Failed to create test array context for key: ${key}`, err)
		// Return a fallback store with a different key
		return createArrayStore<T>(initialData, 'memory', `${key}-emergency-fallback`)
	}
}

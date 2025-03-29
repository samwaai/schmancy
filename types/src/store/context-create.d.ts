import { SchmancyArrayStore } from './context-array';
import SchmancyCollectionStore from './context-collection';
import { SchmancyStoreObject } from './context-object';
import { IArrayStore, ICollectionStore, IStore, StorageType } from './types';
/**
 * Creates a context for managing object state
 * @param initialData The initial object data
 * @param storage Storage type to use
 * @param key Unique key for the store
 * @returns A store instance for the object
 */
export declare function createContext<T extends Record<string, any>>(initialData: T, storage: StorageType, key: string): IStore<T> & SchmancyStoreObject<T>;
/**
 * Creates a context for managing collection state
 * @param initialData The initial Map collection
 * @param storage Storage type to use
 * @param key Unique key for the store
 * @returns A collection store instance
 */
export declare function createContext<V>(initialData: Map<string, V>, storage: StorageType, key: string): ICollectionStore<V> & SchmancyCollectionStore<V>;
/**
 * Creates a context for managing array state
 * @param initialData The initial array
 * @param storage Storage type to use
 * @param key Unique key for the store
 * @returns An array store instance
 */
export declare function createContext<T>(initialData: T[], storage: StorageType, key: string): IArrayStore<T> & SchmancyArrayStore<T>;
/**
 * Creates an array context with simplified API and type inference
 * @param initialData The initial array data
 * @param key Unique key for the store
 * @param storage Storage type to use (defaults to 'local')
 * @returns An array store instance
 */
export declare function createArrayContext<T>(initialData: T[], key: string, storage?: StorageType): IArrayStore<T> & SchmancyArrayStore<T>;
/**
 * Creates a testable array context
 * @param initialData The initial array data
 * @param key Unique key for the store
 * @returns An array store that uses memory storage
 */
export declare function createTestArrayContext<T>(initialData?: T[], key?: string): IArrayStore<T> & SchmancyArrayStore<T>;

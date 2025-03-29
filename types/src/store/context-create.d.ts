import SchmancyCollectionStore from './context-collection';
import { SchmancyStoreObject } from './context-object';
import { ICollectionStore, IStore, StorageType } from './types';
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
 * Creates an object context with simplified API and type inference
 * @param initialData The initial object data
 * @param key Unique key for the store
 * @param storage Storage type to use (defaults to 'local')
 * @returns A store instance
 */
export declare function createObjectContext<T extends Record<string, any>>(initialData: T, key: string, storage?: StorageType): IStore<T> & SchmancyStoreObject<T>;
/**
 * Creates a collection context with simplified API and type inference
 * @param initialData The initial collection (Map or array)
 * @param key Unique key for the store
 * @param storage Storage type to use (defaults to 'local')
 * @returns A collection store instance
 */
export declare function createCollectionContext<V>(initialData: Map<string, V> | V[], key: string, storage?: StorageType): ICollectionStore<V> & SchmancyCollectionStore<V>;
/**
 * Creates a testable context that can be easily reset between tests
 * @param initialData The initial data
 * @param key Unique key for the store
 * @returns A store instance that uses memory storage (does not persist)
 */
export declare function createTestContext<T extends Record<string, any>>(initialData: T, key?: string): IStore<T> & SchmancyStoreObject<T>;
/**
 * Creates a testable collection context
 * @param initialData The initial collection
 * @param key Unique key for the store
 * @returns A collection store that uses memory storage
 */
export declare function createTestCollectionContext<V>(initialData: Map<string, V> | V[], key?: string): ICollectionStore<V> & SchmancyCollectionStore<V>;

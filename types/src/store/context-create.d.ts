import SchmancyCollectionStore from './context-collection';
import { SchmancyStoreObject } from './context-object';
import { ICollectionStore, IStore, StorageType } from './types';
/**
 * Creates a context for managing state with better type safety
 * Overload for object stores
 */
export declare function createContext<T extends Record<string, any>>(initialData: T, storage: StorageType, key: string): IStore<T> & SchmancyStoreObject<T>;
/**
 * Creates a context for managing state with better type safety
 * Overload for collection stores
 */
export declare function createContext<V>(initialData: Map<string, V>, storage: StorageType, key: string): ICollectionStore<V> & SchmancyCollectionStore<V>;
/**
 * Creates a context with type inference, simplifying common patterns
 */
export declare function createObjectContext<T extends Record<string, any>>(initialData: T, key: string, storage?: StorageType): IStore<T> & SchmancyStoreObject<T>;
/**
 * Creates a collection context with type inference
 */
export declare function createCollectionContext<V>(initialData: Map<string, V> | V[], key: string, storage?: StorageType): ICollectionStore<V> & SchmancyCollectionStore<V>;

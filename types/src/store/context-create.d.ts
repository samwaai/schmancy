import { ICollectionStore, IStore, StorageType } from './types';
import { SchmancyStoreObject } from './context-object';
import SchmancyCollectionStore from './context-collection';
/**
 * Creates a context for managing state with better type safety
 */
export declare function createContext<T extends Record<string, any>>(initialData: T, storage: StorageType, key: string): IStore<T> & SchmancyStoreObject<T>;
export declare function createContext<V>(initialData: Map<string, V>, storage: StorageType, key: string): ICollectionStore<V> & SchmancyCollectionStore<V>;

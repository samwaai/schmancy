import { BehaviorSubject, Observable } from 'rxjs';
/**
 * Storage types supported by the store
 */
export type StorageType = 'memory' | 'local' | 'session' | 'indexeddb';
/**
 * Base store options
 */
export interface StoreOptions<T> {
    /** Key used for persistent storage */
    key: string;
    /** Storage type */
    storage: StorageType;
    /** Initial state */
    initialState: T;
    /** Enable dev tools */
    devTools?: boolean;
}
/**
 * Enhanced store error with type information and better context handling
 */
export declare class StoreError<T = unknown> extends Error {
    /** Original error that caused this store error */
    readonly cause?: T;
    /** Additional contextual information */
    readonly context?: Record<string, unknown>;
    /** Timestamp when the error occurred */
    readonly timestamp: Date;
    constructor(message: string, cause?: T, context?: Record<string, unknown>);
    /**
     * Returns a JSON-serializable representation of the error
     */
    toJSON(): Record<string, unknown>;
}
/**
 * Core store interface with improved type definitions
 */
export interface IStore<T extends Record<string, any>> {
    /** Get the current store value */
    readonly value: T;
    /** Observable stream of store values */
    readonly $: BehaviorSubject<T>;
    /** The default/initial value of the store */
    readonly defaultValue: T;
    /** Whether the store is ready (loaded from storage) */
    ready: boolean;
    /** Observable stream of store errors */
    readonly error$: Observable<StoreError | null>;
    /**
     * Update store value with partial data
     * @param value Partial data to update
     * @param merge Whether to merge with existing data (default: true)
     */
    set(value: Partial<T>, merge?: boolean): void;
    /**
     * Reset store to default value
     */
    clear(): void;
    /**
     * Replace entire store value
     * @param newValue New value to set
     */
    replace(newValue: T): void;
    /**
     * Delete a specific key from the store
     * @param key Key to delete
     */
    delete<K extends keyof T>(key: K): void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/**
 * Interface for collection stores with improved typing
 */
export interface ICollectionStore<T> {
    /** Get the current collection value */
    readonly value: Map<string, T>;
    /** Observable stream of collection values */
    readonly $: BehaviorSubject<Map<string, T>>;
    /** The default/initial value of the collection */
    readonly defaultValue: Map<string, T>;
    /** Whether the store is ready (loaded from storage) */
    ready: boolean;
    /** Observable stream of store errors */
    readonly error$: Observable<StoreError | null>;
    /**
     * Set a value in the collection
     * @param key Item key
     * @param value Item value
     */
    set<V = T>(key: string, value: V): void;
    /**
     * Delete an item from the collection
     * @param key Item key to delete
     */
    delete(key: string): void;
    /**
     * Clear all items from the collection
     */
    clear(): void;
    /**
     * Replace the entire collection
     * @param newValue New collection value
     */
    replace(newValue: Map<string, T>): void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/**
 * Interface for a storage manager
 */
export interface IStorageManager<T> {
    /**
     * Load data from storage
     * @returns Promise resolving to stored data or null
     */
    load(): Promise<T | null>;
    /**
     * Save data to storage
     * @param state Data to save
     */
    save(state: T): Promise<void>;
    /**
     * Clear data from storage
     */
    clear(): Promise<void>;
}
/**
 * Factory function type for creating stores
 */
export type StoreFactory = <T extends Record<string, any>>(initialData: T, storage: StorageType, key: string) => IStore<T>;
/**
 * Factory function type for creating collection stores
 */
export type CollectionStoreFactory = <T>(initialData: Map<string, T>, storage: StorageType, key: string) => ICollectionStore<T>;

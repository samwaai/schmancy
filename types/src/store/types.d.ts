import { Draft } from 'immer';
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
/**
 * Interface for array stores with improved typing
 */
export interface IArrayStore<T> {
    /** Get the current array value */
    readonly value: T[];
    /** Observable stream of array values */
    readonly $: BehaviorSubject<T[]>;
    /** The default/initial value of the array */
    readonly defaultValue: T[];
    /** Whether the store is ready (loaded from storage) */
    ready: boolean;
    /** Observable stream of store errors */
    readonly error$: Observable<StoreError | null>;
    /**
     * Add item(s) to the end of the array
     * @param items Items to add
     */
    push(...items: T[]): void;
    /**
     * Remove and return the last item from the array
     * @returns The removed item or undefined if the array was empty
     */
    pop(): T | undefined;
    /**
     * Add item(s) to the beginning of the array
     * @param items Items to add
     */
    unshift(...items: T[]): void;
    /**
     * Remove and return the first item from the array
     * @returns The removed item or undefined if the array was empty
     */
    shift(): T | undefined;
    /**
     * Update an item at a specific index
     * @param index The index to update
     * @param value The new value
     */
    set(index: number, value: T): void;
    /**
     * Get the item at a specific index
     * @param index The index to get
     * @returns The item or undefined if index is out of bounds
     */
    get(index: number): T | undefined;
    /**
     * Remove items from the array and optionally insert new ones
     * @param start The start index
     * @param deleteCount The number of items to delete
     * @param items Items to insert
     * @returns The removed items
     */
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
    /**
     * Remove an item by value (first occurrence)
     * @param item The item to remove
     * @param compareFn Optional function to compare items
     * @returns True if the item was found and removed
     */
    remove(item: T, compareFn?: (a: T, b: T) => boolean): boolean;
    /**
     * Replace the entire array
     * @param newArray The new array
     */
    replace(newArray: T[]): void;
    /**
     * Filter items in the array
     * @param predicate Function to test each item
     */
    filter(predicate: (value: T, index: number, array: T[]) => boolean): void;
    /**
     * Map over the array and transform items
     * @param mapper Function to transform each item
     * @returns Array of transformed items
     */
    map<U>(mapper: (value: T, index: number, array: T[]) => U): U[];
    /**
     * Sort the array in place
     * @param compareFn Optional function to determine sort order
     */
    sort(compareFn?: (a: T, b: T) => number): void;
    /**
     * Update a specific item using a callback function
     * @param index The index to update
     * @param updater Function that can modify the item
     */
    update(index: number, updater: (item: Draft<T>) => void): void;
    /**
     * Clear all items from the array
     */
    clear(): void;
    /**
     * Clean up resources
     */
    destroy(): void;
}
/**
 * Factory function type for creating array stores
 */
export type ArrayStoreFactory = <T>(initialData: T[], storage: StorageType, key: string) => IArrayStore<T>;

import { BaseStore } from './store.class';
import { ICollectionStore, StorageType } from './types';
import { Draft } from 'immer';
/**
 * Enhanced collection store with better TypeScript support and immutability
 * Now extends BaseStore for common functionality
 */
export default class SchmancyCollectionStore<V = any> extends BaseStore<Map<string, V>> implements ICollectionStore<V> {
    static type: string;
    private static instances;
    /**
     * Static method to get or create an instance with proper typing
     */
    static getInstance<V = any>(storage: StorageType, key: string, defaultValue: Map<string, V>): SchmancyCollectionStore<V>;
    /**
     * Set values in the collection with proper typing and immutability.
     * Supports multiple input types to prevent common developer mistakes.
     *
     * @example
     * // Single key-value pair
     * store.set('key1', value1)
     *
     * @example
     * // Merge from a Map
     * const dataMap = new Map([['key1', value1], ['key2', value2]])
     * store.set(dataMap)
     *
     * @example
     * // Merge from an object
     * store.set({ key1: value1, key2: value2 })
     */
    set<T = V>(keyOrData: string | Map<string, T> | Record<string, T>, value?: T): void;
    /**
     * Merge a Map into the collection. This is a helper method that provides
     * explicit semantics for merging operations.
     *
     * @param map The Map to merge into the collection
     * @example
     * const dataMap = new Map([['key1', value1], ['key2', value2]])
     * store.merge(dataMap)
     */
    merge<T = V>(map: Map<string, T>): void;
    /**
     * Delete a value from the collection immutably
     */
    delete(key: string): void;
    /**
     * Clear the collection immutably
     */
    clear(): void;
    /**
     * Batch update multiple items in the collection
     * @param updates Object with keys and values to update
     */
    batchUpdate(updates: Record<string, V>): void;
    /**
     * Update an existing item in the collection using an updater function
     * @param key Key of the item to update
     * @param updater Function that receives the current value and returns the new value
     */
    update(key: string, updater: (currentValue: Draft<V>) => void): void;
    /**
     * Constructor extension to set up persistence
     */
    constructor(storageType: StorageType, key: string, defaultValue: Map<string, V>);
    /**
     * Set up persistence to storage with throttling
     */
    private setupPersistence;
    /**
     * Setup development tools for debugging
     */
    protected setupDevTools(): void;
}

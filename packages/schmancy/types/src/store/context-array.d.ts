import { Draft } from 'immer';
import { BaseStore } from './store.class';
import { IArrayStore, StorageType } from './types';
/**
 * Enhanced array store with TypeScript support and immutability
 * Extends BaseStore for common functionality
 */
export declare class SchmancyArrayStore<T = any> extends BaseStore<T[]> implements IArrayStore<T> {
    static type: string;
    private static instances;
    /**
     * Static method to get or create an instance with proper typing
     */
    static getInstance<T = any>(storage: StorageType, key: string, defaultValue?: T[]): SchmancyArrayStore<T>;
    /**
     * Constructor extension to set up persistence
     */
    constructor(storageType: StorageType, key: string, defaultValue?: T[]);
    /**
     * Set up persistence to storage with throttling
     */
    private setupPersistence;
    /**
     * Add an item to the end of the array
     */
    push(...items: T[]): void;
    /**
     * Remove and return the last item from the array
     */
    pop(): T | undefined;
    /**
     * Add item(s) to the beginning of the array
     */
    unshift(...items: T[]): void;
    /**
     * Remove and return the first item from the array
     */
    shift(): T | undefined;
    /**
     * Update an item at a specific index
     */
    set(index: number, value: T): void;
    /**
     * Get item at a specific index
     */
    get(index: number): T | undefined;
    /**
     * Remove items from the array
     */
    splice(start: number, deleteCount?: number, ...items: T[]): T[];
    /**
     * Remove an item by value (first occurrence)
     */
    remove(item: T, compareFn?: (a: T, b: T) => boolean): boolean;
    /**
     * Replace entire array
     */
    replace(newArray: T[]): void;
    /**
     * Filter items in the array
     */
    filter(predicate: (value: T, index: number, array: T[]) => boolean): void;
    /**
     * Map over the array and transform items
     */
    map<U>(mapper: (value: T, index: number, array: T[]) => U): U[];
    /**
     * Sort the array in place
     */
    sort(compareFn?: (a: T, b: T) => number): void;
    /**
     * Update a specific item using a callback function
     */
    update(index: number, updater: (item: Draft<T>) => void): void;
    /**
     * Clear the array
     */
    clear(): void;
    /**
     * Setup development tools for debugging
     */
    protected setupDevTools(): void;
}

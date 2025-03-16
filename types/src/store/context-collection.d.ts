import { BehaviorSubject } from 'rxjs';
import { ICollectionStore, StorageType, StoreError } from './types';
/**
 * Enhanced collection store with better TypeScript support
 */
export default class SchmancyCollectionStore<V = any> implements ICollectionStore<V> {
    private storageType;
    private key;
    static type: string;
    private static instances;
    private _ready;
    private _destroy$;
    $: BehaviorSubject<Map<string, V>>;
    error$: BehaviorSubject<StoreError<unknown>>;
    readonly defaultValue: Map<string, V>;
    private storage;
    /**
     * Get ready state
     */
    get ready(): boolean;
    /**
     * Set ready state
     */
    set ready(value: boolean);
    private constructor();
    /**
     * Static method to get or create an instance with proper typing
     */
    static getInstance<V = any>(storage: StorageType, key: string, defaultValue: Map<string, V>): SchmancyCollectionStore<V>;
    /**
     * Get the current value
     */
    get value(): Map<string, V>;
    /**
     * Set a value in the collection with proper typing
     */
    set<T = V>(key: string, value: T): void;
    /**
     * Delete a value from the collection
     */
    delete(key: string): void;
    /**
     * Clear the collection
     */
    clear(): void;
    replace(newValue: Map<string, V>): void;
    /**
     * Update the state with error handling
     */
    private updateState;
    /**
     * Initialize from persistent storage
     */
    private initializeFromStorage;
    /**
     * Load data from IndexedDB with better typing
     */
    private loadFromIndexedDB;
    /**
     * Set up persistence to storage
     */
    private setupPersistence;
    /**
     * Setup development tools for debugging
     */
    private setupDevTools;
    /**
     * Clean up resources
     */
    destroy(): void;
}

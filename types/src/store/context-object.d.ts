import { BehaviorSubject } from 'rxjs';
import { IStore, StorageType, StoreError } from './types';
/**
 * Enhanced store object with better TypeScript support
 */
export declare class SchmancyStoreObject<T extends Record<string, any>> implements IStore<T> {
    private storageType;
    private key;
    static type: string;
    private static instances;
    private _ready;
    private _destroy$;
    $: BehaviorSubject<T>;
    error$: BehaviorSubject<StoreError<unknown>>;
    readonly defaultValue: T;
    private storage;
    /**
     * Get store ready state
     */
    get ready(): boolean;
    /**
     * Set store ready state
     */
    set ready(value: boolean);
    /**
     * Private constructor to enforce singleton pattern
     */
    private constructor();
    /**
     * Static method to get or create an instance with strong typing
     */
    static getInstance<T extends Record<string, any>>(storage: StorageType, key: string, defaultValue: T): SchmancyStoreObject<T>;
    /**
     * Get the current value from the store
     */
    get value(): T;
    /**
     * Set state with proper typing
     */
    set(value: Partial<T>, merge?: boolean): void;
    /**
     * Reset the store to its default value
     */
    clear(): void;
    /**
     * Replace the store with a new value
     */
    replace(newValue: T): void;
    /**
     * Delete a specific key from the store with type checking
     */
    delete<K extends keyof T>(key: K): void;
    /**
     * Update the state with proper error handling
     */
    private updateState;
    /**
     * Initialize the store from persistent storage
     */
    private initializeFromStorage;
    /**
     * Setup development tools for debugging
     */
    private setupDevTools;
    /**
     * Clean up resources
     */
    destroy(): void;
}

import { immerable } from 'immer';
import { BehaviorSubject } from 'rxjs';
import { IStorageManager, StorageType } from './types';
/**
 * Base store class to handle common functionality between store types
 * Now with Immer integration for immutability
 */
export declare abstract class BaseStore<T> {
    [immerable]: boolean;
    protected storageType: StorageType;
    protected key: string;
    protected _ready: boolean;
    protected _destroy$: any;
    $: BehaviorSubject<T>;
    error$: any;
    readonly defaultValue: T;
    protected storage: IStorageManager<T>;
    /**
     * Get store ready state
     */
    get ready(): boolean;
    /**
     * Set store ready state
     */
    set ready(value: boolean);
    /**
     * Get the current value
     */
    get value(): T;
    /**
     * Initialize the base store
     * @param storageType Storage type to use
     * @param key Unique key for the store
     * @param defaultValue Default/initial value
     */
    constructor(storageType: StorageType, key: string, defaultValue: T);
    /**
     * Check if a value can be safely used with Immer's produce
     */
    protected isImmerDraftable(value: any): boolean;
    /**
     * Cleanup method for all store types
     */
    destroy(): void;
    /**
     * Replace the entire store state immutably
     */
    replace(newValue: T): void;
    /**
     * Reset to default value - to be implemented by subclasses
     */
    abstract clear(): void;
    /**
     * Update the state with proper error handling and immutability
     */
    protected updateState(newValue: T): void;
    /**
     * Initialize the store from persistent storage
     */
    protected initializeFromStorage(): Promise<void>;
    /**
     * Process stored value (can be overridden by subclasses)
     */
    protected processStoredValue(storedValue: T): T;
    /**
     * Persist state to storage
     */
    protected persistToStorage(state: T): Promise<void>;
    /**
     * Setup development tools
     */
    protected abstract setupDevTools(): void;
}

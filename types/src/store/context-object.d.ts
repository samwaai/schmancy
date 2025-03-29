import { BaseStore } from './store.class';
import { IStore, StorageType } from './types';
/**
 * Enhanced store object with better TypeScript support and immutability
 * Now extends BaseStore for common functionality and uses Immer
 */
export declare class SchmancyStoreObject<T extends Record<string, any>> extends BaseStore<T> implements IStore<T> {
    static type: string;
    private static instances;
    /**
     * Static method to get or create an instance with strong typing
     */
    static getInstance<T extends Record<string, any>>(storage: StorageType, key: string, defaultValue: T): SchmancyStoreObject<T>;
    /**
     * Set state with proper typing and immutability using Immer
     */
    set(value: Partial<T>, merge?: boolean): void;
    /**
     * Reset the store to its default value
     */
    clear(): void;
    /**
     * Delete a specific key from the store with type checking and immutability
     */
    delete<K extends keyof T>(key: K): void;
    /**
     * Update a nested property at a specific path
     * @param path Dot-separated path to the property (e.g., 'user.profile.name')
     * @param value New value to set
     */
    setPath(path: string, value: any): void;
    /**
     * Process stored value by merging with default value
     */
    protected processStoredValue(storedValue: T): T;
    /**
     * Setup development tools for debugging
     */
    protected setupDevTools(): void;
}

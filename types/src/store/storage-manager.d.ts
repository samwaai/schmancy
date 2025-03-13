import { StorageType } from './types';
/**
 * Storage manager interface with generic typing
 */
export interface StorageManager<T> {
    load(): Promise<T | null>;
    save(state: T): Promise<void>;
    clear(): Promise<void>;
}
/**
 * Memory storage manager implementation
 */
export declare class MemoryStorageManager<T> implements StorageManager<T> {
    private data;
    load(): Promise<T | null>;
    save(state: T): Promise<void>;
    clear(): Promise<void>;
}
/**
 * Local storage manager implementation
 */
export declare class LocalStorageManager<T> implements StorageManager<T> {
    private key;
    constructor(key: string);
    load(): Promise<T | null>;
    save(state: T): Promise<void>;
    clear(): Promise<void>;
}
/**
 * Session storage manager implementation
 */
export declare class SessionStorageManager<T> implements StorageManager<T> {
    private key;
    constructor(key: string);
    load(): Promise<T | null>;
    save(state: T): Promise<void>;
    clear(): Promise<void>;
}
/**
 * IndexedDB storage manager implementation with better error typing
 */
export declare class IndexedDBStorageManager<T> implements StorageManager<T> {
    private key;
    private static DB_NAME;
    private static STORE_NAME;
    private static DB_VERSION;
    constructor(key: string);
    private openDB;
    load(): Promise<T | null>;
    save(state: T): Promise<void>;
    clear(): Promise<void>;
}
/**
 * Factory function to create the appropriate storage manager
 */
export declare function createStorageManager<T>(type: StorageType, key: string): StorageManager<T>;

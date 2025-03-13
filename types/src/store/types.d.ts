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
 * Action interface for all store actions
 */
export interface Action<T = any> {
    type: string;
    payload?: T;
}
/**
 * Type-safe action creator
 */
export type ActionCreator<P = void, R = void> = P extends void ? () => R : (payload: P) => R;
/**
 * Map of action creators with preserved function signatures
 */
export type ActionCreatorMap<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never;
};
/**
 * Reducer function type
 */
export type Reducer<T> = (state: T, action: Action) => T;
/**
 * Middleware function type
 */
export type Middleware<T> = (prevState: T, nextState: T, context: {
    type: string;
    payload?: any;
}) => void;
/**
 * Selector function type
 */
export type Selector<S, R> = (state: S) => R;
/**
 * Enhanced store error with type information
 */
export declare class StoreError<T = unknown> extends Error {
    readonly cause?: T;
    readonly context?: Record<string, unknown>;
    constructor(message: string, cause?: T, context?: Record<string, unknown>);
}
/**
 * Core store interface
 */
export interface IStore<T> {
    value: T;
    $: BehaviorSubject<T>;
    set(value: Partial<T>, merge?: boolean): void;
    clear(): void;
    replace(newValue: T): void;
    ready: boolean;
    error$: Observable<StoreError | null>;
}
/**
 * Interface for collection stores
 * No longer extends IStore to avoid method signature conflicts
 */
export interface ICollectionStore<T> {
    value: Map<string, T>;
    $: BehaviorSubject<Map<string, T>>;
    set<V = T>(key: string, value: V): void;
    delete(key: string): void;
    clear(): void;
    replace(newValue: Map<string, T>): void;
    ready: boolean;
    error$: Observable<StoreError | null>;
}

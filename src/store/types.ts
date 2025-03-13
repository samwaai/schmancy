// src/store/types.ts
import { BehaviorSubject, Observable } from 'rxjs'

/**
 * Storage types supported by the store
 */
export type StorageType = 'memory' | 'local' | 'session' | 'indexeddb'

/**
 * Base store options
 */
export interface StoreOptions<T> {
	/** Key used for persistent storage */
	key: string
	/** Storage type */
	storage: StorageType
	/** Initial state */
	initialState: T
	/** Enable dev tools */
	devTools?: boolean
}

/**
 * Action interface for all store actions
 */
export interface Action<T = any> {
	type: string
	payload?: T
}

/**
 * Type-safe action creator
 */
export type ActionCreator<P = void, R = void> = P extends void ? () => R : (payload: P) => R

/**
 * Map of action creators with preserved function signatures
 */
export type ActionCreatorMap<T> = {
	[K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never
}

/**
 * Reducer function type
 */
export type Reducer<T> = (state: T, action: Action) => T

/**
 * Middleware function type
 */
export type Middleware<T> = (prevState: T, nextState: T, context: { type: string; payload?: any }) => void

/**
 * Selector function type
 */
export type Selector<S, R> = (state: S) => R

/**
 * Enhanced store error with type information
 */
export class StoreError<T = unknown> extends Error {
	constructor(message: string, public readonly cause?: T, public readonly context?: Record<string, unknown>) {
		super(message)
		this.name = 'StoreError'
	}
}

/**
 * Core store interface
 */
export interface IStore<T> {
	// Value getters with strong return types
	value: T
	$: BehaviorSubject<T>

	// Methods with improved parameter and return types
	set(value: Partial<T>, merge?: boolean): void
	clear(): void
	replace(newValue: T): void

	// Ready state with correct type
	ready: boolean

	// Error handling
	error$: Observable<StoreError | null>
}

/**
 * Interface for collection stores
 * No longer extends IStore to avoid method signature conflicts
 */
export interface ICollectionStore<T> {
	// Value getters with strong return types
	value: Map<string, T>
	$: BehaviorSubject<Map<string, T>>

	// Methods specific to collections
	set<V = T>(key: string, value: V): void
	delete(key: string): void
	clear(): void
	replace(newValue: Map<string, T>): void

	// Ready state with correct type
	ready: boolean

	// Error handling
	error$: Observable<StoreError | null>
}

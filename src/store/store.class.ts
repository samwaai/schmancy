// src/store/store.class.ts
import { produce } from 'immer'
import { BehaviorSubject, Subject } from 'rxjs'
import { createStorageManager } from './storage-manager'
import { IStorageManager, StorageType, StoreError } from './types'
// src/index.ts or main.ts or similar
import { enableMapSet } from 'immer'
enableMapSet()

/**
 * Base store class to handle common functionality between store types
 * Now with Immer integration for immutability
 */
export abstract class BaseStore<T> {
	// State tracking
	protected _ready: boolean = false
	protected _destroy$ = new Subject<void>()

	// Observable streams
	public $: BehaviorSubject<T>
	public error$ = new BehaviorSubject<StoreError | null>(null)

	// Default value for the store
	public readonly defaultValue: T

	// Storage manager
	protected storage: IStorageManager<T>

	/**
	 * Get store ready state
	 */
	public get ready(): boolean {
		return this._ready
	}

	/**
	 * Set store ready state
	 */
	public set ready(value: boolean) {
		this._ready = value
		this.updateState(this.$.value)
	}

	/**
	 * Get the current value
	 */
	public get value(): T {
		return this.$.getValue()
	}

	/**
	 * Initialize the base store
	 * @param storageType Storage type to use
	 * @param key Unique key for the store
	 * @param defaultValue Default/initial value
	 */
	constructor(
		protected storageType: StorageType,
		protected key: string,
		defaultValue: T,
	) {
		// Create an immutable copy of the default value
		this.defaultValue = produce(defaultValue, draft => draft)
		this.$ = new BehaviorSubject<T>(this.defaultValue)
		this.storage = createStorageManager<T>(storageType, key)

		// Set ready immediately for memory storage
		if (storageType === 'memory') {
			this._ready = true
		} else {
			// Initialize from storage for persistent stores
			this.initializeFromStorage()
		}

		// Setup dev tools in development
		if (import.meta.env.MODE === 'development') {
			this.setupDevTools()
		}
	}

	/**
	 * Cleanup method for all store types
	 */
	public destroy(): void {
		this._destroy$.next()
		this._destroy$.complete()
		this.$.complete()
		this.error$.complete()
	}

	/**
	 * Replace the entire store state immutably
	 */
	public replace(newValue: T): void {
		// Use Immer to create an immutable copy
		const nextState = produce(newValue, draft => draft)
		this.updateState(nextState)
	}

	/**
	 * Reset to default value - to be implemented by subclasses
	 */
	public abstract clear(): void

	/**
	 * Update the state with proper error handling and immutability
	 */
	protected updateState(newValue: T): void {
		try {
			// Ensure immutability by creating a fresh copy with Immer
			const nextState = produce(newValue, draft => draft)
			this.$.next(nextState)

			// Persist to storage
			if (this.storageType !== 'memory') {
				this.persistToStorage(nextState).catch(err => {
					const error = new StoreError<unknown>(`Error saving to ${this.storageType} storage for ${this.key}`, err)
					this.error$.next(error)
					console.error(error)
				})
			}
		} catch (err) {
			const error = new StoreError<unknown>(`Error updating state in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Initialize the store from persistent storage
	 */
	protected async initializeFromStorage(): Promise<void> {
		try {
			const storedValue = await this.storage.load()
			if (storedValue) {
				// Process and update state with the stored value
				const processedValue = this.processStoredValue(storedValue)
				const immutableValue = produce(processedValue, draft => draft)
				this.updateState(immutableValue)
			}
			this._ready = true
		} catch (err) {
			const error = new StoreError<unknown>(`Error loading from ${this.storageType} storage for ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
			this._ready = true // Mark as ready even if loading fails
		}
	}

	/**
	 * Process stored value (can be overridden by subclasses)
	 */
	protected processStoredValue(storedValue: T): T {
		return storedValue
	}

	/**
	 * Persist state to storage
	 */
	protected async persistToStorage(state: T): Promise<void> {
		return this.storage.save(state)
	}

	/**
	 * Setup development tools
	 */
	protected abstract setupDevTools(): void
}

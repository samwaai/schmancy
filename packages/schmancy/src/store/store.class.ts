// src/store/store.class.ts - Fixed version

import { produce, enableMapSet, immerable } from 'immer'
import { BehaviorSubject, Subject } from 'rxjs'
import { createStorageManager } from './storage-manager'
import { IStorageManager, StorageType, StoreError } from './types'

// Enable Map and Set support for Immer
enableMapSet()

/**
 * Base store class to handle common functionality between store types
 * Now with Immer integration for immutability
 */
export abstract class BaseStore<T> {
	// Mark the class as immerable to allow Immer to create drafts
	[immerable] = true

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
		// Before using produce, ensure the input is draftable
		// This ensures Immer won't throw an error on non-draftable values
		let safeDefaultValue: T

		if (defaultValue instanceof Map) {
			// For Maps, create a new Map instance
			safeDefaultValue = new Map(defaultValue) as unknown as T
		} else if (Array.isArray(defaultValue)) {
			// For arrays, create a new array instance
			safeDefaultValue = [...defaultValue] as unknown as T
		} else if (defaultValue && typeof defaultValue === 'object') {
			// For objects, create a shallow copy
			safeDefaultValue = { ...defaultValue } as T
		} else {
			// For primitives or other non-draftable types
			safeDefaultValue = defaultValue
		}

		// Make an immutable copy of the default value when possible
		try {
			this.defaultValue = this.isImmerDraftable(safeDefaultValue)
				? produce(safeDefaultValue, draft => draft)
				: safeDefaultValue
		} catch (error) {
			console.warn(`[BaseStore] Unable to produce immutable copy of defaultValue:`, error)
			this.defaultValue = safeDefaultValue
		}

		// Initialize BehaviorSubject with the default value
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
		if (typeof import.meta !== 'undefined' && import.meta.env?.MODE === 'development') {
			this.setupDevTools()
		}
	}

	/**
	 * Check if a value can be safely used with Immer's produce
	 */
	protected isImmerDraftable(value: any): boolean {
		return (
			value !== null &&
			typeof value === 'object' &&
			(Array.isArray(value) ||
				value instanceof Map ||
				value instanceof Set ||
				Object.getPrototypeOf(value) === Object.prototype ||
				value[immerable] === true)
		)
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
		try {
			// Use Immer to create an immutable copy if possible
			const nextState = this.isImmerDraftable(newValue) ? produce(newValue, draft => draft) : newValue

			this.updateState(nextState)
		} catch (error) {
			const storeError = new StoreError<unknown>(`Error replacing state in ${this.key}`, error)
			this.error$.next(storeError)
			console.error(storeError)

			// Fallback to direct assignment
			this.updateState(newValue)
		}
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
			// Ensure immutability by creating a fresh copy with Immer when possible
			let nextState: T

			if (this.isImmerDraftable(newValue)) {
				nextState = produce(newValue, draft => draft)
			} else {
				nextState = newValue
			}

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

			// Fallback to direct update
			this.$.next(newValue)
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

				try {
					// Only use Immer if the value is draftable
					const immutableValue = this.isImmerDraftable(processedValue)
						? produce(processedValue, draft => draft)
						: processedValue

					this.updateState(immutableValue)
				} catch (error) {
					console.warn(`[BaseStore] Unable to create immutable copy, using value directly:`, error)
					this.updateState(processedValue)
				}
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

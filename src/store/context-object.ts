import { BehaviorSubject, Subject } from 'rxjs'
import { createStorageManager, StorageManager } from './storage-manager'
import { IStore, StorageType, StoreError } from './types'

/**
 * Enhanced store object with better TypeScript support
 */
export class SchmancyStoreObject<T extends Record<string, any>> implements IStore<T> {
	public static type = 'object'

	// Static map to hold instances with proper typing
	private static instances: Map<string, SchmancyStoreObject<any>> = new Map()

	// State tracking
	private _ready: boolean = false
	private _destroy$ = new Subject<void>()

	// Observable streams
	public $: BehaviorSubject<T>
	public error$ = new BehaviorSubject<StoreError | null>(null)

	// Default value for the store
	public readonly defaultValue: T

	// Storage manager
	private storage: StorageManager<T>

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
	 * Private constructor to enforce singleton pattern
	 */
	private constructor(private storageType: StorageType, private key: string, defaultValue: T) {
		this.defaultValue = defaultValue
		this.$ = new BehaviorSubject<T>(defaultValue)
		this.storage = createStorageManager<T>(storageType, key)

		// Initialize from storage
		this.initializeFromStorage()

		// Setup dev tools in development
		if (import.meta.env.MODE === 'development') {
			this.setupDevTools()
		}
	}

	/**
	 * Static method to get or create an instance with strong typing
	 */
	public static getInstance<T extends Record<string, any>>(
		storage: StorageType,
		key: string,
		defaultValue: T,
	): SchmancyStoreObject<T> {
		const instanceKey = `${storage}:${key}`
		if (!this.instances.has(instanceKey)) {
			this.instances.set(instanceKey, new SchmancyStoreObject<T>(storage, key, defaultValue))
		}
		return this.instances.get(instanceKey) as SchmancyStoreObject<T>
	}

	/**
	 * Get the current value from the store
	 */
	public get value(): T {
		return this.$.getValue()
	}

	/**
	 * Set state with proper typing
	 */
	public set(value: Partial<T>, merge: boolean = true): void {
		try {
			this.updateState(merge ? { ...this.value, ...value } : (value as T))
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error updating store: ${this.key}`, err, { value, merge })
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Reset the store to its default value
	 */
	public clear(): void {
		this.set(this.defaultValue, false)
	}

	/**
	 * Replace the store with a new value
	 */
	public replace(newValue: T): void {
		this.updateState(newValue)
	}

	/**
	 * Delete a specific key from the store with type checking
	 */
	public delete<K extends keyof T>(key: K): void {
		const value = { ...this.value }
		delete value[key]
		this.updateState(value)
	}

	/**
	 * Update the state with proper error handling
	 */
	private updateState(newValue: T): void {
		try {
			this.$.next(newValue)

			// Persist to storage
			if (this.storageType !== 'memory') {
				this.storage.save(newValue).catch(err => {
					console.error(`Error saving to ${this.storageType} storage:`, err)
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
	private async initializeFromStorage(): Promise<void> {
		try {
			const storedValue = await this.storage.load()
			if (storedValue) {
				this.updateState({ ...this.defaultValue, ...storedValue })
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
	 * Setup development tools for debugging
	 */
	private setupDevTools(): void {
		if (typeof window !== 'undefined') {
			// Add to global store registry
			;(window as any).__STORES__ = (window as any).__STORES__ || {}
			;(window as any).__STORES__[this.key] = {
				getState: () => this.value,
				set: this.set.bind(this),
				delete: this.delete.bind(this),
				clear: this.clear.bind(this),
				subscribe: (callback: (state: T) => void) => {
					const subscription = this.$.subscribe(callback)
					return () => subscription.unsubscribe()
				},
			}
		}
	}

	/**
	 * Clean up resources
	 */
	public destroy(): void {
		this._destroy$.next()
		this._destroy$.complete()
		this.$.complete()
		this.error$.complete()
	}
}

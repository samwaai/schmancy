import { BehaviorSubject, Subject, throttleTime } from 'rxjs'
import { ICollectionStore, StorageType, StoreError } from './types'
import { createStorageManager, StorageManager } from './storage-manager'

/**
 * Enhanced collection store with better TypeScript support
 */
export default class SchmancyCollectionStore<V = any> implements ICollectionStore<V> {
	public static type = 'collection'

	// Static map to hold instances
	private static instances: Map<string, SchmancyCollectionStore<any>> = new Map()

	// State management
	private _ready: boolean = false
	private _destroy$ = new Subject<void>()

	// Observable streams - modified to match interface requirements
	public $: BehaviorSubject<Map<string, V>>
	public error$ = new BehaviorSubject<StoreError | null>(null)

	// Default value for the store
	public readonly defaultValue: Map<string, V>

	// Storage manager
	private storage: StorageManager<Map<string, V>>

	/**
	 * Get ready state
	 */
	public get ready(): boolean {
		return this._ready
	}

	/**
	 * Set ready state
	 */
	public set ready(value: boolean) {
		this._ready = value
		this.updateState(this.$.value)
	}

	/**
	 * Private constructor to enforce singleton pattern
	 */
	private constructor(private storageType: StorageType, private key: string, defaultValue: Map<string, V>) {
		this.defaultValue = defaultValue
		this.$ = new BehaviorSubject<Map<string, V>>(new Map<string, V>())
		this.storage = createStorageManager<Map<string, V>>(storageType, key)

		// Initialize from storage
		this.initializeFromStorage()

		// Set up persistence
		this.setupPersistence()

		// Setup dev tools in development
		if (import.meta.env.MODE === 'development') {
			this.setupDevTools()
		}
	}

	/**
	 * Static method to get or create an instance with proper typing
	 */
	public static getInstance<V = any>(
		storage: StorageType,
		key: string,
		defaultValue: Map<string, V>,
	): SchmancyCollectionStore<V> {
		const instanceKey = `${storage}:${key}`
		if (!this.instances.has(instanceKey)) {
			this.instances.set(instanceKey, new SchmancyCollectionStore<V>(storage, key, defaultValue))
		}
		return this.instances.get(instanceKey) as SchmancyCollectionStore<V>
	}

	/**
	 * Get the current value
	 */
	public get value(): Map<string, V> {
		return this.$.getValue()
	}

	/**
	 * Set a value in the collection with proper typing
	 */
	public set<T = V>(key: string, value: T): void {
		try {
			const currentValue = new Map(this.value)
			currentValue.set(key, value as unknown as V)
			this.updateState(currentValue)
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error setting value for key ${key} in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Delete a value from the collection
	 */
	public delete(key: string): void {
		try {
			const currentValue = new Map(this.value)
			currentValue.delete(key)
			this.updateState(currentValue)
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error deleting key ${key} from ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Clear the collection
	 */
	public clear(): void {
		this.updateState(new Map<string, V>())
	}

	public replace(newValue: Map<string, V>): void {
		this.updateState(newValue)
	}

	/**
	 * Update the state with error handling
	 */
	private updateState(newValue: Map<string, V>): void {
		try {
			this.$.next(newValue)
		} catch (err) {
			const error = new StoreError<unknown>(`Error updating state in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Initialize from persistent storage
	 */
	private async initializeFromStorage(): Promise<void> {
		if (this.storageType === 'local' || this.storageType === 'session') {
			try {
				const storedValue = await this.storage.load()
				if (storedValue) {
					this.updateState(storedValue)
				}
				this._ready = true
			} catch (err) {
				const error = new StoreError<unknown>(`Error loading from ${this.storageType} storage for ${this.key}`, err)
				this.error$.next(error)
				console.error(error)
				this._ready = true // Mark as ready even if loading fails
			}
		} else if (this.storageType === 'indexeddb') {
			this.loadFromIndexedDB()
		} else {
			// Memory storage doesn't need loading
			this._ready = true
		}
	}

	/**
	 * Load data from IndexedDB with better typing
	 */
	private async loadFromIndexedDB(): Promise<void> {
		try {
			const result = await this.storage.load()
			this.updateState(result || new Map<string, V>())
			this._ready = true
		} catch (err) {
			const error = new StoreError<unknown>(`Error loading from IndexedDB for ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
			this._ready = true // Mark as ready even if loading fails
		}
	}

	/**
	 * Set up persistence to storage
	 */
	private setupPersistence(): void {
		if (this.storageType === 'memory') return

		this.$.pipe(throttleTime(100, undefined, { leading: true, trailing: true })).subscribe(currentValue => {
			this.storage.save(currentValue).catch(err => {
				const error = new StoreError<unknown>(`Error saving to ${this.storageType} storage for ${this.key}`, err)
				this.error$.next(error)
				console.error(error)
			})
		})
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
				subscribe: (callback: (state: Map<string, V>) => void) => {
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

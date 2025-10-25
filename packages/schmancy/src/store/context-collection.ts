// src/store/context-collection.ts - Updated with Immer for immutability
import { throttleTime } from 'rxjs'
import { BaseStore } from './store.class'
import { ICollectionStore, StorageType, StoreError } from './types'
import { produce, Draft, castDraft } from 'immer'

/**
 * Enhanced collection store with better TypeScript support and immutability
 * Now extends BaseStore for common functionality
 */
export default class SchmancyCollectionStore<V = any> extends BaseStore<Map<string, V>> implements ICollectionStore<V> {
	public static type = 'collection'

	// Static map to hold instances
	private static instances: Map<string, SchmancyCollectionStore<any>> = new Map()

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
	 * Set values in the collection with proper typing and immutability.
	 * Supports multiple input types to prevent common developer mistakes.
	 * 
	 * @example
	 * // Single key-value pair
	 * store.set('key1', value1)
	 * 
	 * @example
	 * // Merge from a Map
	 * const dataMap = new Map([['key1', value1], ['key2', value2]])
	 * store.set(dataMap)
	 * 
	 * @example
	 * // Merge from an object
	 * store.set({ key1: value1, key2: value2 })
	 */
	public set<T = V>(keyOrData: string | Map<string, T> | Record<string, T>, value?: T): void {
		try {
			const nextState = produce(this.value, draft => {
				// Handle different input types
				if (typeof keyOrData === 'string') {
					// Traditional key-value pair
					if (value === undefined) {
						throw new Error('Value is required when setting a single key')
					}
					draft.set(keyOrData, castDraft(value) as unknown as Draft<V>)
				} else if (keyOrData instanceof Map) {
					// Merge all entries from the Map
					Array.from(keyOrData.entries()).forEach(([key, val]) => {
						draft.set(key, castDraft(val) as unknown as Draft<V>)
					})
				} else if (typeof keyOrData === 'object' && keyOrData !== null) {
					// Merge all properties from the object
					Object.entries(keyOrData).forEach(([key, val]) => {
						draft.set(key, castDraft(val) as unknown as Draft<V>)
					})
				} else {
					throw new Error('Invalid input: expected string key with value, Map, or object')
				}
			})

			// Update the state with the new immutable Map
			this.updateState(nextState)
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error setting values in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Merge a Map into the collection. This is a helper method that provides
	 * explicit semantics for merging operations.
	 * 
	 * @param map The Map to merge into the collection
	 * @example
	 * const dataMap = new Map([['key1', value1], ['key2', value2]])
	 * store.merge(dataMap)
	 */
	public merge<T = V>(map: Map<string, T>): void {
		this.set(map)
	}

	/**
	 * Delete a value from the collection immutably
	 */
	public delete(key: string): void {
		try {
			// Use Immer to create a new immutable Map with the key deleted
			const nextState = produce(this.value, draft => {
				draft.delete(key)
			})

			this.updateState(nextState)
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error deleting key ${key} from ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Clear the collection immutably
	 */
	public clear(): void {
		// Create a fresh empty Map
		this.updateState(new Map<string, V>())
	}

	/**
	 * Batch update multiple items in the collection
	 * @param updates Object with keys and values to update
	 */
	public batchUpdate(updates: Record<string, V>): void {
		try {
			// Use Immer to apply all updates in a single immutable operation
			const nextState = produce(this.value, draft => {
				Object.entries(updates).forEach(([key, value]) => {
					draft.set(key, castDraft(value) as unknown as Draft<V>)
				})
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error batch updating in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Update an existing item in the collection using an updater function
	 * @param key Key of the item to update
	 * @param updater Function that receives the current value and returns the new value
	 */
	public update(key: string, updater: (currentValue: Draft<V>) => void): void {
		try {
			// Use Immer to update the specific item
			const nextState = produce(this.value, draft => {
				const currentValue = draft.get(key)
				if (currentValue !== undefined) {
					updater(currentValue)
					// No need to set the value back since it's updated in place
				}
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error updating item ${key} in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Constructor extension to set up persistence
	 */
	constructor(storageType: StorageType, key: string, defaultValue: Map<string, V>) {
		super(storageType, key, defaultValue)

		// Set up persistence throttling for better performance
		if (storageType !== 'memory') {
			this.setupPersistence()
		}
	}

	/**
	 * Set up persistence to storage with throttling
	 */
	private setupPersistence(): void {
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
	protected setupDevTools(): void {
		if (typeof window !== 'undefined') {
			// Add to global store registry
			;(window as any).__STORES__ = (window as any).__STORES__ || {}
			;(window as any).__STORES__[this.key] = {
				getState: () => this.value,
				set: this.set.bind(this),
				merge: this.merge.bind(this),
				delete: this.delete.bind(this),
				clear: this.clear.bind(this),
				batchUpdate: this.batchUpdate.bind(this),
				update: this.update.bind(this),
				subscribe: (callback: (state: Map<string, V>) => void) => {
					const subscription = this.$.subscribe(callback)
					return () => subscription.unsubscribe()
				},
			}
		}
	}
}

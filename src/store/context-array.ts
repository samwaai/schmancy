// src/store/context-array.ts - Array store implementation with Immer
import { Draft, castDraft, produce } from 'immer'
import { throttleTime } from 'rxjs'
import { BaseStore } from './store.class'
import { IArrayStore, StorageType, StoreError } from './types'

/**
 * Enhanced array store with TypeScript support and immutability
 * Extends BaseStore for common functionality
 */
export class SchmancyArrayStore<T = any> extends BaseStore<T[]> implements IArrayStore<T> {
	public static type = 'array'

	// Static map to hold instances
	private static instances: Map<string, SchmancyArrayStore<any>> = new Map()

	/**
	 * Static method to get or create an instance with proper typing
	 */
	public static getInstance<T = any>(storage: StorageType, key: string, defaultValue: T[] = []): SchmancyArrayStore<T> {
		const instanceKey = `${storage}:${key}`
		if (!this.instances.has(instanceKey)) {
			this.instances.set(instanceKey, new SchmancyArrayStore<T>(storage, key, defaultValue))
		}
		return this.instances.get(instanceKey) as SchmancyArrayStore<T>
	}

	/**
	 * Constructor extension to set up persistence
	 */
	constructor(storageType: StorageType, key: string, defaultValue: T[] = []) {
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
	 * Add an item to the end of the array
	 */
	public push(...items: T[]): void {
		try {
			// Use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				draft.push(...items.map(item => castDraft(item) as Draft<T>))
			})

			this.updateState(nextState)
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error pushing items in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Remove and return the last item from the array
	 */
	public pop(): T | undefined {
		try {
			// Get the item before modifying the array
			const originalItem = this.value.length > 0 ? this.value[this.value.length - 1] : undefined

			// Use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				draft.pop()
			})

			this.updateState(nextState)
			this.error$.next(null) // Clear any previous errors
			return originalItem
		} catch (err) {
			const error = new StoreError<unknown>(`Error popping item from ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
			return undefined
		}
	}
	/**
	 * Add item(s) to the beginning of the array
	 */
	public unshift(...items: T[]): void {
		try {
			// Use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				draft.unshift(...items.map(item => castDraft(item) as Draft<T>))
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error unshifting items in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Remove and return the first item from the array
	 */
	public shift(): T | undefined {
		try {
			// Get the item before modifying the array
			const originalItem = this.value.length > 0 ? this.value[0] : undefined

			// Use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				draft.shift()
			})

			this.updateState(nextState)
			this.error$.next(null)
			return originalItem
		} catch (err) {
			const error = new StoreError<unknown>(`Error shifting item from ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
			return undefined
		}
	}

	/**
	 * Update an item at a specific index
	 */
	public set(index: number, value: T): void {
		try {
			// Use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				if (index >= 0 && index < draft.length) {
					draft[index] = castDraft(value) as Draft<T>
				} else {
					throw new Error(`Index ${index} out of bounds (length: ${draft.length})`)
				}
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error setting item at index ${index} in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Get item at a specific index
	 */
	public get(index: number): T | undefined {
		return this.value[index]
	}

	/**
	 * Remove items from the array
	 */
	public splice(start: number, deleteCount?: number, ...items: T[]): T[] {
		try {
			// Get a copy of the current array
			const originalArray = [...this.value]

			// Perform splice on the copy to get the removed items
			const removed = originalArray.splice(start, deleteCount ?? 0, ...items)

			// Now use Immer to create the new state with the same changes
			const nextState = produce(this.value, draft => {
				draft.splice(start, deleteCount ?? 0, ...items.map(item => castDraft(item) as Draft<T>))
			})

			this.updateState(nextState)
			this.error$.next(null)
			return removed
		} catch (err) {
			const error = new StoreError<unknown>(`Error splicing items in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
			return []
		}
	}

	/**
	 * Remove an item by value (first occurrence)
	 */
	public remove(item: T, compareFn?: (a: T, b: T) => boolean): boolean {
		try {
			const equals = compareFn || ((a, b) => a === b)

			// Find the index in the original array
			const index = this.value.findIndex(currentItem => equals(currentItem, item))

			// If found, remove using Immer
			if (index !== -1) {
				const nextState = produce(this.value, draft => {
					draft.splice(index, 1)
				})

				this.updateState(nextState)
				this.error$.next(null)
				return true
			}

			// Item not found
			this.error$.next(null)
			return false
		} catch (err) {
			const error = new StoreError<unknown>(`Error removing item in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
			return false
		}
	}

	/**
	 * Replace entire array
	 */
	public replace(newArray: T[]): void {
		try {
			// Create a fresh immutable copy with Immer
			const nextState = produce(newArray, draft => draft)
			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error replacing array in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Filter items in the array
	 */
	public filter(predicate: (value: T, index: number, array: T[]) => boolean): void {
		try {
			// Filter the original array first
			const filteredArray = this.value.filter(predicate)

			// Then use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				// Clear the draft array and fill it with the filtered items
				draft.length = 0
				draft.push(...filteredArray.map(item => castDraft(item) as Draft<T>))
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error filtering array in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Map over the array and transform items
	 */
	public map<U>(mapper: (value: T, index: number, array: T[]) => U): U[] {
		return this.value.map(mapper)
	}

	/**
	 * Sort the array in place
	 */
	public sort(compareFn?: (a: T, b: T) => number): void {
		try {
			// Create a copy of the current array and apply the sort operation
			const sortedArray = [...this.value].sort(compareFn)

			// Use Immer to create a new immutable array that matches the sorted array
			const nextState = produce(this.value, draft => {
				// Clear the array and refill it with the sorted items
				draft.length = 0
				draft.push(...sortedArray.map(item => castDraft(item) as Draft<T>))
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error sorting array in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Update a specific item using a callback function
	 */
	public update(index: number, updater: (item: Draft<T>) => void): void {
		try {
			// Use Immer to create a new immutable array
			const nextState = produce(this.value, draft => {
				if (index >= 0 && index < draft.length) {
					updater(draft[index])
				} else {
					throw new Error(`Index ${index} out of bounds (length: ${draft.length})`)
				}
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error updating item at index ${index} in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Clear the array
	 */
	public clear(): void {
		this.updateState([])
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
				push: this.push.bind(this),
				pop: this.pop.bind(this),
				unshift: this.unshift.bind(this),
				shift: this.shift.bind(this),
				set: this.set.bind(this),
				get: this.get.bind(this),
				splice: this.splice.bind(this),
				remove: this.remove.bind(this),
				replace: this.replace.bind(this),
				filter: this.filter.bind(this),
				map: this.map.bind(this),
				sort: this.sort.bind(this),
				update: this.update.bind(this),
				clear: this.clear.bind(this),
				subscribe: (callback: (state: T[]) => void) => {
					const subscription = this.$.subscribe(callback)
					return () => subscription.unsubscribe()
				},
			}
		}
	}
}

// src/store/context-object.ts - Updated with Immer for immutability
import { BaseStore } from './store.class'
import { IStore, StorageType, StoreError } from './types'
import { produce, Draft, castDraft } from 'immer'

/**
 * Enhanced store object with better TypeScript support and immutability
 * Now extends BaseStore for common functionality and uses Immer
 */
export class SchmancyStoreObject<T extends Record<string, any>> extends BaseStore<T> implements IStore<T> {
	public static type = 'object'

	// Static map to hold instances with proper typing
	private static instances: Map<string, SchmancyStoreObject<any>> = new Map()

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
	 * Set state with proper typing and immutability using Immer
	 */
	public set(value: Partial<T>, merge: boolean = true): void {
		try {
			// Use Immer to create an immutable update
			const nextState = produce(this.value, draft => {
				if (merge) {
					// Merge new values into existing state
					// Use castDraft to properly type the value for the draft context
					Object.assign(draft, castDraft(value) as Draft<Partial<T>>)
				} else {
					// For complete replacement, return a completely new object
					// This is handled specially by Immer
					return castDraft(value as T) as Draft<T>
				}
			})

			this.updateState(nextState)
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
		// Create a fresh copy of the default value using Immer
		const freshDefaultValue = produce(this.defaultValue, draft => draft)
		this.set(freshDefaultValue, false)
	}

	/**
	 * Delete a specific key from the store with type checking and immutability
	 */
	public delete<K extends keyof T>(key: K): void {
		// Use Immer to create an immutable update that removes the key
		const nextState = produce(this.value, draft => {
			// Use type assertion to tell TypeScript this is safe
			delete draft[key as keyof Draft<T>]
		})

		this.updateState(nextState)
	}

	/**
	 * Update a nested property at a specific path
	 * @param path Dot-separated path to the property (e.g., 'user.profile.name')
	 * @param value New value to set
	 */
	public setPath(path: string, value: any): void {
		try {
			// Use Immer for immutable deep updates
			const nextState = produce(this.value, draft => {
				const parts = path.split('.')
				let current: any = draft

				// Navigate to the parent of the property we want to update
				for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i]

					// Create the path if it doesn't exist
					if (current[part] === undefined) {
						current[part] = {}
					} else if (typeof current[part] !== 'object') {
						// Convert to object if it's not one already
						current[part] = {}
					}

					current = current[part]
				}

				// Set the value at the final path segment
				const lastPart = parts[parts.length - 1]
				current[lastPart] = castDraft(value)
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error setting path ${path} in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)
		}
	}

	/**
	 * Process stored value by merging with default value
	 */
	protected processStoredValue(storedValue: T): T {
		// Use Immer to create a clean merged state
		return produce(this.defaultValue, draft => {
			Object.assign(draft, castDraft(storedValue) as Draft<T>)
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
				delete: this.delete.bind(this),
				clear: this.clear.bind(this),
				setPath: this.setPath.bind(this),
				subscribe: (callback: (state: T) => void) => {
					const subscription = this.$.subscribe(callback)
					return () => subscription.unsubscribe()
				},
			}
		}
	}
}

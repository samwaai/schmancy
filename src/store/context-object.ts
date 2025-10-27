// src/store/context-object.ts - Fixed version

import { BaseStore } from './store.class'
import { IStore, StorageType, StoreError } from './types'
import { produce, Draft, castDraft, immerable } from 'immer'

/**
 * Enhanced store object with better TypeScript support and immutability
 * Now extends BaseStore for common functionality and uses Immer
 */
export class SchmancyStoreObject<T extends Record<string, any>> extends BaseStore<T> implements IStore<T> {
	// Mark as immerable so Immer can create drafts of this class
	[immerable] = true

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
			if (!this.isImmerDraftable(this.value)) {
				// If current value isn't draftable, handle directly
				const nextState = merge ? { ...this.value, ...value } : (value as T)

				this.updateState(nextState)
				this.error$.next(null)
				return
			}

			// Use Immer to create an immutable update
			const nextState = produce(this.value, draft => {
				if (merge) {
					// Handle null/undefined value safely
					if (value === null || value === undefined) {
						return
					}

					// Merge new values into existing state
					// Use castDraft to properly type the value for the draft context
					try {
						Object.assign(draft, castDraft(value) as Draft<Partial<T>>)
					} catch (err) {
						console.warn('[SchmancyStoreObject] Error casting to draft, falling back to direct assign:', err)
						// Fallback to direct property assignment
						Object.keys(value).forEach(key => {
							;(draft as any)[key] = (value as any)[key]
						})
					}
				} else {
					// For complete replacement, return a completely new object
					// This is handled specially by Immer
					try {
						return castDraft(value as T) as Draft<T>
					} catch (err) {
						console.warn('[SchmancyStoreObject] Error casting to draft, returning value directly:', err)
						return value as unknown as Draft<T>
					}
				}
			})

			this.updateState(nextState)
			this.error$.next(null) // Clear any previous errors
		} catch (err) {
			const error = new StoreError<unknown>(`Error updating store: ${this.key}`, err, { value, merge })
			this.error$.next(error)
			console.error(error)

			// Fallback to direct update
			try {
				const fallbackState = merge ? { ...this.value, ...value } : (value as T)
				this.updateState(fallbackState)
			} catch (fallbackErr) {
				console.error('Failed fallback update:', fallbackErr)
			}
		}
	}

	/**
	 * Reset the store to its default value
	 */
	public clear(): void {
		try {
			// Create a fresh copy of the default value using Immer
			if (this.isImmerDraftable(this.defaultValue)) {
				const freshDefaultValue = produce(this.defaultValue, draft => draft)
				this.set(freshDefaultValue, false)
			} else {
				// For non-draftable values, use direct replacement
				this.set(this.defaultValue as any, false)
			}
		} catch (err) {
			const error = new StoreError<unknown>(`Error clearing store: ${this.key}`, err)
			this.error$.next(error)
			console.error(error)

			// Fallback to direct reset
			this.updateState(this.defaultValue)
		}
	}

	/**
	 * Delete a specific key from the store with type checking and immutability
	 */
	public delete<K extends keyof T>(key: K): void {
		try {
			if (!this.isImmerDraftable(this.value)) {
				// Handle non-draftable objects directly
				const nextState = { ...this.value }
				delete nextState[key]
				this.updateState(nextState as T)
				return
			}

			// Use Immer to create an immutable update that removes the key
			const nextState = produce(this.value, draft => {
				// Use type assertion to tell TypeScript this is safe
				delete draft[key as keyof Draft<T>]
			})

			this.updateState(nextState)
		} catch (err) {
			const error = new StoreError<unknown>(`Error deleting key ${String(key)} from store: ${this.key}`, err)
			this.error$.next(error)
			console.error(error)

			// Fallback to direct modification
			try {
				const fallbackState = { ...this.value }
				delete fallbackState[key]
				this.updateState(fallbackState as T)
			} catch (fallbackErr) {
				console.error('Failed fallback delete:', fallbackErr)
			}
		}
	}

	/**
	 * Update a nested property at a specific path
	 * @param path Dot-separated path to the property (e.g., 'user.profile.name')
	 * @param value New value to set
	 */
	public setPath(path: string, value: any): void {
		try {
			if (!path) {
				console.warn('[SchmancyStoreObject] Empty path provided to setPath')
				return
			}

			if (!this.isImmerDraftable(this.value)) {
				// Handle non-draftable objects with direct modification
				const parts = path.split('.')
				const nextState = { ...this.value }
				let current: any = nextState

				for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i]
					if (current[part] === undefined) {
						current[part] = {}
					} else if (typeof current[part] !== 'object' || current[part] === null) {
						current[part] = {}
					}
					current = current[part]
				}

				current[parts[parts.length - 1]] = value
				this.updateState(nextState)
				return
			}

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
					} else if (typeof current[part] !== 'object' || current[part] === null) {
						// Convert to object if it's not one already
						current[part] = {}
					}

					current = current[part]
				}

				// Set the value at the final path segment
				const lastPart = parts[parts.length - 1]
				try {
					current[lastPart] = castDraft(value)
				} catch (err) {
					console.warn('[SchmancyStoreObject] Error casting to draft, setting directly:', err)
					current[lastPart] = value
				}
			})

			this.updateState(nextState)
			this.error$.next(null)
		} catch (err) {
			const error = new StoreError<unknown>(`Error setting path ${path} in ${this.key}`, err)
			this.error$.next(error)
			console.error(error)

			// Fallback to direct path setting
			try {
				const parts = path.split('.')
				const nextState = { ...this.value }
				let current: any = nextState

				for (let i = 0; i < parts.length - 1; i++) {
					const part = parts[i]
					if (current[part] === undefined) {
						current[part] = {}
					} else if (typeof current[part] !== 'object' || current[part] === null) {
						current[part] = {}
					}
					current = current[part]
				}

				current[parts[parts.length - 1]] = value
				this.updateState(nextState)
			} catch (fallbackErr) {
				console.error('Failed fallback setPath:', fallbackErr)
			}
		}
	}

	/**
	 * Process stored value by merging with default value
	 */
	protected processStoredValue(storedValue: T): T {
		try {
			// Use Immer to create a clean merged state if possible
			if (this.isImmerDraftable(this.defaultValue) && this.isImmerDraftable(storedValue)) {
				return produce(this.defaultValue, draft => {
					Object.assign(draft, castDraft(storedValue) as Draft<T>)
				})
			} else {
				// Otherwise use a standard merge
				return { ...this.defaultValue, ...storedValue }
			}
		} catch (err) {
			console.warn(`[SchmancyStoreObject] Error processing stored value, returning as-is:`, err)
			return storedValue
		}
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

	/**
	 * Inherit isImmerDraftable from BaseStore, but also check for [immerable]
	 */
	protected isImmerDraftable(value: any): boolean {
		// Use the parent implementation and add our own checks
		return value !== null && typeof value === 'object' && (super.isImmerDraftable(value) || value[immerable] === true)
	}
}

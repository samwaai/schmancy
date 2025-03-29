// src/store/selector-hook.ts - Improved memory management
import { property as litProperty } from 'lit/decorators.js'
import { Observable, Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { createCollectionSelector, createSelector } from './selectors'
import { ICollectionStore, IStore } from './types'

/**
 * Symbol used for storing cleanup resources
 * Using a Symbol prevents name collisions with component properties
 */
const CLEANUP_SUBJECT = Symbol('selectorCleanup')
const SUBSCRIPTIONS = Symbol('selectorSubscriptions')
const INITIALIZED = Symbol('selectorInitialized')

/**
 * Component lifecycle interface
 */
interface ComponentWithLifecycle {
	// Lifecycle hooks
	isConnected: boolean
	disconnectedCallback?: () => void
	connectedCallback?: () => void
	requestUpdate?: () => void

	// Internal properties using symbols to avoid name collisions
	[CLEANUP_SUBJECT]?: Subject<void>
	[SUBSCRIPTIONS]?: Map<string, Subscription>
	[INITIALIZED]?: Set<string>

	// Value storage
	[key: string]: any
}

/**
 * Property descriptor interface
 */
type PropertyDescriptor<T> = {
	get?: () => T
	set?: (value: T) => void
	value?: T
	configurable?: boolean
	enumerable?: boolean
	writable?: boolean
}

/**
 * Options for selecting from a store
 */
interface SelectOptions {
	/** If true, will wait for selector to emit a non-null value before calling connectedCallback */
	required?: boolean

	/** If true, will only update the component and not set the property value */
	updateOnly?: boolean

	/** If true, will use structuredClone to deeply clone values (prevents mutations) */
	deepClone?: boolean

	/** Custom equality function to determine when to update */
	equals?: (a: any, b: any) => boolean

	/** Debug mode - logs selector activity */
	debug?: boolean
}

/**
 * Type guard to check if a store is a collection store
 */
function isCollectionStore<T>(store: IStore<any> | ICollectionStore<T>): store is ICollectionStore<T> {
	return 'set' in store && typeof store.set === 'function' && store.value instanceof Map
}

/**
 * Ensures the cleanup resources exist on the component
 */
function ensureCleanupResources(component: ComponentWithLifecycle): void {
	if (!component[CLEANUP_SUBJECT] || component[CLEANUP_SUBJECT].closed) {
		component[CLEANUP_SUBJECT] = new Subject<void>()
	}

	if (!component[SUBSCRIPTIONS]) {
		component[SUBSCRIPTIONS] = new Map()
	}

	if (!component[INITIALIZED]) {
		component[INITIALIZED] = new Set()
	}
}

/**
 * Cleans up all selector resources
 */
function cleanupSelectorResources(component: ComponentWithLifecycle): void {
	if (component[CLEANUP_SUBJECT]) {
		component[CLEANUP_SUBJECT].next()
		component[CLEANUP_SUBJECT].complete()
		component[CLEANUP_SUBJECT] = undefined
	}

	if (component[SUBSCRIPTIONS]) {
		component[SUBSCRIPTIONS].forEach(sub => sub.unsubscribe())
		component[SUBSCRIPTIONS].clear()
		component[SUBSCRIPTIONS] = undefined
	}

	if (component[INITIALIZED]) {
		component[INITIALIZED].clear()
		component[INITIALIZED] = undefined
	}
}

/**
 * Selector decorator that connects a component property to a store selector
 * with improved memory management
 *
 * @param store The store to select from
 * @param selectorFn Optional function to transform the store state
 * @param options Additional options for the selector
 */
export function select<T, R>(
	store: IStore<T> | ICollectionStore<T>,
	selectorFn: (state: any) => R = (state: R) => state,
	options: SelectOptions = {},
) {
	return function (proto: Record<string, any>, propName: string, _descriptor?: PropertyDescriptor<R>) {
		// Register as a Lit property
		litProperty({ attribute: false, type: Object })(proto, propName)

		// Store original lifecycle methods
		const originalConnectedCallback = proto.connectedCallback
		const originalDisconnectedCallback = proto.disconnectedCallback

		// Override connectedCallback to set up subscription
		proto.connectedCallback = function (this: ComponentWithLifecycle) {
			// Initialize cleanup resources
			ensureCleanupResources(this)

			// Create the appropriate selector
			const selector: Observable<R> = isCollectionStore(store)
				? createCollectionSelector(store, selectorFn)
				: createSelector(store as IStore<T>, selectorFn)

			// Call original connectedCallback immediately if not waiting for data
			if (!options.required && !this[INITIALIZED]!.has(propName)) {
				originalConnectedCallback?.call(this)
				this[INITIALIZED]!.add(propName)
			}

			// Clean up any existing subscription
			if (this[SUBSCRIPTIONS]!.has(propName)) {
				this[SUBSCRIPTIONS]!.get(propName)?.unsubscribe()
				this[SUBSCRIPTIONS]!.delete(propName)
			}

			// Debug log if needed
			if (options.debug) {
				console.debug(`[select] Setting up subscription for ${propName}`)
			}

			// Create new subscription with better error handling
			const subscription = selector.pipe(takeUntil(this[CLEANUP_SUBJECT]!)).subscribe({
				next: (value: R) => {
					// Handle value updates
					const newValue = options.deepClone ? structuredClone(value) : value

					if (options.debug) {
						console.debug(`[select] New value for ${propName}:`, newValue)
					}

					if (!options.updateOnly) {
						this[propName] = newValue
					}

					this.requestUpdate?.()

					// If required and not initialized, call connectedCallback when we get a value
					if (options.required && !this[INITIALIZED]!.has(propName) && newValue !== null && newValue !== undefined) {
						if (options.debug) {
							console.debug(`[select] Calling delayed connectedCallback for ${propName}`)
						}

						originalConnectedCallback?.call(this)
						this[INITIALIZED]!.add(propName)
					}
				},
				error: (err: Error) => {
					console.error(`Error in selector subscription for ${propName}:`, err)
					// Resubscribe on error to prevent component from becoming unresponsive
					if (this.isConnected) {
						// Small delay to prevent immediate resubscription
						setTimeout(() => {
							if (this.isConnected) {
								if (options.debug) {
									console.debug(`[select] Resubscribing after error for ${propName}`)
								}
								this.connectedCallback?.()
							}
						}, 1000)
					}
				},
			})

			// Store the subscription for cleanup
			this[SUBSCRIPTIONS]!.set(propName, subscription)
		}

		// Override disconnectedCallback to clean up subscriptions
		proto.disconnectedCallback = function (this: ComponentWithLifecycle) {
			// Call original disconnectedCallback
			originalDisconnectedCallback?.call(this)

			// Debug log if needed
			if (options.debug) {
				console.debug(`[select] Cleaning up resources in disconnectedCallback`)
			}

			// Clean up all subscription resources
			cleanupSelectorResources(this)
		}
	}
}

/**
 * Creates a selector decorator that selects a specific item from a collection store
 * with improved memory management
 *
 * @param store The collection store
 * @param keyGetter Function that returns the key to select
 * @param options Additional options
 */
export function selectItem<T>(
	store: ICollectionStore<T>,
	keyGetter: (component: any) => string,
	options: SelectOptions = {},
) {
	return function (proto: Record<string, any>, propName: string, _descriptor?: PropertyDescriptor<T | undefined>) {
		select(
			store,
			function (state) {
				// This will be evaluated during subscription, when 'this' is available
				const itemKey = keyGetter(this)
				return itemKey ? state.get(itemKey) : undefined
			},
			options,
		)(proto, propName)
	}
}

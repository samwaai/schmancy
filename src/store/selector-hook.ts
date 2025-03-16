// src/store/selector-hook.ts
import { property as litProperty } from 'lit/decorators.js'
import { Observable, Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { createCollectionSelector, createSelector } from './selectors'
import { ICollectionStore, IStore } from './types'

/**
 * Component lifecycle interface
 */
interface ComponentWithLifecycle {
	// Lifecycle hooks
	isConnected: boolean
	disconnectedCallback?: () => void
	connectedCallback?: () => void
	requestUpdate?: () => void

	// Internal properties
	_selectorCleanup?: Subject<void>
	_selectorSubscriptions?: Map<string, Subscription>
	_selectorInitialized?: Set<string>

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
}

/**
 * Type guard to check if a store is a collection store
 */
function isCollectionStore<T>(store: IStore<any> | ICollectionStore<T>): store is ICollectionStore<T> {
	return 'set' in store && typeof store.set === 'function' && store.value instanceof Map
}

/**
 * Selector decorator that connects a component property to a store selector
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
			// Initialize tracking properties if needed
			if (!this._selectorCleanup || this._selectorCleanup.closed) {
				this._selectorCleanup = new Subject<void>()
			}

			if (!this._selectorSubscriptions) {
				this._selectorSubscriptions = new Map()
			}

			if (!this._selectorInitialized) {
				this._selectorInitialized = new Set()
			}

			// Create the appropriate selector
			const selector: Observable<R> = isCollectionStore(store)
				? createCollectionSelector(store, selectorFn)
				: createSelector(store as IStore<T>, selectorFn)

			// Call original connectedCallback immediately if not waiting for data
			if (!options.required && !this._selectorInitialized.has(propName)) {
				originalConnectedCallback?.call(this)
				this._selectorInitialized.add(propName)
			}

			// Clean up any existing subscription
			if (this._selectorSubscriptions.has(propName)) {
				this._selectorSubscriptions.get(propName)?.unsubscribe()
			}

			// Create new subscription
			const subscription = selector.pipe(takeUntil(this._selectorCleanup)).subscribe({
				next: (value: R) => {
					// Handle value updates
					const newValue = options.deepClone ? structuredClone(value) : value

					if (!options.updateOnly) {
						this[propName] = newValue
					}

					this.requestUpdate?.()

					// If required and not initialized, call connectedCallback when we get a value
					if (
						options.required &&
						!this._selectorInitialized.has(propName) &&
						newValue !== null &&
						newValue !== undefined
					) {
						originalConnectedCallback?.call(this)
						this._selectorInitialized.add(propName)
					}
				},
				error: (err: Error) => {
					console.error(`Error in selector subscription for ${propName}:`, err)
				},
			})

			// Store the subscription for cleanup
			this._selectorSubscriptions.set(propName, subscription)
		}

		// Override disconnectedCallback to clean up subscriptions
		proto.disconnectedCallback = function (this: ComponentWithLifecycle) {
			// Call original disconnectedCallback
			originalDisconnectedCallback?.call(this)

			// Clean up subscriptions
			if (this._selectorCleanup) {
				this._selectorCleanup.next()
				this._selectorCleanup.complete()
			}

			if (this._selectorSubscriptions) {
				this._selectorSubscriptions.forEach(sub => sub.unsubscribe())
				this._selectorSubscriptions.clear()
			}
		}
	}
}

/**
 * Creates a selector decorator that selects a specific item from a collection store
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
			state => {
				// This will be evaluated during subscription, when 'this' is available
				const itemKey = keyGetter(this)
				return itemKey ? state.get(itemKey) : undefined
			},
			options,
		)(proto, propName)
	}
}

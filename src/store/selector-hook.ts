// src/store/selector-hook.ts
import { property as litProperty } from 'lit/decorators.js'
import { Subject, Subscription } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { createCollectionSelector, createSelector } from './selectors'
import { ICollectionStore, IStore } from './types'

interface ComponentWithDisconnection {
	disconnecting?: Subject<void>
	requestUpdate?: () => void
	isConnected: boolean
	__selectorProps?: Record<string, SelectorPropState<unknown>>
	[key: string]: any
}

interface SelectorPropState<_T> {
	subscription: Subscription | null
	initialLoad: boolean
}

type PropertyDescriptor<T> = {
	get?: () => T
	set?: (value: T) => void
	value?: T
	configurable?: boolean
	enumerable?: boolean
	writable?: boolean
}

interface SelectOptions {
	required?: boolean
	updateOnly?: boolean
}

function isCollectionStore(store: any): store is ICollectionStore<unknown> {
	return 'set' in store && typeof store.set === 'function' && store.value instanceof Map
}

export function select<T, R>(
	store: IStore<T> | ICollectionStore<T>,
	selectorFn: (state: any) => R = (state: R) => state,
	options: SelectOptions = {},
) {
	return function (proto: Record<string, any>, propName: string, _descriptor?: PropertyDescriptor<R>) {
		litProperty({ attribute: false, type: Object })(proto, propName)

		const originalConnectedCallback = proto.connectedCallback
		const originalDisconnectedCallback = proto.disconnectedCallback

		proto.connectedCallback = function (this: ComponentWithDisconnection) {
			const instance = this

			if (!instance.__selectorProps) {
				instance.__selectorProps = {}
			}

			if (!instance.__selectorProps[propName]) {
				instance.__selectorProps[propName] = {
					subscription: null,
					initialLoad: false,
				} as SelectorPropState<R>
			}

			const props = instance.__selectorProps[propName] as SelectorPropState<R>

			// Reset disconnecting Subject if it's closed or doesn't exist
			if (instance.disconnecting?.closed || !instance.disconnecting) {
				instance.disconnecting = new Subject<void>()
			}

			const selector = isCollectionStore(store)
				? createCollectionSelector(store, selectorFn)
				: createSelector(store as IStore<T>, selectorFn)

			// Call original connectedCallback immediately if not required
			if (!options.required && !props.initialLoad) {
				originalConnectedCallback?.call(instance)
				props.initialLoad = true
			}

			if (!props.subscription) {
				props.subscription = selector.pipe(takeUntil(instance.disconnecting)).subscribe({
					next: (value: R) => {
						const newValue = structuredClone(value)
						instance[propName] = newValue
						instance.requestUpdate?.()
						if (options.required && !props.initialLoad && newValue) {
							originalConnectedCallback?.call(instance)
							props.initialLoad = true
						}
					},
					error: (err: Error) => {
						console.error(`Error in selector subscription for ${propName}:`, err)
					},
				})
			}
		}

		proto.disconnectedCallback = function (this: ComponentWithDisconnection) {
			originalDisconnectedCallback?.call(this)

			const props = this.__selectorProps?.[propName] as SelectorPropState<R> | undefined
			if (props?.subscription) {
				props.subscription.unsubscribe()
				props.subscription = null
			}

			if (this.disconnecting) {
				this.disconnecting.next()
				this.disconnecting.complete()
				// Allow reinitialization by not deleting the disconnecting subject
			}
		}
	}
}

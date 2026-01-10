// src/store/selectors.ts
import { BehaviorSubject, Observable, combineLatest, distinctUntilChanged, map, share, shareReplay } from 'rxjs'
import { ICollectionStore, IStore, StoreError } from './types'

/**
 * Deep equality comparison for maps and complex objects
 * More efficient than JSON.stringify for large objects
 */
function deepEqual(a: unknown, b: unknown): boolean {
	if (a === b) return true

	if (a instanceof Map && b instanceof Map) {
		if (a.size !== b.size) return false
		for (const [key, value] of a) {
			if (!b.has(key) || !deepEqual(value, b.get(key))) return false
		}
		return true
	}

	if (a instanceof Set && b instanceof Set) {
		if (a.size !== b.size) return false
		for (const item of a) {
			if (!b.has(item)) return false
		}
		return true
	}

	if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
		const keysA = Object.keys(a)
		const keysB = Object.keys(b)

		if (keysA.length !== keysB.length) return false

		for (const key of keysA) {
			// @ts-ignore: Index signature
			if (!deepEqual(a[key], b[key])) return false
		}

		return true
	}

	return false
}

/**
 * Creates a selector that derives a value from store state
 *
 * @param store The store to observe
 * @param selectorFn Function that transforms the state
 * @returns An observable of the selected state that only emits when the derived value changes
 */
export function createSelector<T, R>(store: IStore<T>, selectorFn: (state: T) => R): Observable<R> {
	return store.$.pipe(map(selectorFn), distinctUntilChanged<R>(deepEqual), shareReplay(1))
}

/**
 * Creates a selector for collection stores that derives a value from the collection
 *
 * @param store The collection store to observe
 * @param selectorFn Function that transforms the collection
 * @returns An observable of the selected state that only emits when the derived value changes
 */
export function createCollectionSelector<T, R>(
	store: ICollectionStore<T>,
	selectorFn: (state: Map<string, T>) => R,
): Observable<R> {
	return store.$.pipe(map(selectorFn), distinctUntilChanged<R>(deepEqual), shareReplay(1))
}

/**
 * Creates a selector that returns all items from a collection as an array
 *
 * @param store The collection store
 * @returns An observable of all items as an array
 */
export function createItemsSelector<T>(store: ICollectionStore<T>): Observable<T[]> {
	return createCollectionSelector(store, collection => Array.from(collection.values()))
}

/**
 * Creates a selector that retrieves a single item from a collection
 *
 * @param store The collection store
 * @param itemKey The key of the item to select
 * @returns An observable of the selected item that emits when the item changes
 */
export function createItemSelector<T>(store: ICollectionStore<T>, itemKey: string): Observable<T | undefined> {
	return createCollectionSelector(store, collection => collection.get(itemKey))
}

/**
 * Creates a selector that returns all keys from a collection
 */
export function createKeysSelector<T>(store: ICollectionStore<T>): Observable<string[]> {
	return createCollectionSelector(store, collection => Array.from(collection.keys()))
}

/**
 * Creates a selector that returns entries (key-value pairs) from a collection
 */
export function createEntriesSelector<T>(store: ICollectionStore<T>): Observable<[string, T][]> {
	return createCollectionSelector(store, collection => Array.from(collection.entries()))
}

/**
 * Creates a selector that sorts collection items
 */
export function createSortSelector<T>(store: ICollectionStore<T>, compareFn: (a: T, b: T) => number): Observable<T[]> {
	return createCollectionSelector(store, collection => {
		return Array.from(collection.values()).sort(compareFn)
	})
}

/**
 * Creates a selector that finds the first item matching a predicate
 */
export function createFindSelector<T>(
	store: ICollectionStore<T>,
	predicate: (item: T, key: string) => boolean,
): Observable<T | undefined> {
	return createCollectionSelector(store, collection => {
		for (const [key, item] of collection.entries()) {
			if (predicate(item, key)) {
				return item
			}
		}
		return undefined
	})
}

/**
 * Creates a selector that filters items from a collection - OPTIMIZED
 *
 * @param store The collection store
 * @param filterFn Function that returns true for items to include
 * @returns An observable of filtered items as an array
 */
export function createFilterSelector<T>(
	store: ICollectionStore<T>,
	filterFn: (item: T, key: string) => boolean,
): Observable<T[]> {
	return createCollectionSelector(store, collection =>
		Array.from(collection.entries())
			.filter(([key, item]) => filterFn(item, key))
			.map(([_, item]) => item),
	)
}

/**
 * Creates a selector that maps collection values through a transform function - OPTIMIZED
 */
export function createMapSelector<T, R>(
	store: ICollectionStore<T>,
	mapFn: (item: T, key: string) => R,
): Observable<R[]> {
	return createCollectionSelector(store, collection =>
		Array.from(collection.entries()).map(([key, item]) => mapFn(item, key)),
	)
}

/**
 * Creates a selector that counts items in a collection, optionally filtered - OPTIMIZED
 *
 * @param store The collection store
 * @param filterFn Optional function to filter which items to count
 * @returns An observable of the count
 */
export function createCountSelector<T>(
	store: ICollectionStore<T>,
	filterFn?: (item: T, key: string) => boolean,
): Observable<number> {
	return createCollectionSelector(store, collection => {
		if (!filterFn) return collection.size

		return Array.from(collection.entries()).filter(([key, item]) => filterFn(item, key)).length
	})
}

/**
 * Optimized RxJS Pipeline - use share with reset on refCount zero for better memory management
 * in scenarios where selector subscriptions come and go
 *
 * @param store The store to observe
 * @param selectorFn Function that transforms the state
 * @returns An observable of the selected state with improved memory management
 */
export function createOptimizedSelector<T, R>(store: IStore<T>, selectorFn: (state: T) => R): Observable<R> {
	return store.$.pipe(
		map(selectorFn),
		distinctUntilChanged<R>(deepEqual),
		share({
			resetOnRefCountZero: true,
			resetOnError: false,
			resetOnComplete: false,
		}),
	)
}

/**
 * Creates a compound selector from multiple stores
 *
 * This function combines data from multiple stores to create a derived
 * state that's compatible with the @select decorator.
 *
 * @param stores Array of stores to derive state from
 * @param selectorFns Selector functions for each store
 * @param combinerFn Function that combines the selected values
 * @returns A store-compatible object to use with @select
 */
export function createCompoundSelector<R>(
	stores: Array<IStore<Record<string, unknown>> | ICollectionStore<unknown>>,
	selectorFns: Array<(state: unknown) => unknown>,
	combinerFn: (...values: unknown[]) => R,
): IStore<R> {
	// Calculate initial value
	const initialValues = stores.map((store, index) => selectorFns[index](store.value))
	const initialValue = combinerFn(...initialValues)

	// Create a store with the initial value
	const result: IStore<R> = {
		$: new BehaviorSubject<R>(initialValue),
		error$: new BehaviorSubject<StoreError | null>(null),
		ready: true,
		defaultValue: initialValue,

		get value(): R {
			return this.$.getValue()
		},

		// These methods are no-ops for read-only stores
		set(_value: Partial<R>, _merge?: boolean): void {
			console.warn('Compound selector store is read-only')
		},

		clear(): void {
			this.$.next(this.defaultValue)
		},

		replace(_newValue: R): void {
			console.warn('Compound selector store is read-only')
		},

		delete<K extends keyof R>(_key: K): void {
			console.warn('Compound selector store is read-only')
		},

		destroy(): void {
			this.$.complete()
			this.error$.complete()
		},
	}

	// Set up the reactivity by subscribing to all source stores
	const observables = stores.map((store, _) => store.$)

	// Create a subscription that updates the result whenever any source changes
	const subscription = combineLatest(observables).subscribe({
		next: storeValues => {
			try {
				// Apply selectors to each store value
				const selectedValues = storeValues.map((value, index) => selectorFns[index](value))

				// Apply combiner function
				const newValue = combinerFn(...selectedValues)

				// Update the BehaviorSubject
				result.$.next(newValue)
			} catch (err) {
				const error = new StoreError('Error in compound selector', err)
				result.error$.next(error)
				console.error(error)
			}
		},
		error: err => {
			const error = new StoreError('Error in store subscription', err)
			result.error$.next(error)
			console.error(error)
		},
	})

	// Ensure the subscription is cleaned up when the store is destroyed
	const originalDestroy = result.destroy
	result.destroy = function () {
		subscription.unsubscribe()
		originalDestroy.call(this)
	}

	return result
}

// src/store/selectors.ts
import { Observable, combineLatest } from 'rxjs'
import { map, distinctUntilChanged, shareReplay } from 'rxjs/operators'
import { IStore, ICollectionStore } from './types'

/**
 * Creates a selector that derives a value from store state
 *
 * @param store The store to observe
 * @param selectorFn Function that transforms the state
 * @returns An observable of the selected state that only emits when the derived value changes
 */
export function createSelector<T, R>(store: IStore<T>, selectorFn: (state: T) => R): Observable<R> {
	return store.$.pipe(
		map(selectorFn),
		distinctUntilChanged(
			(a, b) =>
				// Compare the two objects deep to see if they are equal
				JSON.stringify(a) === JSON.stringify(b),
		),
		shareReplay(1),
	)
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
	return store.$.pipe(
		map(selectorFn),
		distinctUntilChanged((a, b) => {
			if (a instanceof Map && b instanceof Map) {
				return JSON.stringify(Array.from(a.entries())) === JSON.stringify(Array.from(b.entries()))
			}
			return JSON.stringify(a) === JSON.stringify(b)
		}),
		shareReplay(1),
	)
}

/**
 * Creates a selector that filters items from a collection
 *
 * @param store The collection store
 * @param filterFn Function that returns true for items to include
 * @returns An observable of filtered items as an array
 */
export function createFilterSelector<T>(
	store: ICollectionStore<T>,
	filterFn: (item: T, key: string) => boolean,
): Observable<T[]> {
	return createCollectionSelector(store, collection => {
		const result: T[] = []
		collection.forEach((item, key) => {
			if (filterFn(item, key)) {
				result.push(item)
			}
		})
		return result
	})
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
 * Creates a selector that counts items in a collection, optionally filtered
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

		let count = 0
		collection.forEach((item, key) => {
			if (filterFn(item, key)) count++
		})
		return count
	})
}

/**
 * Creates a compound selector that depends on multiple other selectors
 *
 * @param selectors Array of source selectors
 * @param combinerFn Function that combines all selector results
 * @returns An observable of the combined result
 */
export function createCompoundSelector<R, T extends any[]>(
	selectors: Observable<any>[],
	combinerFn: (...values: T) => R,
): Observable<R> {
	return combineLatest(selectors).pipe(
		map(values => combinerFn(...(values as T))),
		distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
		shareReplay(1),
	)
}

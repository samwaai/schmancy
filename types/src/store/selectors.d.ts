import { Observable } from 'rxjs';
import { IStore, ICollectionStore } from './types';
/**
 * Creates a selector that derives a value from store state
 *
 * @param store The store to observe
 * @param selectorFn Function that transforms the state
 * @returns An observable of the selected state that only emits when the derived value changes
 */
export declare function createSelector<T, R>(store: IStore<T>, selectorFn: (state: T) => R): Observable<R>;
/**
 * Creates a selector for collection stores that derives a value from the collection
 *
 * @param store The collection store to observe
 * @param selectorFn Function that transforms the collection
 * @returns An observable of the selected state that only emits when the derived value changes
 */
export declare function createCollectionSelector<T, R>(store: ICollectionStore<T>, selectorFn: (state: Map<string, T>) => R): Observable<R>;
/**
 * Creates a selector that filters items from a collection
 *
 * @param store The collection store
 * @param filterFn Function that returns true for items to include
 * @returns An observable of filtered items as an array
 */
export declare function createFilterSelector<T>(store: ICollectionStore<T>, filterFn: (item: T, key: string) => boolean): Observable<T[]>;
/**
 * Creates a selector that retrieves a single item from a collection
 *
 * @param store The collection store
 * @param itemKey The key of the item to select
 * @returns An observable of the selected item that emits when the item changes
 */
export declare function createItemSelector<T>(store: ICollectionStore<T>, itemKey: string): Observable<T | undefined>;
/**
 * Creates a selector that counts items in a collection, optionally filtered
 *
 * @param store The collection store
 * @param filterFn Optional function to filter which items to count
 * @returns An observable of the count
 */
export declare function createCountSelector<T>(store: ICollectionStore<T>, filterFn?: (item: T, key: string) => boolean): Observable<number>;
/**
 * Creates a compound selector that depends on multiple other selectors
 *
 * @param selectors Array of source selectors
 * @param combinerFn Function that combines all selector results
 * @returns An observable of the combined result
 */
export declare function createCompoundSelector<R, T extends any[]>(selectors: Observable<any>[], combinerFn: (...values: T) => R): Observable<R>;

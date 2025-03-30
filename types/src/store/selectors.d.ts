import { Observable } from 'rxjs';
import { ICollectionStore, IStore } from './types';
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
 * Creates a selector that returns all items from a collection as an array
 *
 * @param store The collection store
 * @returns An observable of all items as an array
 */
export declare function createItemsSelector<T>(store: ICollectionStore<T>): Observable<T[]>;
/**
 * Creates a selector that retrieves a single item from a collection
 *
 * @param store The collection store
 * @param itemKey The key of the item to select
 * @returns An observable of the selected item that emits when the item changes
 */
export declare function createItemSelector<T>(store: ICollectionStore<T>, itemKey: string): Observable<T | undefined>;
/**
 * Creates a selector that returns all keys from a collection
 */
export declare function createKeysSelector<T>(store: ICollectionStore<T>): Observable<string[]>;
/**
 * Creates a selector that returns entries (key-value pairs) from a collection
 */
export declare function createEntriesSelector<T>(store: ICollectionStore<T>): Observable<[string, T][]>;
/**
 * Creates a selector that sorts collection items
 */
export declare function createSortSelector<T>(store: ICollectionStore<T>, compareFn: (a: T, b: T) => number): Observable<T[]>;
/**
 * Creates a selector that finds the first item matching a predicate
 */
export declare function createFindSelector<T>(store: ICollectionStore<T>, predicate: (item: T, key: string) => boolean): Observable<T | undefined>;
/**
 * Creates a selector that filters items from a collection - OPTIMIZED
 *
 * @param store The collection store
 * @param filterFn Function that returns true for items to include
 * @returns An observable of filtered items as an array
 */
export declare function createFilterSelector<T>(store: ICollectionStore<T>, filterFn: (item: T, key: string) => boolean): Observable<T[]>;
/**
 * Creates a selector that maps collection values through a transform function - OPTIMIZED
 */
export declare function createMapSelector<T, R>(store: ICollectionStore<T>, mapFn: (item: T, key: string) => R): Observable<R[]>;
/**
 * Creates a selector that counts items in a collection, optionally filtered - OPTIMIZED
 *
 * @param store The collection store
 * @param filterFn Optional function to filter which items to count
 * @returns An observable of the count
 */
export declare function createCountSelector<T>(store: ICollectionStore<T>, filterFn?: (item: T, key: string) => boolean): Observable<number>;
/**
 * Optimized RxJS Pipeline - use share with reset on refCount zero for better memory management
 * in scenarios where selector subscriptions come and go
 *
 * @param store The store to observe
 * @param selectorFn Function that transforms the state
 * @returns An observable of the selected state with improved memory management
 */
export declare function createOptimizedSelector<T, R>(store: IStore<T>, selectorFn: (state: T) => R): Observable<R>;
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
export declare function createCompoundSelector<R>(stores: Array<IStore<any> | ICollectionStore<any>>, selectorFns: Array<(state: any) => any>, combinerFn: (...values: any[]) => R): IStore<R>;

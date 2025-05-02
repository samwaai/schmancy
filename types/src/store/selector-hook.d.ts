import { ICollectionStore, IStore } from './types';
/**
 * Property descriptor interface
 */
type PropertyDescriptor<T> = {
    get?: () => T;
    set?: (value: T) => void;
    value?: T;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
};
/**
 * Options for selecting from a store
 */
interface SelectOptions {
    /** If true, will wait for selector to emit a non-null value before calling connectedCallback. Default is true. */
    required?: boolean;
    /** If true, will only update the component and not set the property value */
    updateOnly?: boolean;
    /** If true, will use structuredClone to deeply clone values (prevents mutations) */
    deepClone?: boolean;
    /** Custom equality function to determine when to update */
    equals?: (a: any, b: any) => boolean;
    /** Debug mode - logs selector activity */
    debug?: boolean;
}
/**
 * Selector decorator that connects a component property to a store selector
 * with improved memory management
 *
 * @param store The store to select from
 * @param selectorFn Optional function to transform the store state
 * @param options Additional options for the selector
 */
export declare function select<T, R>(store: IStore<T> | ICollectionStore<T>, selectorFn?: (state: any) => R, options?: SelectOptions): (proto: Record<string, any>, propName: string, _descriptor?: PropertyDescriptor<R>) => void;
/**
 * Creates a selector decorator that selects a specific item from a collection store
 * with improved memory management
 *
 * @param store The collection store
 * @param keyGetter Function that returns the key to select
 * @param options Additional options
 */
export declare function selectItem<T>(store: ICollectionStore<T>, keyGetter: (component: any) => string, options?: SelectOptions): (proto: Record<string, any>, propName: string, _descriptor?: PropertyDescriptor<T | undefined>) => void;
export {};

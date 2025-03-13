import { ICollectionStore, IStore } from './types';
type PropertyDescriptor<T> = {
    get?: () => T;
    set?: (value: T) => void;
    value?: T;
    configurable?: boolean;
    enumerable?: boolean;
    writable?: boolean;
};
interface SelectOptions {
    required?: boolean;
    updateOnly?: boolean;
}
export declare function select<T, R>(store: IStore<T> | ICollectionStore<T>, selectorFn?: (state: any) => R, options?: SelectOptions): (proto: Record<string, any>, propName: string, _descriptor?: PropertyDescriptor<R>) => void;
export {};

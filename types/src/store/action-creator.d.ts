export type Action<T = any> = {
    type: string;
    payload?: T;
};
export type ActionCreator<P = void, R = void> = P extends void ? () => R : (payload: P) => R;
export type ActionCreatorMap<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R : never;
};

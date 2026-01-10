/**
 * Generic constructor type for mixin patterns.
 * Note: TypeScript mixin patterns require `any[]` for proper type inference.
 * @see https://www.typescriptlang.org/docs/handbook/mixins.html
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = object> = new (...args: any[]) => T

/**
 * Abstract constructor type for mixin patterns.
 * Note: TypeScript mixin patterns require `any[]` for proper type inference.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AbstractConstructor<T = object> = abstract new (...args: any[]) => T

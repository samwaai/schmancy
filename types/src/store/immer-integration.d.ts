import { Draft, Immutable } from 'immer';
/**
 * Create an immutable update for Maps
 * @param map Original Map to update
 * @param updater Function that can make "mutable" changes to the draft
 * @returns A new Map with the changes applied
 */
export declare function updateMap<K, V>(map: Immutable<Map<K, V>>, updater: (draft: Draft<Map<K, V>>) => void): Map<K, V>;
/**
 * Create an immutable update for a specific item in a Map
 * @param map Original Map to update
 * @param key Key of the item to update
 * @param updater Function that can make "mutable" changes to the item
 * @returns A new Map with the item updated
 */
export declare function updateItem<K, V>(map: Immutable<Map<K, V>>, key: K, updater: (item: Draft<V>) => void): Map<K, V>;
/**
 * Immutably filter a Map
 * @param map Original Map to filter
 * @param predicate Function that returns true for items to keep
 * @returns A new Map with only the matching items
 */
export declare function filterMap<K, V>(map: Immutable<Map<K, V>>, predicate: (value: Immutable<V>, key: Immutable<K>) => boolean): Map<K, V>;
/**
 * Create an immutable update for an object
 * @param obj Original object to update
 * @param updater Function that can make "mutable" changes to the draft
 * @returns A new object with the changes applied
 */
export declare function updateObject<T extends Record<string, any>>(obj: Immutable<T>, updater: (draft: Draft<T>) => void): T;
/**
 * Merge objects immutably
 * @param target Original object
 * @param source Source object to merge in
 * @returns A new object with properties merged
 */
export declare function mergeObjects<T extends Record<string, any>>(target: Immutable<T>, source: Partial<T>): T;
/**
 * Type guard to check if an object is a Map
 */
export declare function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V>;
/**
 * Creates a readonly version of a type
 * This is a utility that uses Immer's Immutable type to make a type readonly
 * @param value The value to cast as immutable
 * @returns The same value but typed as immutable
 */
export declare function asReadonly<T>(value: T): Immutable<T>;
/**
 * Makes an object or Map deeply immutable at runtime by freezing
 * @param value The value to freeze
 * @returns The frozen value
 */
export declare function freeze<T>(value: T): Immutable<T>;

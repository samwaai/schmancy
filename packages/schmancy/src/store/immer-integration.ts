// src/store/immutable-helpers.ts
import { produce, Draft, castDraft, castImmutable, Immutable, enableMapSet } from 'immer'
enableMapSet()

/**
 * Create an immutable update for Maps
 * @param map Original Map to update
 * @param updater Function that can make "mutable" changes to the draft
 * @returns A new Map with the changes applied
 */
export function updateMap<K, V>(map: Immutable<Map<K, V>>, updater: (draft: Draft<Map<K, V>>) => void): Map<K, V> {
	return produce(map, updater) as unknown as Map<K, V>
}

/**
 * Create an immutable update for a specific item in a Map
 * @param map Original Map to update
 * @param key Key of the item to update
 * @param updater Function that can make "mutable" changes to the item
 * @returns A new Map with the item updated
 */
export function updateItem<K, V>(map: Immutable<Map<K, V>>, key: K, updater: (item: Draft<V>) => void): Map<K, V> {
	return produce(map, draft => {
		// Cast the key to the appropriate type for draft.get
		const draftKey = key as unknown as Draft<Immutable<K>>
		const item = draft.get(draftKey)
		if (item !== undefined) {
			// Cast the item to the expected type for the updater
			updater(item as unknown as Draft<V>)
		}
	}) as unknown as Map<K, V>
}

/**
 * Immutably filter a Map
 * @param map Original Map to filter
 * @param predicate Function that returns true for items to keep
 * @returns A new Map with only the matching items
 */
export function filterMap<K, V>(
	map: Immutable<Map<K, V>>,
	predicate: (value: Immutable<V>, key: Immutable<K>) => boolean,
): Map<K, V> {
	return produce(map, draft => {
		for (const [key, value] of draft.entries()) {
			if (!predicate(value as Immutable<V>, key as unknown as Immutable<K>)) {
				draft.delete(key)
			}
		}
	}) as unknown as Map<K, V>
}

/**
 * Create an immutable update for an object
 * @param obj Original object to update
 * @param updater Function that can make "mutable" changes to the draft
 * @returns A new object with the changes applied
 */
export function updateObject<T extends Record<string, any>>(obj: Immutable<T>, updater: (draft: Draft<T>) => void): T {
	return produce(obj, updater) as unknown as T
}

/**
 * Merge objects immutably
 * @param target Original object
 * @param source Source object to merge in
 * @returns A new object with properties merged
 */
export function mergeObjects<T extends Record<string, any>>(target: Immutable<T>, source: Partial<T>): T {
	return produce(target, draft => {
		Object.assign(draft, castDraft(source) as Draft<Partial<T>>)
	}) as unknown as T
}

/**
 * Type guard to check if an object is a Map
 */
export function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V> {
	return value instanceof Map
}

/**
 * Creates a readonly version of a type
 * This is a utility that uses Immer's Immutable type to make a type readonly
 * @param value The value to cast as immutable
 * @returns The same value but typed as immutable
 */
export function asReadonly<T>(value: T): Immutable<T> {
	return castImmutable(value)
}

/**
 * Makes an object or Map deeply immutable at runtime by freezing
 * @param value The value to freeze
 * @returns The frozen value
 */
export function freeze<T>(value: T): Immutable<T> {
	return produce(value, () => {}) as Immutable<T>
}

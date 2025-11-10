/** Supported comparison operators with TypeScript literal types */
export type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | 'notIncludes' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'any';
/**
 * Type-safe condition tuple
 */
export type ConditionTuple = [field: string, op: ComparisonOperator, expected: unknown, strict?: boolean];
/**
 * Type-safe condition object
 */
export interface ConditionObject {
    key: string | string[];
    operator: ComparisonOperator;
    value: unknown;
    strict?: boolean;
}
/**
 * Unified query condition type
 */
export type QueryCondition = ConditionTuple | ConditionObject;
/**
 * Filter result with item and score
 */
export interface ScoredItem<T> {
    item: T;
    score: number;
}
/**
 * Get a nested value from an object using a dot-separated path.
 * Checks explicitly for null/undefined so falsy values like 0 or false are preserved.
 */
export declare const getFieldValue: <T = any>(item: Record<string, any>, path: string) => T;
/**
 * Filter a Map of items given an array of query conditions.
 * For each query condition:
 * - If the expected value is empty/null/undefined, it is treated as a match.
 * - For non-fuzzy operators, the condition must strictly match.
 * - For the "any" operator, a fuzzy similarity score is computed.
 *   Items with a fuzzy score below a given threshold (e.g., 0.3) are excluded.
 *
 * The overall item score is the average of the scores from all conditions.
 * The results are sorted in descending order of relevance.
 *
 * @param items - A Map containing items to filter.
 * @param queries - An array of query conditions to apply.
 * @param fuzzyThreshold - Minimum score required for fuzzy matches (default: 0.3)
 * @returns An array of items that match all query conditions, sorted by relevance.
 */
export declare function filterMapItems<T extends Record<string, any>>(items: Map<string, T>, queries?: QueryCondition[], fuzzyThreshold?: number): T[];
/**
 * Filter an array of items using query conditions
 */
export declare function filterArrayItems<T extends Record<string, any>>(items: T[], queries?: QueryCondition[], fuzzyThreshold?: number): T[];
/**
 * Type guard for checking if a value is an array with better type inference
 * @param value Value to check
 * @returns True if the value is an array
 */
export declare function isArray<T = unknown>(value: unknown): value is Array<T>;
/**
 * Type guard for checking if a value is a string
 * @param value Value to check
 * @returns True if the value is a string
 */
export declare function isString(value: unknown): value is string;
/**
 * Type guard for checking if a value is a number
 * @param value Value to check
 * @returns True if the value is a number and not NaN
 */
export declare function isNumber(value: unknown): value is number;
/**
 * Type guard for checking if a value is a date
 * @param value Value to check
 * @returns True if the value is a valid Date object
 */
export declare function isDate(value: unknown): value is Date;
/**
 * Type guard for checking if a value is an iterable collection
 * @param value Value to check
 * @returns True if the value implements the iterable protocol
 */
export declare function isIterable<T = unknown>(value: unknown): value is Iterable<T>;
/**
 * Type guard for checking if a value is a Map
 * @param value Value to check
 * @returns True if the value is a Map
 */
export declare function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V>;
/**
 * Type guard for checking if a value is a Set
 * @param value Value to check
 * @returns True if the value is a Set
 */
export declare function isSet<T = unknown>(value: unknown): value is Set<T>;
/**
 * Type guard for checking if a value is a plain object (not an array, Map, etc.)
 * @param value Value to check
 * @returns True if the value is a plain object
 */
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
/**
 * Type guard for checking if a value is undefined or null
 * @param value Value to check
 * @returns True if the value is undefined or null
 */
export declare function isNil(value: unknown): value is undefined | null;
/**
 * Improved type-safe comparison function that uses appropriate type guards
 * @param op Comparison operator
 * @param actual Actual value
 * @param expected Expected value
 * @returns Result of the comparison
 */
export declare function compareValues(op: ComparisonOperator, actual: unknown, expected: unknown): boolean;
export declare const filterMap: typeof filterMapItems;
export declare const filterArray: typeof filterArrayItems;

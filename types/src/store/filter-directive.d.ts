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
    key: string;
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
 * Compare two values based on a comparison operator.
 * For non-fuzzy operators, this returns a boolean.
 */
export declare function compareValues(op: ComparisonOperator, actual: unknown, expected: unknown): boolean;
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
export declare const filterMap: typeof filterMapItems;
export declare const filterArray: typeof filterArrayItems;

/** Supported comparison operators. */
type ComparisonOperator = '==' | '!=' | '>' | '<' | '>=' | '<=' | 'includes' | 'notIncludes' | 'startsWith' | 'endsWith' | 'in' | 'notIn' | 'any';
/**
 * Query condition which can be either a tuple:
 * [field, operator, expected]
 * or an object:
 * { key, operator, value }
 */
export type QueryCondition = [field: string, op: ComparisonOperator, expected: unknown, strict?: boolean] | {
    key: string;
    operator: ComparisonOperator;
    value: unknown;
    strict?: boolean;
};
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
 * @returns An array of items that match all query conditions, sorted by relevance.
 */
export declare const filterMapItems: <T extends Record<string, any>>(items: Map<string, T>, queries?: QueryCondition[]) => T[];
export declare const filterMap: <T extends Record<string, any>>(items: Map<string, T>, queries?: QueryCondition[]) => T[];
export {};

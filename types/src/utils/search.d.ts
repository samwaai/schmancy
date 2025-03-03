/**
 * Calculate similarity score between two strings.
 * Returns a value between 0 (no match) and 1 (exact match).
 * Includes all similarity methods from the original filter directive.
 *
 * @param query The search query string
 * @param target The target string to compare against
 * @returns A similarity score from 0 to 1
 */
export declare function similarity(query: string, target: string): number;

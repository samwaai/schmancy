/**
 * Calculate similarity score between two strings.
 * Returns a value between 0 (no match) and 1 (exact match).
 * Optimized for autocomplete with prioritization of start matches and whole words.
 *
 * @param query The search query string
 * @param target The target string to compare against
 * @returns A similarity score from 0 to 1
 */
export declare function similarity(query: string, target: string): number;

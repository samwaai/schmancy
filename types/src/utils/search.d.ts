/**
 * Options for configuring similarity calculation behavior.
 */
export interface SimilarityOptions {
    /**
     * Whether to remove accents/diacritics during normalization.
     * @default true
     */
    normalizeAccents?: boolean;
    /**
     * Whether to include word-level Jaccard similarity in fuzzy matching.
     * Useful for matching phrases with different word orders.
     * @default true
     */
    includeWordJaccard?: boolean;
    /**
     * Maximum Levenshtein distance threshold for early termination.
     * Improves performance for very dissimilar strings.
     * Set to 0 to disable early termination.
     * @default 0 (disabled)
     */
    maxLevenshteinDistance?: number;
}
/**
 * Calculate similarity score between two strings.
 * Returns a value between 0 (no match) and 1 (exact match).
 * Optimized for autocomplete with prioritization of start matches and whole words.
 *
 * Scoring tiers (higher scores = better matches):
 * - 1.00: Exact match
 * - 0.95-1.00: Target starts with query (autocomplete-style)
 * - 0.765-0.85: Query matches start of a word in target
 * - 0.56-0.70: Query is substring of target
 * - 0.50: Query is subsequence of target
 * - 0.00-0.50: Fuzzy matching (typos, similar words, character overlap)
 *
 * @param query The search query string
 * @param target The target string to compare against
 * @param options Optional configuration for similarity calculation
 * @returns A similarity score from 0 to 1
 *
 * @example
 * similarity('john', 'John Doe') // 0.975+ (starts with)
 * similarity('doe', 'John Doe') // 0.765+ (word boundary)
 * similarity('jo', 'John Doe') // 0.95+ (starts with)
 * similarity('jhn', 'John Doe') // 0.3-0.5 (subsequence/fuzzy)
 */
export declare function similarity(query: string, target: string, options?: SimilarityOptions): number;

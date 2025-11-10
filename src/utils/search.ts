/**
 * Options for configuring similarity calculation behavior.
 */
export interface SimilarityOptions {
	/**
	 * Whether to remove accents/diacritics during normalization.
	 * @default true
	 */
	normalizeAccents?: boolean

	/**
	 * Whether to include word-level Jaccard similarity in fuzzy matching.
	 * Useful for matching phrases with different word orders.
	 * @default true
	 */
	includeWordJaccard?: boolean

	/**
	 * Maximum Levenshtein distance threshold for early termination.
	 * Improves performance for very dissimilar strings.
	 * Set to 0 to disable early termination.
	 * @default 0 (disabled)
	 */
	maxLevenshteinDistance?: number
}

// Scoring weights as named constants for clarity and maintainability
const SCORE_WEIGHT_DICE = 0.45
const SCORE_WEIGHT_LEVENSHTEIN = 0.45
const SCORE_WEIGHT_ANAGRAM = 0.3
const SCORE_WEIGHT_JACCARD = 0.4

// Word splitting pattern - defined once for reuse
const WORD_SPLIT_PATTERN = /[\s\-_.,;:!?()[\]{}]+/

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
export function similarity(query: string, target: string, options?: SimilarityOptions): number {
	// Handle edge cases
	if (!query || !target) return 0
	if (query === target) return 1

	// Default options
	const opts: Required<SimilarityOptions> = {
		normalizeAccents: options?.normalizeAccents ?? true,
		includeWordJaccard: options?.includeWordJaccard ?? true,
		maxLevenshteinDistance: options?.maxLevenshteinDistance ?? 0,
	}

	// Normalize strings for comparison
	const normalizedQuery = normalizeString(query, opts.normalizeAccents)
	const normalizedTarget = normalizeString(target, opts.normalizeAccents)

	// 1. Exact match (case-insensitive, accent-insensitive)
	if (normalizedQuery === normalizedTarget) return 1

	// 2. Target starts with query (highest priority for autocomplete)
	if (normalizedTarget.startsWith(normalizedQuery)) {
		// Give higher score to shorter targets (more precise matches)
		const lengthRatio = normalizedQuery.length / normalizedTarget.length
		return 0.95 + (lengthRatio * 0.05) // Score between 0.95 and 1.0
	}

	// 3. Word boundary match (query matches start of any word in target)
	const words = normalizedTarget.split(WORD_SPLIT_PATTERN).filter(w => w.length > 0)
	for (let i = 0; i < words.length; i++) {
		if (words[i].startsWith(normalizedQuery)) {
			// Score based on which word matched (earlier words score higher)
			const wordPositionScore = 1 - (i / words.length) * 0.1
			return 0.85 * wordPositionScore // Score between 0.765 and 0.85
		}
	}

	// 4. Direct substring match (query appears anywhere in target)
	if (normalizedTarget.includes(normalizedQuery)) {
		// Score based on position (earlier position scores higher)
		const position = normalizedTarget.indexOf(normalizedQuery)
		const positionScore = 1 - (position / normalizedTarget.length) * 0.2
		return 0.7 * positionScore // Score between 0.56 and 0.7
	}

	// 5. Subsequence check (all query chars appear in order)
	if (isSubsequence(normalizedQuery, normalizedTarget)) {
		return 0.5
	}

	// 6. Fuzzy matching for typos and similar words
	// Calculate all scores and return the maximum (avoid array allocation)
	let maxScore = 0

	// 6a. Dice coefficient (good for character-level similarity)
	const diceScore = diceCoefficient(normalizedQuery, normalizedTarget) * SCORE_WEIGHT_DICE
	if (diceScore > maxScore) maxScore = diceScore

	// 6b. Levenshtein distance (good for typos)
	const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length)
	const levenshteinDistance = calculateLevenshtein(
		normalizedQuery,
		normalizedTarget,
		opts.maxLevenshteinDistance
	)
	const levenshteinScore = maxLength ? (1 - levenshteinDistance / maxLength) * SCORE_WEIGHT_LEVENSHTEIN : 0
	if (levenshteinScore > maxScore) maxScore = levenshteinScore

	// 6c. Character frequency match (anagram-like)
	if (hasAllCharacters(normalizedQuery, normalizedTarget)) {
		if (SCORE_WEIGHT_ANAGRAM > maxScore) maxScore = SCORE_WEIGHT_ANAGRAM
	}

	// 6d. Word-level Jaccard similarity (good for phrase matching)
	if (opts.includeWordJaccard && words.length > 1) {
		const queryWords = normalizedQuery.split(WORD_SPLIT_PATTERN).filter(w => w.length > 0)
		if (queryWords.length > 0) {
			const jaccardScore = wordJaccardSimilarity(queryWords, words) * SCORE_WEIGHT_JACCARD
			if (jaccardScore > maxScore) maxScore = jaccardScore
		}
	}

	return maxScore
}

/**
 * Normalize a string for comparison.
 * - Converts to lowercase
 * - Trims whitespace
 * - Optionally removes accents/diacritics
 *
 * @param str The string to normalize
 * @param removeAccents Whether to remove accents/diacritics
 * @returns The normalized string
 */
function normalizeString(str: string, removeAccents: boolean): string {
	let normalized = str.toLowerCase().trim()

	if (removeAccents) {
		// Remove accents using NFD normalization and removing combining marks
		normalized = normalized.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
	}

	return normalized
}

/**
 * Calculate Jaccard similarity between two sets of words.
 * Returns a value between 0 (no overlap) and 1 (identical sets).
 * Optimized to avoid unnecessary array conversions.
 *
 * @param words1 Array of words from first string
 * @param words2 Array of words from second string
 * @returns Jaccard similarity score (0-1)
 */
function wordJaccardSimilarity(words1: string[], words2: string[]): number {
	if (words1.length === 0 || words2.length === 0) return 0

	const set1 = new Set(words1)
	const set2 = new Set(words2)

	// Count intersection
	let intersectionSize = 0
	set1.forEach(word => {
		if (set2.has(word)) intersectionSize++
	})

	// Union size = size1 + size2 - intersection
	const unionSize = set1.size + set2.size - intersectionSize

	return unionSize > 0 ? intersectionSize / unionSize : 0
}

/**
 * Check if string 'sub' is a subsequence of string 'str'.
 * All characters in 'sub' must appear in order in 'str'.
 */
function isSubsequence(sub: string, str: string): boolean {
	let i = 0,
		j = 0
	while (i < sub.length && j < str.length) {
		if (sub[i] === str[j]) i++
		j++
	}
	return i === sub.length
}

/**
 * Check if all characters in 'query' are present in 'target'.
 * For example, "aovc" matches "avocados" (anagram subset matching).
 * Optimized with Map for O(n+m) single-pass performance.
 */
function hasAllCharacters(query: string, target: string): boolean {
	// Build character frequency map for target (single pass)
	const targetCount = new Map<string, number>()
	for (let i = 0; i < target.length; i++) {
		const char = target[i]
		targetCount.set(char, (targetCount.get(char) || 0) + 1)
	}

	// Check query characters against target (single pass)
	const queryCount = new Map<string, number>()
	for (let i = 0; i < query.length; i++) {
		const char = query[i]
		queryCount.set(char, (queryCount.get(char) || 0) + 1)
	}

	// Verify all query chars exist in target with sufficient count
	let hasAll = true
	queryCount.forEach((count, char) => {
		if ((targetCount.get(char) || 0) < count) hasAll = false
	})

	return hasAll
}

/**
 * Compute Dice's coefficient for two strings based on bigrams.
 * Returns a value between 0 (no similarity) and 1 (perfect match).
 * Optimized with Map for O(n) performance instead of O(n²).
 */
function diceCoefficient(s1: string, s2: string): number {
	if (s1.length < 2 || s2.length < 2) return 0

	// Build bigram frequency map for s2 (O(n))
	const bigrams2Map = new Map<string, number>()
	for (let i = 0; i < s2.length - 1; i++) {
		const bigram = s2.substring(i, i + 2)
		bigrams2Map.set(bigram, (bigrams2Map.get(bigram) || 0) + 1)
	}

	// Count intersections while iterating s1 bigrams (O(n))
	let intersection = 0
	let bigrams1Count = 0
	for (let i = 0; i < s1.length - 1; i++) {
		const bigram = s1.substring(i, i + 2)
		bigrams1Count++
		const count = bigrams2Map.get(bigram)
		if (count && count > 0) {
			intersection++
			bigrams2Map.set(bigram, count - 1)
		}
	}

	const bigrams2Count = s2.length - 1
	return (2 * intersection) / (bigrams1Count + bigrams2Count)
}

/**
 * Calculate Levenshtein distance between two strings.
 * Optimized with O(min(n,m)) space complexity using rolling arrays.
 * Supports early termination when distance exceeds threshold.
 *
 * @param a First string
 * @param b Second string
 * @param maxDistance Maximum distance threshold for early termination (0 = disabled)
 * @returns The Levenshtein distance between the strings
 */
function calculateLevenshtein(a: string, b: string, maxDistance = 0): number {
	// Ensure a is the shorter string for space optimization
	if (a.length > b.length) [a, b] = [b, a]

	if (a.length === 0) return b.length

	// Early termination: if length difference exceeds max distance
	if (maxDistance > 0 && b.length - a.length > maxDistance) {
		return maxDistance + 1
	}

	// Use two rolling arrays instead of full matrix: O(n) space instead of O(n*m)
	let prevRow = new Array(a.length + 1)
	let currRow = new Array(a.length + 1)

	// Initialize first row
	for (let j = 0; j <= a.length; j++) {
		prevRow[j] = j
	}

	// Calculate distances row by row
	for (let i = 1; i <= b.length; i++) {
		currRow[0] = i
		let minRowValue = i

		for (let j = 1; j <= a.length; j++) {
			const cost = a[j - 1] === b[i - 1] ? 0 : 1
			currRow[j] = Math.min(
				prevRow[j] + 1,        // deletion
				currRow[j - 1] + 1,    // insertion
				prevRow[j - 1] + cost  // substitution
			)
			if (currRow[j] < minRowValue) minRowValue = currRow[j]
		}

		// Early termination: if minimum value in row exceeds threshold
		if (maxDistance > 0 && minRowValue > maxDistance) {
			return maxDistance + 1
		}

		// Swap arrays for next iteration (O(1) operation)
		;[prevRow, currRow] = [currRow, prevRow]
	}

	return prevRow[a.length]
}

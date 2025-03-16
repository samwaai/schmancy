// src/store/filter-directive.ts

/** Supported comparison operators with TypeScript literal types */
export type ComparisonOperator =
	| '=='
	| '!='
	| '>'
	| '<'
	| '>='
	| '<='
	| 'includes'
	| 'notIncludes'
	| 'startsWith'
	| 'endsWith'
	| 'in'
	| 'notIn'
	| 'any' // fuzzy search operator

/**
 * Type-safe condition tuple
 */
export type ConditionTuple = [field: string, op: ComparisonOperator, expected: unknown, strict?: boolean]

/**
 * Type-safe condition object
 */
export interface ConditionObject {
	key: string
	operator: ComparisonOperator
	value: unknown
	strict?: boolean
}

/**
 * Unified query condition type
 */
export type QueryCondition = ConditionTuple | ConditionObject

/**
 * Filter result with item and score
 */
export interface ScoredItem<T> {
	item: T
	score: number
}

/**
 * Get a nested value from an object using a dot-separated path.
 * Checks explicitly for null/undefined so falsy values like 0 or false are preserved.
 */
export const getFieldValue = <T = any>(item: Record<string, any>, path: string): T => {
	if (!path) return item as unknown as T

	const parts = path.split('.')
	let value: any = item

	for (const part of parts) {
		if (value == null) return undefined as unknown as T
		value = value[part]
	}

	return value as T
}

/**
 * Compute the Levenshtein distance between two strings.
 */
const levenshtein = (a: string, b: string): number => {
	if (a === b) return 0

	const matrix: number[][] = Array(b.length + 1)
		.fill(null)
		.map((_, i) => [i])

	// initialize the first row
	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j
	}

	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1]
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j] + 1, // deletion
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j - 1] + 1, // substitution
				)
			}
		}
	}
	return matrix[b.length][a.length]
}

/**
 * Check if string `sub` is a subsequence of string `str`.
 * All characters in `sub` must appear in order in `str` (they need not be contiguous).
 */
const isSubsequence = (sub: string, str: string): boolean => {
	if (!sub) return true
	if (!str) return false

	let i = 0,
		j = 0
	while (i < sub.length && j < str.length) {
		if (sub[i].toLowerCase() === str[j].toLowerCase()) i++
		j++
	}
	return i === sub.length
}

/**
 * Check if every character (with frequency) in the query exists in the target.
 * For example, "aovc" matches "avocados".
 */
const anagramMatch = (query: string, target: string): boolean => {
	if (!query) return true
	if (!target) return false

	const countChars = (s: string): Record<string, number> =>
		s
			.toLowerCase()
			.split('')
			.reduce(
				(acc, char) => {
					acc[char] = (acc[char] || 0) + 1
					return acc
				},
				{} as Record<string, number>,
			)

	const queryCount = countChars(query)
	const targetCount = countChars(target)
	return Object.keys(queryCount).every(char => (targetCount[char] || 0) >= queryCount[char])
}

/**
 * Generate bigrams for a string.
 */
const getBigrams = (s: string): string[] => {
	if (!s || s.length < 2) return []

	const bigrams: string[] = []
	for (let i = 0; i < s.length - 1; i++) {
		bigrams.push(s.substring(i, i + 2).toLowerCase())
	}
	return bigrams
}

/**
 * Compute Dice's coefficient for two strings based on bigrams.
 * Returns a value between 0 (no similarity) and 1 (perfect match).
 */
const diceCoefficient = (s1: string, s2: string): number => {
	if (!s1 || !s2 || s1.length < 2 || s2.length < 2) return 0

	const bigrams1 = getBigrams(s1)
	const bigrams2 = getBigrams(s2)

	if (bigrams1.length === 0 || bigrams2.length === 0) return 0

	let intersection = 0
	const used = new Array(bigrams2.length).fill(false)

	for (const bigram of bigrams1) {
		for (let i = 0; i < bigrams2.length; i++) {
			if (!used[i] && bigrams2[i] === bigram) {
				intersection++
				used[i] = true
				break
			}
		}
	}

	return (2 * intersection) / (bigrams1.length + bigrams2.length)
}

/**
 * Compute a fuzzy similarity score between two strings.
 * The score is computed by taking the maximum of several methods:
 * - Direct substring match (score 1)
 * - Subsequence check (score 0.8)
 * - Anagram subset match (score 0.7)
 * - Dice coefficient
 * - Normalized Levenshtein similarity
 */
const computeFuzzyScore = (actual: string, expected: string): number => {
	if (!actual || !expected) return 0

	const a = actual.toLowerCase().trim()
	const b = expected.toLowerCase().trim()

	if (a === b) return 1

	const substringScore = a.includes(b) ? 1 : 0
	const subsequenceScore = isSubsequence(b, a) ? 0.8 : 0
	const anagramScore = anagramMatch(b, a) ? 0.7 : 0
	const diceScore = diceCoefficient(a, b)

	const maxLen = Math.max(a.length, b.length)
	const levenshteinScore = maxLen ? 1 - levenshtein(a, b) / maxLen : 0

	return Math.max(substringScore, subsequenceScore, anagramScore, diceScore, levenshteinScore)
}

/**
 * Safely coerce value to string if possible, or return empty string
 */
const safeString = (value: unknown): string => {
	if (value == null) return ''
	return String(value)
}

/**
 * Type guard for arrays
 */
const isArray = (value: unknown): value is Array<unknown> => {
	return Array.isArray(value)
}

/**
 * Compare two values based on a comparison operator.
 * For non-fuzzy operators, this returns a boolean.
 */
export function compareValues(op: ComparisonOperator, actual: unknown, expected: unknown): boolean {
	// Handle null/undefined cases
	if (actual == null && expected == null) return true
	if (actual == null || expected == null) {
		// For equality operators, null == null but null != non-null
		if (op === '==') return actual === expected
		if (op === '!=') return actual !== expected
		// Other operators should return false for null/undefined values
		return false
	}

	switch (op) {
		case '==':
			return actual === expected
		case '!=':
			return actual !== expected
		case '>':
			return (actual as number) > (expected as number)
		case '<':
			return (actual as number) < (expected as number)
		case '>=':
			return (actual as number) >= (expected as number)
		case '<=':
			return (actual as number) <= (expected as number)
		case 'includes': {
			if (typeof actual === 'string') {
				return safeString(actual).toLowerCase().includes(safeString(expected).toLowerCase())
			} else if (isArray(actual)) {
				return actual.includes(expected)
			}
			return false
		}
		case 'notIncludes': {
			if (typeof actual === 'string') {
				return !safeString(actual).toLowerCase().includes(safeString(expected).toLowerCase())
			} else if (isArray(actual)) {
				return !actual.includes(expected)
			}
			return true
		}
		case 'startsWith': {
			if (typeof actual === 'string' && typeof expected === 'string') {
				return actual.toLowerCase().startsWith(expected.toLowerCase())
			}
			return false
		}
		case 'endsWith': {
			if (typeof actual === 'string' && typeof expected === 'string') {
				return actual.toLowerCase().endsWith(expected.toLowerCase())
			}
			return false
		}
		case 'in': {
			if (isArray(expected)) {
				return expected.includes(actual)
			}
			return false
		}
		case 'notIn': {
			if (isArray(expected)) {
				return !expected.includes(actual)
			}
			return true
		}
		default: {
			console.warn(`Operator "${op}" is not supported in strict comparison.`)
			return false
		}
	}
}

/**
 * Apply a query condition to an item and return score
 */
function applyQueryCondition<T extends Record<string, any>>(
	item: T,
	query: QueryCondition,
	fuzzyThreshold: number = 0.3,
): { valid: boolean; score: number } {
	let field: string,
		op: ComparisonOperator,
		expected: unknown,
		strict = false

	if (Array.isArray(query)) {
		;[field, op, expected, strict = false] = query
	} else {
		field = query.key
		op = query.operator
		expected = query.value
		strict = query.strict || false
	}

	// Skip empty filters for non-strict queries
	if (!strict && (expected === '' || expected == null || (isArray(expected) && expected.length === 0))) {
		return { valid: true, score: 1 }
	}

	const actual = getFieldValue(item, field)

	// If strict mode is enabled, enforce exact equality
	if (strict) {
		if (actual !== expected) {
			return { valid: false, score: 0 }
		}
		return { valid: true, score: 1 }
	}

	if (op === 'any') {
		// Fuzzy search requires both values to be strings
		if (typeof actual !== 'string' || typeof expected !== 'string') {
			return { valid: false, score: 0 }
		}

		const score = computeFuzzyScore(actual, expected)
		if (score < fuzzyThreshold) {
			return { valid: false, score: 0 }
		}

		return { valid: true, score }
	} else {
		// For non-fuzzy operators, check condition
		const matches = compareValues(op, actual, expected)
		return {
			valid: matches,
			score: matches ? 1 : 0,
		}
	}
}

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
export function filterMapItems<T extends Record<string, any>>(
	items: Map<string, T>,
	queries: QueryCondition[] = [],
	fuzzyThreshold: number = 0.3,
): T[] {
	// If no queries, return all items unsorted
	if (!queries.length) {
		return Array.from(items.values())
	}

	// Score and filter each item
	const scoredItems: ScoredItem<T>[] = []

	for (const [_, item] of items.entries()) {
		let totalScore = 0
		let matchCount = 0
		let valid = true

		for (const query of queries) {
			const result = applyQueryCondition(item, query, fuzzyThreshold)

			if (!result.valid) {
				valid = false
				break
			}

			totalScore += result.score
			matchCount++
		}

		if (valid) {
			scoredItems.push({
				item,
				score: matchCount > 0 ? totalScore / matchCount : 1,
			})
		}
	}

	// Sort by descending score
	scoredItems.sort((a, b) => b.score - a.score)

	return scoredItems.map(x => x.item)
}

/**
 * Filter an array of items using query conditions
 */
export function filterArrayItems<T extends Record<string, any>>(
	items: T[],
	queries: QueryCondition[] = [],
	fuzzyThreshold: number = 0.3,
): T[] {
	// Create temporary map with numeric indices as keys
	const map = new Map<string, T>()
	items.forEach((item, index) => map.set(String(index), item))

	return filterMapItems(map, queries, fuzzyThreshold)
}

// Export a simpler alias for filterMapItems
export const filterMap = filterMapItems

// Export an alias for filterArrayItems
export const filterArray = filterArrayItems

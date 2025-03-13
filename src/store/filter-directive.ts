/** Supported comparison operators. */
type ComparisonOperator =
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
 * Query condition which can be either a tuple:
 * [field, operator, expected]
 * or an object:
 * { key, operator, value }
 */
export type QueryCondition =
	| [field: string, op: ComparisonOperator, expected: unknown, strict?: boolean]
	| { key: string; operator: ComparisonOperator; value: unknown; strict?: boolean }

/**
 * Get a nested value from an object using a dot-separated path.
 * Checks explicitly for null/undefined so falsy values like 0 or false are preserved.
 */
const getFieldValue = (item: Record<string, any>, path: string): any =>
	path.split('.').reduce((obj, key) => (obj == null ? undefined : obj[key]), item)

/**
 * Compute the Levenshtein distance between two strings.
 */
const levenshtein = (a: string, b: string): number => {
	const matrix: number[][] = []

	// initialize the first column
	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i]
	}
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
	let i = 0,
		j = 0
	while (i < sub.length && j < str.length) {
		if (sub[i] === str[j]) i++
		j++
	}
	return i === sub.length
}

/**
 * Check if every character (with frequency) in the query exists in the target.
 * For example, "aovc" matches "avocados".
 */
const anagramMatch = (query: string, target: string): boolean => {
	const countChars = (s: string): Record<string, number> =>
		s.split('').reduce((acc, char) => {
			acc[char] = (acc[char] || 0) + 1
			return acc
		}, {} as Record<string, number>)

	const queryCount = countChars(query)
	const targetCount = countChars(target)
	return Object.keys(queryCount).every(char => (targetCount[char] || 0) >= queryCount[char])
}

/**
 * Generate bigrams for a string.
 */
const getBigrams = (s: string): string[] => {
	const bigrams = []
	for (let i = 0; i < s.length - 1; i++) {
		bigrams.push(s.substring(i, i + 2))
	}
	return bigrams
}

/**
 * Compute Dice's coefficient for two strings based on bigrams.
 * Returns a value between 0 (no similarity) and 1 (perfect match).
 */
const diceCoefficient = (s1: string, s2: string): number => {
	if (s1.length < 2 || s2.length < 2) return 0
	const bigrams1 = getBigrams(s1)
	const bigrams2 = getBigrams(s2)
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
	const a = actual.toLowerCase().trim()
	const b = expected.toLowerCase().trim()

	const substringScore = a.includes(b) ? 1 : 0
	const subsequenceScore = isSubsequence(b, a) ? 0.8 : 0
	const anagramScore = anagramMatch(b, a) ? 0.7 : 0
	const diceScore = diceCoefficient(a, b)
	const maxLen = Math.max(a.length, b.length)
	const levenshteinScore = maxLen ? 1 - levenshtein(a, b) / maxLen : 1

	return Math.max(substringScore, subsequenceScore, anagramScore, diceScore, levenshteinScore)
}

/**
 * Compare two values based on a simple operator.
 * For non-fuzzy operators, this returns a boolean.
 */
const compareValues = (op: ComparisonOperator, actual: any, expected: any): boolean => {
	switch (op) {
		case '==':
			return actual === expected
		case '!=':
			return actual !== expected
		case '>':
			return actual > expected
		case '<':
			return actual < expected
		case '>=':
			return actual >= expected
		case '<=':
			return actual <= expected
		case 'includes': {
			if (typeof actual === 'string') return actual.toLowerCase().includes(String(expected).toLowerCase())
			else if (Array.isArray(actual)) return actual.includes(expected)
			return false
		}
		case 'notIncludes': {
			if (typeof actual === 'string') return !actual.toLowerCase().includes(String(expected).toLowerCase())
			else if (Array.isArray(actual)) return !actual.includes(expected)
			return false
		}
		case 'startsWith': {
			if (typeof actual === 'string') return actual.startsWith(String(expected))
			return false
		}
		case 'endsWith': {
			if (typeof actual === 'string') return actual.endsWith(String(expected))
			return false
		}
		case 'in': {
			if (Array.isArray(expected)) return expected.includes(actual)
			return false
		}
		case 'notIn': {
			if (Array.isArray(expected)) return !expected.includes(actual)
			return false
		}
		default: {
			console.warn(`Operator "${op}" is not supported in strict comparison.`)
			return false
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
 * @returns An array of items that match all query conditions, sorted by relevance.
 */
export const filterMapItems = <T extends Record<string, any>>(
	items: Map<string, T>,
	queries: QueryCondition[] = [],
): T[] => {
	// Fuzzy threshold (adjust as needed)
	const fuzzyThreshold = 0.3

	// Score and filter each item.
	const scoredItems = Array.from(items.values())
		.map(item => {
			let totalScore = 0
			let count = 0
			// If any query fails, mark the item as invalid.
			let valid = true

			for (const query of queries) {
				let field: string,
					op: ComparisonOperator,
					expected: unknown,
					strict = false
				if (Array.isArray(query)) {
					// Extract optional strict flag from tuple if provided.
					;[field, op, expected, strict = false] = query
					strict = !!strict // default to false if undefined
				} else {
					field = query.key
					op = query.operator
					expected = query.value
					strict = query.strict || false
				}

				// If the expected value is empty/null/undefined, or an empty array, skip filtering.
				// If the expected value is empty/null/undefined, or an empty array, and strict is false, skip filtering
				if (!strict && (expected === '' || expected == null || (Array.isArray(expected) && expected.length === 0))) {
					continue
				}

				const actual = getFieldValue(item, field)

				// If strict mode is enabled, enforce exact equality.
				if (strict) {
					if (actual !== expected) {
						valid = false
						break
					}
					totalScore += 1 // exact match yields a perfect score
					count++
					continue
				}

				if (op === 'any') {
					// Fuzzy search requires both values to be strings.
					if (typeof actual !== 'string' || typeof expected !== 'string') {
						valid = false
						break
					}
					const score = computeFuzzyScore(actual, expected)
					if (score < fuzzyThreshold) {
						valid = false
						break
					}
					totalScore += score
					count++
				} else {
					// For non-fuzzy operators, if the condition fails, exclude the item.
					if (!compareValues(op, actual, expected)) {
						valid = false
						break
					}
					totalScore += 1 // strict match yields a perfect score.
					count++
				}
			}

			if (!valid) return null

			// Use the average score if at least one condition contributed.
			const overallScore = count > 0 ? totalScore / count : 1
			return { item, score: overallScore }
		})
		.filter(x => x !== null) as { item: T; score: number }[]

	// Sort by descending overall score.
	scoredItems.sort((a, b) => b.score - a.score)
	return scoredItems.map(x => x.item)
}

// /**
//  * A typed directive function interface.
//  * Ensures that using the directive returns a filtered (and ranked) array of items.
//  */
// export type FilterMapDirectiveFn = <T extends Record<string, any>>(
// 	items: Map<string, T>,
// 	queries?: QueryCondition[],
// ) => T[]

// /**
//  * Lit directive to filter a Map based on an array of query conditions.
//  *
//  * Usage in your Lit template:
//  *
//  * ```ts
//  * html`
//  *   <div .items=${filterMap(this.items, [
//  *     { key: 'category', operator: '==', value: itemsFilterContext.value.category },
//  *     ['name', 'any', 'avo'], // will match "avocados" even if typed as "avo" or "aovc"
//  *   ])}></div>
//  * `
//  * ```
//  */
// class FilterMapDirective extends Directive {
// 	constructor(partInfo: PartInfo) {
// 		super(partInfo)
// 	}

// 	render<T extends Record<string, any>>(items: Map<string, T>, queries: QueryCondition[] = []): T[] {
// 		return filterMapItems(items, queries) as T[]
// 	}
// }

// Cast the directive to our typed directive function interface.
export const filterMap = filterMapItems

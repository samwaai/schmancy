/**
 * Calculate similarity score between two strings.
 * Returns a value between 0 (no match) and 1 (exact match).
 * Includes all similarity methods from the original filter directive.
 *
 * @param query The search query string
 * @param target The target string to compare against
 * @returns A similarity score from 0 to 1
 */
export function similarity(query: string, target: string): number {
	// Handle edge cases
	if (!query || !target) return 0
	if (query === target) return 1

	// Normalize strings for comparison
	const normalizedQuery = query.toLowerCase().trim()
	const normalizedTarget = target.toLowerCase().trim()

	// Simple exact match check
	if (normalizedQuery === normalizedTarget) return 1

	// Calculate different similarity metrics using all methods from the original filter

	// 1. Direct substring match
	const substringScore = normalizedTarget.includes(normalizedQuery) ? 1 : 0

	// 2. Subsequence check
	const subsequenceScore = isSubsequence(normalizedQuery, normalizedTarget) ? 0.8 : 0

	// 3. Anagram/character frequency match
	const anagramScore = hasAllCharacters(normalizedQuery, normalizedTarget) ? 0.7 : 0

	// 4. Dice coefficient based on bigrams
	const diceScore = diceCoefficient(normalizedQuery, normalizedTarget)

	// 5. Levenshtein distance
	const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length)
	const levenshteinDistance = calculateLevenshtein(normalizedQuery, normalizedTarget)
	const levenshteinScore = maxLength ? 1 - levenshteinDistance / maxLength : 0

	// Return the maximum score from all methods
	return Math.max(substringScore, subsequenceScore, anagramScore, diceScore, levenshteinScore)
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
 */
function hasAllCharacters(query: string, target: string): boolean {
	const countChars = (s: string): Record<string, number> => {
		return s.split('').reduce(
			(acc, char) => {
				acc[char] = (acc[char] || 0) + 1
				return acc
			},
			{} as Record<string, number>,
		)
	}

	const queryCount = countChars(query)
	const targetCount = countChars(target)

	return Object.keys(queryCount).every(char => (targetCount[char] || 0) >= queryCount[char])
}

/**
 * Generate bigrams for a string.
 * A bigram is a sequence of two adjacent characters.
 */
function getBigrams(s: string): string[] {
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
function diceCoefficient(s1: string, s2: string): number {
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
 * Calculate Levenshtein distance between two strings.
 */
function calculateLevenshtein(a: string, b: string): number {
	if (a.length === 0) return b.length
	if (b.length === 0) return a.length

	const matrix: number[][] = []

	// Initialize the matrix
	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i]
	}
	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j
	}

	// Calculate distances
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			const cost = a[j - 1] === b[i - 1] ? 0 : 1
			matrix[i][j] = Math.min(
				matrix[i - 1][j] + 1, // deletion
				matrix[i][j - 1] + 1, // insertion
				matrix[i - 1][j - 1] + cost, // substitution
			)
		}
	}

	return matrix[b.length][a.length]
}

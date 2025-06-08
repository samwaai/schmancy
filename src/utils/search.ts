/**
 * Calculate similarity score between two strings.
 * Returns a value between 0 (no match) and 1 (exact match).
 * Optimized for autocomplete with prioritization of start matches and whole words.
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

	// 1. Exact match (case-insensitive)
	if (normalizedQuery === normalizedTarget) return 1

	// 2. Target starts with query (highest priority for autocomplete)
	if (normalizedTarget.startsWith(normalizedQuery)) {
		// Give higher score to shorter targets (more precise matches)
		const lengthRatio = normalizedQuery.length / normalizedTarget.length
		return 0.95 + (lengthRatio * 0.05) // Score between 0.95 and 1.0
	}

	// 3. Word boundary match (query matches start of any word in target)
	const words = normalizedTarget.split(/[\s\-_]+/)
	for (const word of words) {
		if (word.startsWith(normalizedQuery)) {
			// Score based on which word matched (earlier words score higher)
			const wordIndex = words.indexOf(word)
			const wordPositionScore = 1 - (wordIndex / words.length) * 0.1
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

	// 6. Fuzzy matching for typos
	// 6a. Dice coefficient (good for similar words)
	const diceScore = diceCoefficient(normalizedQuery, normalizedTarget)
	
	// 6b. Levenshtein distance (good for typos)
	const maxLength = Math.max(normalizedQuery.length, normalizedTarget.length)
	const levenshteinDistance = calculateLevenshtein(normalizedQuery, normalizedTarget)
	const levenshteinScore = maxLength ? 1 - levenshteinDistance / maxLength : 0

	// 6c. Character frequency match (anagram-like)
	const anagramScore = hasAllCharacters(normalizedQuery, normalizedTarget) ? 0.3 : 0

	// Combine fuzzy scores with weights
	const fuzzyScore = Math.max(
		diceScore * 0.4,
		levenshteinScore * 0.4,
		anagramScore
	)

	return fuzzyScore
}

// Keep the rest of the helper functions as they are...
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

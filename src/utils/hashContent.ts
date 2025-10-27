export default function (content: string): string {
	const fnvOffsetBasis = 0x811c9dc5
	const fnvPrime = 0x01000193
	let hash = fnvOffsetBasis

	for (let i = 0; i < content.length; i++) {
		hash ^= content.charCodeAt(i)
		hash = (hash * fnvPrime) >>> 0 // Ensure unsigned 32-bit integer
	}

	return hash.toString(16) // Convert to hexadecimal string for compactness
}

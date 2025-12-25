/**
 * Normalization utilities for consistent data matching
 *
 * These functions provide a single source of truth for normalizing
 * identifiers like IBANs, VAT numbers, and Tax IDs to ensure
 * consistent storage and querying across the application.
 */

/**
 * Normalize IBAN for consistent storage and querying
 *
 * Rules:
 * - Remove all whitespace
 * - Remove all non-alphanumeric characters (hyphens, dots, etc.)
 * - Convert to uppercase
 *
 * Examples:
 * - "DE89 3704 0044 0532 0130 00" → "DE89370400440532013000"
 * - "de89-3704-0044-0532-0130-00" → "DE89370400440532013000"
 * - "  DE89370400440532013000  " → "DE89370400440532013000"
 *
 * @param iban - IBAN string to normalize
 * @returns Normalized IBAN (uppercase, no spaces or special chars)
 */
export function normalizeIBAN(iban: string): string {
	if (!iban) return ''
	return iban.toUpperCase().replace(/[^A-Z0-9]/g, '') // Remove all non-alphanumeric
}

/**
 * Normalize VAT number for consistent matching
 *
 * Rules:
 * - Remove all whitespace
 * - Remove all non-alphanumeric characters
 * - Convert to uppercase
 *
 * Examples:
 * - "DE 123456789" → "DE123456789"
 * - "de-123-456-789" → "DE123456789"
 *
 * @param vat - VAT number to normalize
 * @returns Normalized VAT number (uppercase, no spaces or special chars)
 */
export function normalizeVAT(vat: string): string {
	if (!vat) return ''
	return vat.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * Normalize Tax ID for consistent matching
 *
 * Rules:
 * - Remove all whitespace
 * - Remove all non-alphanumeric characters
 * - Convert to uppercase
 *
 * Examples:
 * - "12/345/67890" → "12345678 90"
 * - "12-345-67890" → "1234567890"
 *
 * @param taxId - Tax ID to normalize
 * @returns Normalized Tax ID (uppercase, no spaces or special chars)
 */
export function normalizeTaxID(taxId: string): string {
	if (!taxId) return ''
	return taxId.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

/**
 * Normalize amount string for search matching
 *
 * Supports both German (1.234,56) and English (1,234.56) formats.
 * Removes all separators and keeps only digits and decimal point.
 *
 * Rules:
 * - Detect decimal separator (last comma or dot)
 * - Remove thousand separators
 * - Convert to standard format with dot as decimal separator
 *
 * Examples:
 * - "1.234,56" → "1234.56" (German format)
 * - "1,234.56" → "1234.56" (English format)
 * - "1 234,56" → "1234.56" (with spaces)
 * - "1234" → "1234" (integer)
 * - "1234.56" → "1234.56" (already normalized)
 *
 * @param amount - Amount string to normalize
 * @returns Normalized amount string with only digits and dot
 */
export function normalizeAmount(amount: string): string {
	if (!amount) return ''

	// Remove all whitespace
	let normalized = amount.trim().replace(/\s/g, '')

	// Detect decimal separator (last comma or dot)
	const lastComma = normalized.lastIndexOf(',')
	const lastDot = normalized.lastIndexOf('.')

	// Determine which is the decimal separator
	if (lastComma > lastDot) {
		// German format: 1.234,56 → comma is decimal
		normalized = normalized.replace(/\./g, '').replace(',', '.')
	} else if (lastDot > lastComma) {
		// English format: 1,234.56 → dot is decimal
		normalized = normalized.replace(/,/g, '')
	} else if (lastComma === -1 && lastDot === -1) {
		// No decimal separator - integer
		// Remove any separators that might exist
		normalized = normalized.replace(/[.,]/g, '')
	}

	return normalized
}

/**
 * Normalize text for fuzzy matching
 *
 * Rules:
 * - Convert to lowercase
 * - Replace special characters with spaces
 * - Collapse multiple spaces into single space
 * - Trim whitespace
 *
 * Useful for matching names, addresses, or any text where you want
 * to ignore formatting differences and special characters.
 *
 * Examples:
 * - "Müller, Hans-Peter" → "muller hans peter"
 * - "O'Connor  (John)" → "o connor john"
 * - "  Café - Berlin  " → "cafe berlin"
 *
 * @param text - Text to normalize
 * @returns Normalized text (lowercase, single spaces, no special chars)
 */
export function normalizeTextForMatching(text: string): string {
	if (!text) return ''
	return text
		.toLowerCase()
		.replace(/[^\w\s]/g, ' ') // Replace special chars with spaces
		.replace(/\s+/g, ' ') // Collapse multiple spaces to single space
		.trim()
}

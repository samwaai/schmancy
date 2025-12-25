import { z } from 'zod'

/**
 * Revolut Confirmation of Payee (CoP) Types
 *
 * THIN WRAPPER: Uses Revolut's EXACT API structure
 * Documentation: https://developer.revolut.com/docs/business/confirmation-of-payee
 */

// ============================================================================
// Revolut API Types (EXACT structure from API)
// ============================================================================

/**
 * Individual name for personal accounts
 */
export const RevolutIndividualNameSchema = z.object({
	first_name: z.string(),
	last_name: z.string(),
}).strict()

export type RevolutIndividualName = z.infer<typeof RevolutIndividualNameSchema>

/**
 * Revolut CoP API Request
 * POST /account-name-validation
 *
 * Supports two formats:
 * 1. UK: account_no + sort_code
 * 2. EU: iban + recipient_country + recipient_currency
 */
export const RevolutCoPRequestSchema = z.object({
	// UK format fields
	account_no: z.string().optional(), // UK account number
	sort_code: z.string().optional(), // UK sort code
	// EU format fields
	iban: z.string().optional(), // IBAN for EU accounts
	recipient_country: z.string().optional(), // ISO country code (e.g., "ES")
	recipient_currency: z.string().optional(), // Currency code (e.g., "EUR")
	// Name fields (required for both formats)
	company_name: z.string().optional(), // For business accounts
	individual_name: RevolutIndividualNameSchema.optional(), // For personal accounts
}).strict()

export type RevolutCoPRequest = z.infer<typeof RevolutCoPRequestSchema>

/**
 * Revolut CoP Result Codes
 */
const REVOLUT_RESULT_CODES = [
	'matched',
	'close_match',
	'not_matched',
	'cannot_be_checked',
	'temporarily_unavailable',
] as const

export const RevolutResultCodeSchema = z.enum(REVOLUT_RESULT_CODES)
export type RevolutResultCode = (typeof REVOLUT_RESULT_CODES)[number]

/**
 * Revolut CoP Reason
 */
export const RevolutCoPReasonSchema = z.object({
	type: z.string(), // e.g., 'uk_cop'
	code: z.string(), // e.g., 'close_match', 'account_does_not_exist'
}).strict()

export type RevolutCoPReason = z.infer<typeof RevolutCoPReasonSchema>

/**
 * Revolut CoP API Response
 */
export const RevolutCoPResponseSchema = z.object({
	result_code: RevolutResultCodeSchema,
	reason: RevolutCoPReasonSchema.optional(),
	company_name: z.string().optional(), // Actual account holder name if business
	individual_name: RevolutIndividualNameSchema.optional(), // Actual account holder name if personal
}).strict()

export type RevolutCoPResponse = z.infer<typeof RevolutCoPResponseSchema>

import { z } from 'zod'

/**
 * PAM VOP (Verification of Payee) and IBAN Validation Types
 * AI-based validation for IBAN structure, BIC codes, and company names
 */

const PROFILE_TYPE_VALUES = ['personal', 'business'] as const
export const ProfileTypeSchema = z.enum(PROFILE_TYPE_VALUES)
export type ProfileType = (typeof PROFILE_TYPE_VALUES)[number]

const CONFIDENCE_LEVEL_VALUES = ['high', 'medium', 'low'] as const
export const ConfidenceLevelSchema = z.enum(CONFIDENCE_LEVEL_VALUES)
export type ConfidenceLevel = (typeof CONFIDENCE_LEVEL_VALUES)[number]

export const ValidateVOPInputSchema = z
	.object({
		flowId: z.string(), // UUID for progress tracking
		iban: z.string(), // IBAN to validate
		bic: z.string().optional(), // Optional BIC/SWIFT code
		companyName: z.string().optional(), // Optional company name to verify
		recipientCountry: z.string().optional(), // ISO country code for Revolut (e.g., "DE", "FR")
		recipientCurrency: z.string().optional(), // Currency code for Revolut (e.g., "EUR", "GBP")
		profileType: ProfileTypeSchema.optional(), // User-provided profile type (overrides AI classification)
		orgId: z.string(), // Organization ID for both Firestore and Revolut operations
		businessId: z.string().optional(), // Optional: if validation is for specific business
		counterpartyId: z.string(), // Counterparty document ID to update
		accountId: z.string(), // Account ID within counterparty.accounts array
	})
	.strict()

export type ValidateVOPInput = z.infer<typeof ValidateVOPInputSchema>

export const RetryAttemptSchema = z
	.object({
		attempt: z.number(), // 1 for initial, 2+ for retries
		profileType: ProfileTypeSchema, // 'personal' or 'business'
		requestBody: z.any(), // The actual request sent to Revolut
		resultCode: z.string(), // Result code from this attempt
		succeeded: z.boolean(), // Whether this attempt was successful (matched/close_match)
	})
	.strict()

export type RetryAttempt = z.infer<typeof RetryAttemptSchema>

export const ValidateVOPOutputSchema = z
	.object({
		flowId: z.string(),
		revolutRequest: z.any().optional(), // Debug: Final request body used
		revolutResponse: z.any().optional(), // Debug: Final response body received
		retryAttempts: z.array(RetryAttemptSchema).optional(), // All attempts made (including initial)
	})

export type ValidateVOPOutput = z.infer<typeof ValidateVOPOutputSchema>

export const IBANValidationSchema = z
	.object({
		isValid: z.boolean(),
		countryCode: z.string(), // e.g., "DE", "FR", "GB"
		checkDigits: z.string(), // e.g., "89"
		bankCode: z.string(), // Extracted bank identifier
		accountNumber: z.string(), // Extracted account number
		error: z.string().optional(), // Error message if validation failed
	})
	.strict()

export type IBANValidation = z.infer<typeof IBANValidationSchema>

export const VOPBankInfoSchema = z
	.object({
		bankName: z.string(), // Full bank name (e.g., "Deutsche Bank AG")
		bankCode: z.string(), // National bank code
		country: z.string(), // Full country name
		countryCode: z.string(), // ISO country code
		currency: z.string(), // Primary currency (e.g., "EUR", "GBP", "PLN")
	})
	.strict()

export type VOPBankInfo = z.infer<typeof VOPBankInfoSchema>

export const NameVerificationSchema = z
	.object({
		profileType: ProfileTypeSchema, // Entity classification (personal or business)
		officialName: z.string(), // Suggested correct name format
		source: z.string(), // Basis for verification (e.g., "name pattern analysis", "company registry")
		confidence: ConfidenceLevelSchema,
		alternativeNames: z.array(z.string()).optional(), // Other known names/variations
		matchesProvided: z.boolean(), // Does it match the provided name?
		verificationNotes: z.string().optional(), // Additional context about the verification
	})
	.strict()

export type NameVerification = z.infer<typeof NameVerificationSchema>

const ACCOUNT_VALIDATION_STATUS_VALUES = ['matched', 'cannot_be_checked', 'not_matched', 'not_verified'] as const
export const AccountValidationStatusSchema = z.enum(ACCOUNT_VALIDATION_STATUS_VALUES)
export type AccountValidationStatus = (typeof ACCOUNT_VALIDATION_STATUS_VALUES)[number]

/**
 * Simplified, minimal validation schema - zero redundancy
 * Single source of truth for all validation data
 */
export const AccountVOPValidationSchema = z
	.object({
		// Single status field - Revolut's semantic result
		status: AccountValidationStatusSchema,
		validatedAt: z.string(), // ISO timestamp
		flowId: z.string(), // For tracking

		// AI validation results
		iban: IBANValidationSchema,
		bank: VOPBankInfoSchema,
		name: NameVerificationSchema.optional(),

		// Revolut CoP response (null if IBAN invalid)
		revolut: z
			.object({
				resultCode: z.enum(['matched', 'close_match', 'not_matched', 'cannot_be_checked', 'temporarily_unavailable']),
				actualName: z.string().optional(), // Unified: "First Last" OR "Company Name" - Only present if matched/close_match
				reason: z
					.object({
						type: z.string(),
						code: z.string(),
					})
					.optional(),
			})
			.nullable(),

		// Optional warnings/errors
		warnings: z.array(z.string()).optional(),
		errors: z.array(z.string()).optional(),
	})
	.strict()

export type AccountVOPValidation = z.infer<typeof AccountVOPValidationSchema>

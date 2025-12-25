/**
 * PAM Entity Types
 * Shared entity schemas used across document and processing types
 * This file breaks the circular dependency between documents.types and processing.types
 */

import { z } from 'zod'
import { TAddressSchema } from '../organizations.types'

/**
 * Bank information for sender
 * IBAN is required since it's used for matching
 * bankName is optional since it may not always be extracted reliably
 */
export const SenderBankInfoSchema = z.object({
	bankName: z.string().optional(),
	iban: z.string(), // Required - used for counterparty matching
	bic: z.string().optional(),
	accountNumber: z.string().optional(),
	sortCode: z.string().optional(),
	currency: z.string().optional(),
	purpose: z.string().optional(),
})

export type SenderBankInfo = z.infer<typeof SenderBankInfoSchema>

/**
 * Recipient information extracted from document
 */
export const RecipientInfoSchema = z.object({
	type: z.enum(['personal', 'company']),
	name: z.string(),
	address: TAddressSchema,
	taxId: z.string().optional(),
	vatNumber: z.string().optional(),
	registrationNumber: z.string().optional(),
	email: z.string().optional(),
	contactPerson: z.string().optional(),
})

export type RecipientInfo = z.infer<typeof RecipientInfoSchema>

/**
 * Sender information extracted from document
 */
export const SenderInfoSchema = z.object({
	type: z.enum(['personal', 'company']),
	name: z.string(),
	address: TAddressSchema,
	taxId: z.string().optional(),
	vatNumber: z.string().optional(),
	registrationNumber: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	website: z.string().optional(),
	contactPerson: z.string().optional(),
	banks: z.array(SenderBankInfoSchema).default([]),
})

export type SenderInfo = z.infer<typeof SenderInfoSchema>

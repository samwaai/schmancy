/**
 * PAM Counterparty Types
 * Shared between frontend and backend
 */

import { z } from 'zod'
import { TAddressSchema } from '../organizations.types'
import { ProfileTypeSchema } from './vop-validation.types'
import { DocumentAuditLogSchema } from '../audit.types'

export const BankAccountSchema = z.object({
	id: z.string(),
	currency: z.string(),

	// IBAN-based accounts
	iban: z.string().optional(),
	bic: z.string().optional(),

	// Non-IBAN accounts (UK, etc.)
	accountNumber: z.string().optional(),
	sortCode: z.string().optional(),

	// VOP validation results (flat fields)
	status: z.enum(['matched', 'not_matched', 'cannot_be_checked', 'not_verified']).optional(),
	bankName: z.string().optional(),
	bankCountry: z.string().optional(),
	validatedAt: z.string().optional(),
	name: z.string().optional(), // Account holder name from VOP
})

export type BankAccount = z.infer<typeof BankAccountSchema>

export const CounterpartySchema = z.object({
	id: z.string(),
	sharedBy: z.array(z.string()),
	name: z.string(),
	nameLocked: z.boolean().optional(), // If true, VOP validation cannot overwrite the name
	ibans: z.array(z.string()).optional(), // Denormalized IBANs for fast queries
	state: z.enum(['created', 'approved']),
	profileType: ProfileTypeSchema.optional(),
	createdByAI: z.boolean().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
	email: z.string().optional(),
	phone: z.string().optional(),
	address: TAddressSchema.optional(),
	taxId: z.string().optional(),
	vatNumber: z.string().optional(),
	registrationNumber: z.string().optional(),
	accounts: z.array(BankAccountSchema).optional(),

	// Excel import fields
	buchungstext: z.string().optional(),
	realsteuer: z.string().optional(),
	gegenkonto: z.string().optional(),
	kommentarIban: z.string().optional(),

	// Audit trail
	auditLog: DocumentAuditLogSchema.optional(),
})

export type Counterparty = z.infer<typeof CounterpartySchema>

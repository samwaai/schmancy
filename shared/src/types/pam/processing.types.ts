/**
 * PAM Document Processing Types
 * Shared between frontend and backend for document processing flow
 */

import { z } from 'zod'
import {
	CommercialInvoiceCategorySchema,
	GovernmentDocumentCategorySchema,
} from './documents.types'
import {
	RecipientInfoSchema,
	SenderInfoSchema,
	type RecipientInfo,
	type SenderInfo,
	type SenderBankInfo,
} from './entities.types'

// Re-export for backward compatibility
export { RecipientInfoSchema, SenderInfoSchema, type RecipientInfo, type SenderInfo, type SenderBankInfo }

/**
 * Document classification extracted by AI
 */
export const ClassificationSchema = z.union([
	z.object({
		type: z.enum(['CommercialInvoice']),
		category: CommercialInvoiceCategorySchema,
	}),
	z.object({
		type: z.enum(['GovernmentDocument']),
		category: GovernmentDocumentCategorySchema,
	}),
])

export type Classification = z.infer<typeof ClassificationSchema>

/**
 * Extracted entities stored in AIFlow for resumable processing
 */
export const ExtractedEntitiesSchema = z
	.object({
		recipient: RecipientInfoSchema.optional(),
		sender: SenderInfoSchema.optional(),
		classification: ClassificationSchema.optional(),
		countryCode: z.string().optional(),
		confidence: z.number().optional(),
	})
	.strict()

export type ExtractedEntities = z.infer<typeof ExtractedEntitiesSchema>

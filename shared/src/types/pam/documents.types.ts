/**
 * PAM Document Types
 * Shared between frontend and backend
 */

import { z } from 'zod'
import { RecipientInfoSchema, SenderInfoSchema } from './entities.types'

const DOCUMENT_STATUS_VALUES = ['uploading', 'pending', 'processing', 'completed', 'failed'] as const

export const DocumentStatusSchema = z.enum(DOCUMENT_STATUS_VALUES)
export type DocumentStatus = (typeof DOCUMENT_STATUS_VALUES)[number]

const COMMERCIAL_INVOICE_CATEGORIES = [
	'StandardInvoice',
	'CreditNote',
	'UtilityBill',
	'TelecomBill',
	'HotelInvoice',
	'TravelInvoice',
	'ProfessionalServices',
	'SubscriptionInvoice',
	'FreightLogistics',
	'RentLease',
	'PaymentReminder',
] as const

export const CommercialInvoiceCategorySchema = z.enum(COMMERCIAL_INVOICE_CATEGORIES)
export type CommercialInvoiceCategory = (typeof COMMERCIAL_INVOICE_CATEGORIES)[number]

const GOVERNMENT_DOCUMENT_CATEGORIES = [
	'TaxAssessment',
	'SocialInsurance',
	'CustomsDuty',
	'FinePenalty',
	'GovernmentPaymentReminder',
] as const

export const GovernmentDocumentCategorySchema = z.enum(GOVERNMENT_DOCUMENT_CATEGORIES)
export type GovernmentDocumentCategory = (typeof GOVERNMENT_DOCUMENT_CATEGORIES)[number]

// Line item with VAT details
export const LineItemSchema = z.object({
	description: z.string().describe('Item or service description'),
	quantity: z.number().optional().describe('Quantity of units'),
	unitPrice: z.number().optional().describe('Price per unit'),
	amount: z.number().describe('Total line amount'),
	vatRate: z.number().optional().describe('VAT rate in decimal form (0.19 for 19%)'),
	vatAmount: z.number().optional().describe('VAT amount for this line'),
})

export type LineItem = z.infer<typeof LineItemSchema>

// Commercial Invoice extracted data
export const CommercialInvoiceExtractedDataSchema = z.object({
	// Core invoice fields
	invoiceNumber: z.string().optional().describe('Invoice or bill number'),
	invoiceDate: z.string().optional().describe('Invoice issue date (YYYY-MM-DD)'),
	dueDate: z.string().optional().describe('Payment due date (YYYY-MM-DD)'),

	// Financial
	currency: z.string().optional().describe('ISO 4217 currency code (EUR, USD, etc.)'),
	netAmount: z.number().optional().describe('Net amount before tax'),
	taxAmount: z.number().optional().describe('Total tax amount (sum of all line VAT amounts)'),
	totalAmount: z.number().optional().describe('Total amount including tax'),
	dueAmount: z.number().optional().describe('Amount still outstanding (auto-filled from totalAmount if missing)'),
	paymentReference: z
		.string()
		.optional()
		.describe('Payment reference for bank transfer (CRITICAL: auto-filled from invoiceNumber if missing)'),

	// Categorization
	expenseCategory: z.string().optional().describe('Expense category for this invoice (AI-extracted based on document content and user history)'),

	// Line items with VAT
	lineItems: z.array(LineItemSchema).optional().describe('Invoice line items'),
})

export type CommercialInvoiceExtractedData = z.infer<typeof CommercialInvoiceExtractedDataSchema>

// Government Document extracted data
export const GovernmentDocumentExtractedDataSchema = z.object({
	// Core document fields
	documentNumber: z.string().optional().describe('Document or case number'),
	documentDate: z.string().optional().describe('Document issue date (YYYY-MM-DD)'),
	dueDate: z.string().optional().describe('Payment due date (YYYY-MM-DD)'),

	// Financial
	currency: z.string().optional().describe('ISO 4217 currency code (EUR, USD, etc.)'),
	netAmount: z.number().optional().describe('Net amount before tax'),
	taxAmount: z.number().optional().describe('Total tax amount'),
	totalAmount: z.number().optional().describe('Total amount including tax'),
	dueAmount: z.number().optional().describe('Amount still outstanding (auto-filled from totalAmount if missing)'),
	paymentReference: z
		.string()
		.optional()
		.describe('Payment reference for bank transfer (CRITICAL: auto-filled from documentNumber if missing)'),

	// Categorization
	expenseCategory: z.string().optional().describe('Expense category for this document (AI-extracted based on document content and user history)'),
})

export type GovernmentDocumentExtractedData = z.infer<typeof GovernmentDocumentExtractedDataSchema>

// Commercial Invoice (discriminated union) - flattened
export const CommercialInvoiceSchema = z
	.object({
		type: z.literal('CommercialInvoice'),
		category: CommercialInvoiceCategorySchema,
		// Core invoice fields
		invoiceNumber: z.string().optional(),
		invoiceDate: z.string().optional(),
		dueDate: z.string().optional(),
		// Financial
		currency: z.string().optional(),
		netAmount: z.number().optional(),
		taxAmount: z.number().optional(),
		totalAmount: z.number().optional(),
		// Auto-filled from totalAmount if missing (required for payment processing)
		dueAmount: z.number().optional(),
		// CRITICAL: Auto-filled from invoiceNumber if missing (required for payment tracking)
		paymentReference: z.string().optional(),
		// Categorization
		expenseCategory: z.string().optional(),
		// Additional fields
		comment: z.string().optional(),
		// Line items
		lineItems: z.array(LineItemSchema).optional(),
	})
	.strict()

export type CommercialInvoice = z.infer<typeof CommercialInvoiceSchema>

// Government Document (discriminated union) - flattened
export const GovernmentDocumentSchema = z
	.object({
		type: z.literal('GovernmentDocument'),
		category: GovernmentDocumentCategorySchema,
		// Core document fields
		documentNumber: z.string().optional(),
		documentDate: z.string().optional(),
		dueDate: z.string().optional(),
		// Financial
		currency: z.string().optional(),
		netAmount: z.number().optional(),
		taxAmount: z.number().optional(),
		totalAmount: z.number().optional(),
		// Auto-filled from totalAmount if missing (required for payment processing)
		dueAmount: z.number().optional(),
		// CRITICAL: Auto-filled from documentNumber if missing (required for payment tracking)
		paymentReference: z.string().optional(),
		// Categorization
		expenseCategory: z.string().optional(),
		// Additional fields
		comment: z.string().optional(),
	})
	.strict()

export type GovernmentDocument = z.infer<typeof GovernmentDocumentSchema>

// Document
export const DocumentSchema = z
	.object({
		checksum: z.string(), // Document ID = checksum (SHA-256 hash)
		fileName: z.string(),
		fileType: z.string(), // File extension (pdf, jpg, png, etc.) - calculated at upload time
		folderId: z.string().optional(),
		uploadedBy: z.string(),
		orgId: z.string(),
		status: DocumentStatusSchema,
		createdAt: z.string(), // ISO 8601 date string
		updatedAt: z.string(), // ISO 8601 date string
		error: z.string().optional(), // Error message for failed documents

		// Entity IDs at root level for easier access and updates
		recipientEntityId: z.string().optional(),
		senderEntityId: z.string().optional(),
		recipientBankAccountId: z.string().optional(), // Which recipient account to pay FROM
		senderBankAccountId: z.string().optional(), // Which sender account to pay TO

		// AI-extracted entity info (what was on the document)
		extractedRecipient: RecipientInfoSchema.optional(),
		extractedSender: SenderInfoSchema.optional(),

		// Manual review tracking
		manuallyReviewedBy: z.string().optional(), // User ID of person who manually reviewed and saved the document

		CommercialInvoice: CommercialInvoiceSchema.optional(),
		GovernmentDocument: GovernmentDocumentSchema.optional(),
	})
	.strict()

export type Document = z.infer<typeof DocumentSchema>

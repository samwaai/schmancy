/**
 * PAM Invoice Types
 * Shared between frontend and backend
 *
 * EU-compliant invoice management system supporting:
 * - Multi-party invoicing (employees, organizations, counterparties, custom)
 * - EU-wide VAT compliance (all 27 member states)
 * - Multi-currency support
 * - Reverse charge mechanism
 * - PDF generation and email delivery
 * - Templates and recurring invoices
 * - Payment tracking and reminders
 */

import { z } from 'zod'

// ============================================================================
// COUNTRY & CURRENCY
// ============================================================================

export const EU_COUNTRIES = [
	'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR',
	'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
	'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
] as const

export const EU_CURRENCIES = ['EUR', 'SEK', 'DKK', 'PLN', 'CZK', 'HUF', 'RON', 'BGN', 'HRK'] as const

export const CountryCodeSchema = z.string().length(2)
export type CountryCode = z.infer<typeof CountryCodeSchema>

export const CurrencySchema = z.enum(EU_CURRENCIES)
export type Currency = z.infer<typeof CurrencySchema>

// ============================================================================
// INVOICE TYPE
// ============================================================================

export const InvoiceTypeSchema = z.enum([
	'invoice',
	'credit_note',
	'debit_note',
	'proforma',
	'self_billing',
	'simplified',
])
export type InvoiceType = z.infer<typeof InvoiceTypeSchema>

// ============================================================================
// PARTY TYPES
// ============================================================================

export const InvoicePartyTypeSchema = z.enum(['employee', 'organization', 'counterparty', 'custom'])
export type InvoicePartyType = z.infer<typeof InvoicePartyTypeSchema>

export const InvoicePartySchema = z.object({
	type: InvoicePartyTypeSchema,
	id: z.string().optional(),
	name: z.string(),
	address: z.string(),
	city: z.string().optional(),
	postalCode: z.string().optional(),
	country: CountryCodeSchema,
	email: z.string().email(),
	phone: z.string().optional(),
	iban: z.string().optional(),
	bic: z.string().optional(),
	taxNumber: z.string().optional(),
	vatId: z.string().optional(),
	vatIdValidated: z.boolean().optional(),
	vatIdValidatedAt: z.string().optional(),
	bank: z.string().optional(),
	logo: z.string().optional(),
	website: z.string().optional(),
	registrationNumber: z.string().optional(),
})

export type InvoiceParty = z.infer<typeof InvoicePartySchema>

// ============================================================================
// LINE ITEM TYPES
// ============================================================================

export const InvoiceLineItemSchema = z.object({
	id: z.string(),
	position: z.number(),
	description: z.string(),
	detailedDescription: z.string().optional(),
	quantity: z.number().positive(),
	unit: z.string().default('pcs'),
	unitPrice: z.number(),
	vatRate: z.number().min(0).max(100),
	vatExemptReason: z.string().optional(),
	lineTotal: z.number(),
})

export type InvoiceLineItem = z.infer<typeof InvoiceLineItemSchema>

// ============================================================================
// STATUS TYPES
// ============================================================================

export const InvoiceStatusSchema = z.enum([
	'DRAFT', // Initial state, can be edited freely
	'OPEN', // Finalized and sent, awaiting payment
	'VIEWED', // Customer opened the invoice
	'PARTIALLY_PAID', // Some payment received
	'PAID', // Fully paid
	'OVERDUE', // Past due date without payment
	'CANCELLED', // Voided invoice
])

export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>

// ============================================================================
// PAYMENT TYPES
// ============================================================================

export const PaymentMethodSchema = z.enum([
	'bank_transfer',
	'card',
	'cash',
	'paypal',
	'stripe',
	'other',
])

export type PaymentMethod = z.infer<typeof PaymentMethodSchema>

export const PaymentSchema = z.object({
	id: z.string(),
	amount: z.number().positive(),
	date: z.string(), // ISO date
	method: PaymentMethodSchema,
	reference: z.string().optional(), // Transaction reference
	notes: z.string().optional(),
	recordedBy: z.string(), // User ID
	recordedAt: z.string(), // ISO timestamp
})

export type Payment = z.infer<typeof PaymentSchema>

// ============================================================================
// RECURRING CONFIG TYPES
// ============================================================================

export const RecurringFrequencySchema = z.enum([
	'daily',
	'weekly',
	'biweekly',
	'monthly',
	'quarterly',
	'semiannually',
	'annually',
	'custom',
])

export type RecurringFrequency = z.infer<typeof RecurringFrequencySchema>

export const RecurringConfigSchema = z.object({
	enabled: z.boolean(),
	frequency: RecurringFrequencySchema,
	interval: z.number().positive().default(1), // For custom frequency
	startDate: z.string(), // ISO date
	endDate: z.string().optional(), // ISO date, if not set = indefinite
	endAfterOccurrences: z.number().optional(), // Alternative to endDate
	occurrencesCompleted: z.number().default(0),
	nextGenerationDate: z.string(), // ISO date
	skipWeekends: z.boolean().default(false),
	skipHolidays: z.boolean().default(false),
	lastGeneratedAt: z.string().optional(), // ISO timestamp
})

export type RecurringConfig = z.infer<typeof RecurringConfigSchema>

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

export const InvoiceTemplateSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	orgId: z.string(),
	createdBy: z.string(),

	// Template defaults
	defaultPayee: InvoicePartySchema.optional(),
	defaultPayer: InvoicePartySchema.optional(),
	defaultItems: z.array(InvoiceLineItemSchema).optional(),
	defaultPaymentTermsDays: z.number().optional(),
	defaultNotes: z.string().optional(),

	// Metadata
	usageCount: z.number().default(0),
	createdAt: z.string(),
	updatedAt: z.string(),
})

export type InvoiceTemplate = z.infer<typeof InvoiceTemplateSchema>

// ============================================================================
// EMAIL TRACKING TYPES
// ============================================================================

export const EmailTrackingSchema = z.object({
	sentAt: z.string().optional(), // ISO timestamp
	deliveredAt: z.string().optional(),
	openedAt: z.string().optional(),
	clickedAt: z.string().optional(), // Payment link clicked
	bounced: z.boolean().default(false),
	bounceReason: z.string().optional(),
	recipient: z.string().optional(), // Email address
	messageId: z.string().optional(), // Email service message ID
})

export type EmailTracking = z.infer<typeof EmailTrackingSchema>

// ============================================================================
// REMINDER/DUNNING TYPES
// ============================================================================

export const ReminderLevelSchema = z.enum([
	'pre_due', // Friendly reminder before due date
	'level_1', // Polite reminder after due date
	'level_2', // Firmer reminder
	'level_3', // Final warning
	'collections', // Sent to collections
])

export type ReminderLevel = z.infer<typeof ReminderLevelSchema>

export const ReminderSchema = z.object({
	id: z.string(),
	level: ReminderLevelSchema,
	sentAt: z.string(), // ISO timestamp
	daysOverdue: z.number(),
	sentBy: z.string().optional(), // User ID (if manual)
	automatic: z.boolean().default(true),
})

export type Reminder = z.infer<typeof ReminderSchema>

// ============================================================================
// MAIN INVOICE TYPE
// ============================================================================

export const InvoiceSchema = z.object({
	// Core identification
	id: z.string(),
	invoiceNumber: z.string().optional(),
	invoiceType: InvoiceTypeSchema.default('invoice'),
	status: InvoiceStatusSchema,

	// Organization & ownership
	orgId: z.string(),
	createdBy: z.string(),
	lastModifiedBy: z.string().optional(),

	// Parties
	payee: InvoicePartySchema,
	payer: InvoicePartySchema,

	// Line items
	items: z.array(InvoiceLineItemSchema).min(1),

	// Amounts
	subtotal: z.number(),
	vatTotal: z.number(),
	vatBreakdown: z.record(z.string(), z.number()).optional(),
	discountAmount: z.number().default(0),
	tips: z.number().default(0).optional(),
	total: z.number(),
	currency: CurrencySchema.default('EUR'),

	// EU-specific VAT handling
	reverseCharge: z.boolean().default(false),
	reverseChargeReason: z.string().optional(),
	intraEU: z.boolean().default(false),
	b2b: z.boolean().default(false),
	vatExempt: z.boolean().default(false),
	vatExemptReason: z.string().optional(),

	// Localization
	language: z.string().default('de'),

	// Dates
	issueDate: z.string(), // ISO date
	serviceDate: z.string().optional(), // Date of service delivery
	dueDate: z.string(), // Payment due date
	paymentTermsDays: z.number().default(30), // Days from issue date

	// Payment tracking
	payments: z.array(PaymentSchema).default([]),
	amountPaid: z.number().default(0),
	amountRemaining: z.number().default(0),
	paidAt: z.string().optional(), // ISO timestamp when fully paid

	// PDF & delivery
	pdfUrl: z.string().optional(), // Firebase Storage URL (signed URL)
	storagePath: z.string().optional(), // Storage path: pam/invoices/{invoiceId}.pdf
	pdfGeneratedAt: z.string().optional(),
	emailTracking: EmailTrackingSchema.optional(),

	// Reminders & collections
	reminders: z.array(ReminderSchema).default([]),
	nextReminderDate: z.string().optional(),
	daysOverdue: z.number().default(0),

	// Template & recurring
	templateId: z.string().optional(), // If created from template
	recurring: RecurringConfigSchema.optional(),
	parentInvoiceId: z.string().optional(), // For recurring invoices
	childInvoiceIds: z.array(z.string()).default([]), // Generated recurring invoices

	// Additional info
	notes: z.string().optional(), // Internal notes
	customerNotes: z.string().optional(), // Notes visible to customer
	reference: z.string().optional(), // Customer reference number
	purchaseOrder: z.string().optional(), // PO number

	// Metadata
	createdAt: z.string(), // ISO timestamp
	updatedAt: z.string(),
	finalizedAt: z.string().optional(), // When status changed from DRAFT
	cancelledAt: z.string().optional(),
	cancellationReason: z.string().optional(),

	// Audit trail
	changeLog: z
		.array(
			z.object({
				timestamp: z.string(),
				userId: z.string(),
				action: z.string(),
				changes: z.record(z.string(), z.any()).optional(),
			}),
		)
		.default([]),
})

export type Invoice = z.infer<typeof InvoiceSchema>

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

export const CreateInvoiceRequestSchema = z.object({
	orgId: z.string(),
	payee: InvoicePartySchema,
	payer: InvoicePartySchema,
	items: z.array(InvoiceLineItemSchema),
	currency: CurrencySchema.default('EUR'),
	issueDate: z.string(),
	serviceDate: z.string().optional(),
	paymentTermsDays: z.number().default(30),
	notes: z.string().optional(),
	customerNotes: z.string().optional(),
	reference: z.string().optional(),
	templateId: z.string().optional(),
	recurring: RecurringConfigSchema.optional(),
})

export type CreateInvoiceRequest = z.infer<typeof CreateInvoiceRequestSchema>

export const CreateInvoiceResponseSchema = z.object({
	invoiceId: z.string(),
	status: z.string(),
})

export type CreateInvoiceResponse = z.infer<typeof CreateInvoiceResponseSchema>

// Finalize Invoice (assign number, lock for editing)
export const FinalizeInvoiceRequestSchema = z.object({
	invoiceId: z.string(),
})

export type FinalizeInvoiceRequest = z.infer<typeof FinalizeInvoiceRequestSchema>

export const FinalizeInvoiceResponseSchema = z.object({
	invoiceNumber: z.string(),
	status: z.string(),
})

export type FinalizeInvoiceResponse = z.infer<typeof FinalizeInvoiceResponseSchema>

// Generate PDF
export const GenerateInvoicePdfRequestSchema = z.object({
	invoiceId: z.string(),
})

export type GenerateInvoicePdfRequest = z.infer<typeof GenerateInvoicePdfRequestSchema>

export const GenerateInvoicePdfResponseSchema = z.object({
	pdfUrl: z.string(),
	storagePath: z.string(),
})

export type GenerateInvoicePdfResponse = z.infer<typeof GenerateInvoicePdfResponseSchema>

// Send Invoice Email
export const SendInvoiceEmailRequestSchema = z.object({
	invoiceId: z.string(),
	recipient: z.string().email().optional(), // Override payer email
	cc: z.array(z.string().email()).optional(),
	subject: z.string().optional(),
	message: z.string().optional(),
})

export type SendInvoiceEmailRequest = z.infer<typeof SendInvoiceEmailRequestSchema>

export const SendInvoiceEmailResponseSchema = z.object({
	sent: z.boolean(),
	messageId: z.string().optional(),
})

export type SendInvoiceEmailResponse = z.infer<typeof SendInvoiceEmailResponseSchema>

// Record Payment
export const RecordPaymentRequestSchema = z.object({
	invoiceId: z.string(),
	amount: z.number().positive(),
	date: z.string(), // ISO date
	method: PaymentMethodSchema,
	reference: z.string().optional(),
	notes: z.string().optional(),
})

export type RecordPaymentRequest = z.infer<typeof RecordPaymentRequestSchema>

export const RecordPaymentResponseSchema = z.object({
	paymentId: z.string(),
	invoiceStatus: InvoiceStatusSchema,
	amountRemaining: z.number(),
})

export type RecordPaymentResponse = z.infer<typeof RecordPaymentResponseSchema>

// Cancel Invoice
export const CancelInvoiceRequestSchema = z.object({
	invoiceId: z.string(),
	reason: z.string(),
})

export type CancelInvoiceRequest = z.infer<typeof CancelInvoiceRequestSchema>

export const CancelInvoiceResponseSchema = z.object({
	status: z.string(),
	cancelledAt: z.string(),
})

export type CancelInvoiceResponse = z.infer<typeof CancelInvoiceResponseSchema>

// Process Recurring Invoices (scheduled function)
export const ProcessRecurringInvoicesRequestSchema = z.object({
	dryRun: z.boolean().default(false),
	limit: z.number().optional(),
})

export type ProcessRecurringInvoicesRequest = z.infer<typeof ProcessRecurringInvoicesRequestSchema>

export const ProcessRecurringInvoicesResponseSchema = z.object({
	processed: z.number(),
	generated: z.array(z.string()), // Invoice IDs
	errors: z.array(z.object({ invoiceId: z.string(), error: z.string() })),
})

export type ProcessRecurringInvoicesResponse = z.infer<typeof ProcessRecurringInvoicesResponseSchema>

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function validateGermanCompliance(invoice: Invoice): string[] {
	const errors: string[] = []

	if (!invoice.payee.name) errors.push('Payee name is required')
	if (!invoice.payee.address) errors.push('Payee address is required')
	if (!invoice.payee.taxNumber && !invoice.payee.vatId) {
		errors.push('Payee must have tax number or VAT ID')
	}

	if (!invoice.payer.name) errors.push('Payer name is required')
	if (!invoice.payer.address) errors.push('Payer address is required')

	if (!invoice.invoiceNumber) errors.push('Invoice number is required')
	if (!invoice.issueDate) errors.push('Issue date is required')

	if (invoice.items.length === 0) errors.push('At least one line item is required')
	invoice.items.forEach((item, i) => {
		if (!item.description) errors.push(`Item ${i + 1}: Description required`)
		if (item.quantity <= 0) errors.push(`Item ${i + 1}: Invalid quantity`)
		if (item.vatRate < 0 || item.vatRate > 100) errors.push(`Item ${i + 1}: Invalid VAT rate`)
	})

	return errors
}

/**
 * Calculate VAT breakdown by rate
 */
export function calculateVATBreakdown(items: InvoiceLineItem[]): Record<number, number> {
	return items.reduce(
		(acc, item) => {
			const net = item.quantity * item.unitPrice
			const vat = net * (item.vatRate / 100)
			acc[item.vatRate] = (acc[item.vatRate] || 0) + vat
			return acc
		},
		{} as Record<number, number>,
	)
}

/**
 * Calculate totals from line items
 */
export function calculateInvoiceTotals(items: InvoiceLineItem[], tips = 0, discount = 0) {
	const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
	const vatBreakdown = calculateVATBreakdown(items)
	const vatTotal = Object.values(vatBreakdown).reduce((sum, vat) => sum + vat, 0)
	const total = subtotal + vatTotal + tips - discount

	return {
		subtotal: Math.round(subtotal * 100) / 100,
		vatTotal: Math.round(vatTotal * 100) / 100,
		vatBreakdown,
		total: Math.round(total * 100) / 100,
	}
}

/**
 * Additional Payments Types for German Payroll
 *
 * Supports:
 * - Urlaubsgeld (Lohnart 1001) - Vacation bonus, one-time EUR amount
 * - Urlaubsentgelt (Lohnart 0014) - Vacation pay, hours × rate
 * - Entgeltfortzahlung (Lohnart 0007) - Sick pay, hours × rate (first 6 weeks employer-paid)
 */

export type AdditionalPaymentType = 'urlaubsgeld' | 'urlaubsentgelt' | 'entgeltfortzahlung'

export type LohnartCode = '1001' | '0014' | '0007'

/**
 * Additional Payment record - flat structure, one document per day
 */
export interface AdditionalPayment {
	id?: string
	orgId: string
	employeeId: string

	// Date info (derived from date field)
	date: string // YYYY-MM-DD - the actual day
	year: string // YYYY (for querying)
	month: string // MM (for querying)

	// Payment details
	paymentType: AdditionalPaymentType
	lohnart: LohnartCode
	hours: number // Hours for this day (0 for urlaubsgeld)
	hourlyRate: number // EUR
	amount: number // hours × rate, or direct amount for urlaubsgeld

	// Audit
	createdAt: string
	createdBy: string
	updatedAt?: string
	updatedBy?: string
}

/**
 * Maps payment type to Lohnart code
 */
export const PAYMENT_TYPE_TO_LOHNART: Record<AdditionalPaymentType, LohnartCode> = {
	urlaubsgeld: '1001',
	urlaubsentgelt: '0014',
	entgeltfortzahlung: '0007',
}

/**
 * Labels for payment types
 */
export const ADDITIONAL_PAYMENT_LABELS: Record<
	AdditionalPaymentType,
	{ title: string; subtitle: string; lohnart: LohnartCode }
> = {
	urlaubsgeld: {
		title: 'Vacation Bonus',
		subtitle: 'One-time payment',
		lohnart: '1001',
	},
	urlaubsentgelt: {
		title: 'Vacation Pay',
		subtitle: 'Paid vacation days',
		lohnart: '0014',
	},
	entgeltfortzahlung: {
		title: 'Sick Pay',
		subtitle: 'Employer-paid sick leave',
		lohnart: '0007',
	},
}

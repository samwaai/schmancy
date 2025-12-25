import { z } from 'zod'

export const InvoiceReconciliationLineSchema = z.object({
	index: z.number(),
	description: z.string(),
	invoiceQty: z.number(),
	invoicePrice: z.number(),
	itemId: z.string().nullable(),
	itemName: z.string().nullable(),
	orderQty: z.number().nullable(),
	orderPrice: z.number().nullable(),
	qtyMismatch: z.boolean(),
	priceMismatch: z.boolean(),
})

export type InvoiceReconciliationLine = z.infer<typeof InvoiceReconciliationLineSchema>

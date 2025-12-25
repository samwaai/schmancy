type InvoiceStatus = 'draft' | 'in_queue' | 'processing' | 'error_parsing' | 'duplicate' | 'done'

/**
 * The self-contained `Row` type for your `invoices` table.
 */
export type InvoicesRow = {
	id: number // or optional if your DB auto-generates it
	created_at: string // if present in DB
	updated_at: string // if present in DB
	attempts: number // if present in DB
	final: InvoiceData | null
	gpt_response: InvoiceData | null
	ocr: InvoiceData | null
	errors: string[] | null
	actions: string[] | null
	status: InvoiceStatus
}

/**
 * The self-contained `Insert` type for your `invoices` table,
 * used when inserting new rows.
 */
export type InvoicesInserts = {
	id?: number
	created_at?: string
	updated_at?: string
	attempts?: number
	final?: InvoiceData | null
	gpt_response?: InvoiceData | null
	ocr?: InvoiceData | null
	errors?: string[] | null
	actions?: string[] | null
	status?: InvoiceStatus
}

/**
 * The self-contained `Update` type for your `invoices` table,
 * used when updating existing rows.
 */
export type InvoicesUpdates = {
	final?: InvoiceData | null
	gpt_response?: InvoiceData | null
	ocr?: InvoiceData | null
	errors?: string[] | null
	actions?: string[] | null
	status?: InvoiceStatus
}
/**
 * Completely self-contained invoice data shape.
 * Replace or expand fields as needed.
 */
export type InvoiceData = {
	invoiceNumber: string // e.g., INV-123
	issueDate: string // ISO date string: "2023-01-01"
	dueDate?: string // optional due date
	customer: {
		name: string
		address?: string
		email?: string
	}
	items: Array<{
		description: string
		quantity: number
		unitPrice: number
	}>
	subtotal: number
	tax?: number
	total: number
	notes?: string
}

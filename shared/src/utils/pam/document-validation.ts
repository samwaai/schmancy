/**
 * PAM Document Validation
 */

import type { Document } from '../../types/pam/documents.types'
import type { Counterparty } from '../../types/pam/counterparty.types'
import { normalizeString } from '../similarity'

export interface ValidationIssue {
	field: string
	message: string
	category: 'counterparty' | 'financial' | 'recipient' | 'document' | 'payment'
	severity: 'error' | 'warning' | 'info'
}

export interface DocumentValidation {
	issues: ValidationIssue[]
}

function normalize(str: string): string {
	return str.toUpperCase().replace(/[^A-Z0-9]/g, '')
}

export function validateCounterparty(
	document: Document,
	counterparty: Counterparty | undefined,
): { issues: ValidationIssue[] } {
	const issues: ValidationIssue[] = []

	// If senderBankAccountId exists, ONLY validate account status - skip all IBAN validation
	if (document.senderBankAccountId) {
		// If counterparty hasn't loaded yet, show info instead of error
		if (!counterparty) {
			issues.push({
				field: 'senderBankAccount',
				message: 'Loading counterparty data...',
				category: 'counterparty',
				severity: 'info',
			})
			return { issues }
		}

		const senderBankAccount = counterparty.accounts?.find(acc => acc.id === document.senderBankAccountId)

		if (!senderBankAccount) {
			issues.push({
				field: 'senderBankAccount',
				message: 'Selected bank account not found - data may be corrupted',
				category: 'counterparty',
				severity: 'error',
			})
			return { issues }
		}

		if (!senderBankAccount.status) {
			issues.push({
				field: 'senderBankAccount',
				message: 'Account not verified - click validate to verify bank details',
				category: 'counterparty',
				severity: 'warning',
			})
		} else if (senderBankAccount.status === 'not_matched') {
			issues.push({
				field: 'senderBankAccount',
				message: 'Payment will fail - recipient name does not match bank records',
				category: 'counterparty',
				severity: 'error',
			})
		} else if (senderBankAccount.status === 'cannot_be_checked') {
			issues.push({
				field: 'senderBankAccount',
				message: 'Cannot verify this account - bank does not support verification',
				category: 'counterparty',
				severity: 'warning',
			})
		} else if (senderBankAccount.status === 'not_verified') {
			issues.push({
				field: 'senderBankAccount',
				message: 'Account verification pending - verification in progress',
				category: 'counterparty',
				severity: 'warning',
			})
		}

		return { issues } // Payment destination is known - skip IBAN validation
	}

	// No senderBankAccountId - must have counterparty for IBAN validation
	if (!counterparty) {
		issues.push({
			field: 'senderEntityId',
			message: 'Counterparty not found',
			category: 'counterparty',
			severity: 'error',
		})
		return { issues }
	}

	const extractedIBANs = document.extractedSender?.banks?.map(b => b.iban).filter((iban): iban is string => Boolean(iban)) || []
	const counterpartyIBANs = counterparty.accounts?.map(a => a.iban).filter((iban): iban is string => Boolean(iban)) || []

	// CRITICAL: Check counterparty has bank accounts first (required for payment)
	if (counterpartyIBANs.length === 0) {
		issues.push({
			field: 'counterparty.iban',
			message: 'Counterparty has no bank accounts - add IBAN to enable payment',
			category: 'counterparty',
			severity: 'error',
		})
	}

	// Then check if IBAN was extracted from document (informational)
	if (extractedIBANs.length === 0) {
		issues.push({
			field: 'counterparty.iban',
			message: 'No IBAN extracted from document - cannot verify payment destination',
			category: 'counterparty',
			severity: 'info',
		})
	} else if (counterpartyIBANs.length > 0 && !extractedIBANs.some(extracted => counterpartyIBANs.some(cp => normalize(extracted) === normalize(cp)))) {
		// IBAN extracted AND counterparty has accounts, but they don't match
		issues.push({
			field: 'counterparty.iban',
			message: 'IBAN from document does not match counterparty accounts - verify payment destination',
			category: 'counterparty',
			severity: 'warning',
		})
	}

	if (!document.senderEntityId) {
		const extractedName = document.extractedSender?.name || ''
		const counterpartyName = counterparty.name || ''

		if (extractedName && counterpartyName && normalizeString(extractedName) !== normalizeString(counterpartyName)) {
			issues.push({
				field: 'counterparty.name',
				message: `Name mismatch: "${extractedName}" vs "${counterpartyName}" - verify counterparty`,
				category: 'counterparty',
				severity: 'warning',
			})
		}
	}

	if (extractedIBANs.length > 0 && counterpartyIBANs.length > 0) {
		const matchedAccount = counterparty.accounts?.find(account =>
			extractedIBANs.some(extracted => normalize(extracted) === normalize(account.iban || ''))
		)

		if (matchedAccount?.status !== 'matched') {
			issues.push({
				field: 'counterparty.account.status',
				message: 'Bank account not verified - please verify payee details',
				category: 'counterparty',
				severity: 'warning',
			})
		}
	}

	return { issues }
}

export function validateFinancials(document: Document): { issues: ValidationIssue[] } {
	const issues: ValidationIssue[] = []

	const data = document.CommercialInvoice || document.GovernmentDocument
	if (!data) return { issues }

	// Check for all zero amounts (extraction failure)
	const allAmountsZero =
		(data.netAmount === 0 || data.netAmount === undefined) &&
		(data.taxAmount === 0 || data.taxAmount === undefined) &&
		(data.totalAmount === 0 || data.totalAmount === undefined) &&
		(data.dueAmount === 0 || data.dueAmount === undefined)

	if (allAmountsZero) {
		issues.push({
			field: 'financial',
			message: 'All amounts are zero - data extraction failed. Please review and enter amounts manually.',
			category: 'financial',
			severity: 'error',
		})
		return { issues } // Exit early - financial data is completely missing
	}

	if (data.totalAmount === undefined || data.totalAmount === null) {
		issues.push({
			field: 'totalAmount',
			message: 'Total amount is required',
			category: 'financial',
			severity: 'error',
		})
		return { issues }
	}

	if (data.totalAmount < 0) {
		issues.push({
			field: 'totalAmount',
			message: 'Total amount cannot be negative',
			category: 'financial',
			severity: 'error',
		})
	}

	if (data.dueAmount === undefined || data.dueAmount === null) {
		issues.push({
			field: 'dueAmount',
			message: 'Due amount is required',
			category: 'financial',
			severity: 'error',
		})
	}

	if (data.netAmount !== undefined && data.taxAmount !== undefined && data.totalAmount !== undefined) {
		if (Math.abs(data.netAmount + data.taxAmount - data.totalAmount) > 0.01) {
			issues.push({
				field: 'financial',
				message: `Net (${data.netAmount}) + Tax (${data.taxAmount}) ≠ Total (${data.totalAmount})`,
				category: 'financial',
				severity: 'error',
			})
		}
	}

	return { issues }
}

export function validateRecipient(document: Document): { issues: ValidationIssue[] } {
	const issues: ValidationIssue[] = []

	if (!document.recipientEntityId) {
		issues.push({
			field: 'recipientEntityId',
			message: 'Recipient organization not matched',
			category: 'recipient',
			severity: 'error',
		})
	}

	return { issues }
}

export function validateSender(document: Document): { issues: ValidationIssue[] } {
	const issues: ValidationIssue[] = []

	if (!document.senderEntityId) {
		issues.push({
			field: 'senderEntityId',
			message: 'Sender/counterparty not matched',
			category: 'counterparty',
			severity: 'error',
		})
	}

	return { issues }
}

export function validateDocumentData(document: Document): { issues: ValidationIssue[] } {
	const issues: ValidationIssue[] = []

	if (document.GovernmentDocument) {
		if (!document.GovernmentDocument.documentDate) {
			issues.push({
				field: 'documentDate',
				message: 'Document date missing',
				category: 'document',
				severity: 'warning',
			})
		}
	}

	return { issues }
}

export function validatePaymentInfo(document: Document): { issues: ValidationIssue[] } {
	const issues: ValidationIssue[] = []

	if (document.CommercialInvoice) {
		if (!document.CommercialInvoice.paymentReference && !document.CommercialInvoice.invoiceNumber) {
			issues.push({
				field: 'paymentReference',
				message: 'Payment reference is required for payment tracking. Please add invoice number or payment reference manually.',
				category: 'payment',
				severity: 'error',
			})
		} else if (!document.CommercialInvoice.paymentReference) {
			issues.push({
				field: 'paymentReference',
				message: 'Payment reference missing - invoice number will be used as reference',
				category: 'payment',
				severity: 'warning',
			})
		}
	} else if (document.GovernmentDocument) {
		if (!document.GovernmentDocument.paymentReference && !document.GovernmentDocument.documentNumber) {
			issues.push({
				field: 'paymentReference',
				message: 'Payment reference is required for payment tracking. Please add document number or payment reference manually.',
				category: 'payment',
				severity: 'error',
			})
		} else if (!document.GovernmentDocument.paymentReference) {
			issues.push({
				field: 'paymentReference',
				message: 'Payment reference missing - document number will be used as reference',
				category: 'payment',
				severity: 'warning',
			})
		}
	}

	return { issues }
}

export function validateDocument(
	document: Document,
	counterparty?: Counterparty,
): DocumentValidation {
	const senderValidation = validateSender(document)
	const counterpartyValidation = validateCounterparty(document, counterparty)
	const financialValidation = validateFinancials(document)
	const recipientValidation = validateRecipient(document)
	const documentValidation = validateDocumentData(document)
	const paymentValidation = validatePaymentInfo(document)

	return {
		issues: [
			...senderValidation.issues,
			...counterpartyValidation.issues,
			...financialValidation.issues,
			...recipientValidation.issues,
			...documentValidation.issues,
			...paymentValidation.issues,
		],
	}
}

/**
 * Find duplicate payment references across documents
 * Returns a map of normalized payment reference -> array of document checksums
 */
export function findDuplicatePaymentReferences(documents: Document[]): Map<string, string[]> {
	const refToChecksums = new Map<string, string[]>()

	for (const doc of documents) {
		const extracted = doc.CommercialInvoice || doc.GovernmentDocument
		if (!extracted) continue

		// Get payment reference (fallback to invoice/document number)
		let paymentRef = extracted.paymentReference
		if (!paymentRef && doc.CommercialInvoice) paymentRef = doc.CommercialInvoice.invoiceNumber
		if (!paymentRef && doc.GovernmentDocument) paymentRef = doc.GovernmentDocument.documentNumber
		if (!paymentRef) continue

		// Normalize (trim, lowercase)
		const normalized = paymentRef.trim().toLowerCase()
		if (!normalized) continue

		const existing = refToChecksums.get(normalized) || []
		existing.push(doc.checksum)
		refToChecksums.set(normalized, existing)
	}

	// Filter to only duplicates (2+ documents)
	const duplicates = new Map<string, string[]>()
	refToChecksums.forEach((checksums, ref) => {
		if (checksums.length > 1) duplicates.set(ref, checksums)
	})

	return duplicates
}

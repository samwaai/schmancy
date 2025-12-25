import type { Transaction } from '../types/owl/transactions.types'
import { TransactionType } from '../types/owl/transactions.types'

// ─────────────────────────────────────────────────────────────
// TRANSFER ORDER RECONCILIATION
// Separate from purchase order reconciliation - different domain
// ─────────────────────────────────────────────────────────────

export type ItemNameResolver = (itemId: string) => string

const defaultItemNameResolver: ItemNameResolver = (itemId: string) =>
	`Item ${itemId.substring(0, 8)}...`

// ─────────────────────────────────────────────────────────────
// ACTION TYPES
// ─────────────────────────────────────────────────────────────

export interface TransferMismatchAction {
	type: 'transfer_mismatch'
	sourceTransactionId: string
	destinationTransactionId: string
	itemId: string
	itemName: string
	sourceWarehouseId: string
	destinationWarehouseId: string
	sourceQuantity: number
	destinationQuantity: number
	mismatchAmount: number
}

export interface OrphanedTransferAction {
	type: 'orphaned_transfer'
	transactionId: string
	itemId: string
	itemName: string
	warehouseId: string
	quantity: number
	missingSide: 'source' | 'destination'
}

export type TransferReconciliationAction = TransferMismatchAction | OrphanedTransferAction

// ─────────────────────────────────────────────────────────────
// ANALYSIS RESULT
// ─────────────────────────────────────────────────────────────

export interface TransferReconciliationAnalysis {
	orderId: string
	totalTransactions: number
	actions: TransferReconciliationAction[]
	summary: {
		mismatches: number
		orphanedTransfers: number
		total: number
	}
}

// ─────────────────────────────────────────────────────────────
// ANALYSIS FUNCTION
// ─────────────────────────────────────────────────────────────

/**
 * Analyzes transfer order transactions to detect:
 * 1. Mismatched pairs - source and destination quantities don't match
 * 2. Orphaned transfers - missing source or destination
 *
 * Transfer pairs: source (negative qty) + destination (positive qty) for same itemId
 */
export function analyzeTransferTransactions(
	orderId: string,
	transactions: Transaction[],
	getItemName: ItemNameResolver = defaultItemNameResolver,
): TransferReconciliationAnalysis {
	const actions: TransferReconciliationAction[] = []

	// Filter to transfer transactions only
	const transferTransactions = transactions.filter(tx => tx.type === TransactionType.TRANSFER)

	// Group by itemId
	const transfersByItem = new Map<string, Transaction[]>()
	for (const tx of transferTransactions) {
		if (!transfersByItem.has(tx.itemId)) {
			transfersByItem.set(tx.itemId, [])
		}
		transfersByItem.get(tx.itemId)!.push(tx)
	}

	// Track matched transactions
	const matchedSourceIds = new Set<string>()
	const matchedDestIds = new Set<string>()

	// Check each item's transfer pairs
	for (const [itemId, txs] of transfersByItem) {
		const sources = txs.filter(tx => tx.quantity < 0)
		const destinations = txs.filter(tx => tx.quantity > 0)

		// Match sources to destinations
		for (const source of sources) {
			// Find matching destination (same orderId context)
			const destination = destinations.find(d => d.orderId === source.orderId)

			if (destination) {
				matchedSourceIds.add(source.id)
				matchedDestIds.add(destination.id)

				const sourceAbs = Math.abs(source.quantity)
				const destAbs = Math.abs(destination.quantity)
				const mismatch = Math.abs(sourceAbs - destAbs)

				if (mismatch > 0.001) {
					actions.push({
						type: 'transfer_mismatch',
						sourceTransactionId: source.id,
						destinationTransactionId: destination.id,
						itemId,
						itemName: getItemName(itemId),
						sourceWarehouseId: source.warehouseID,
						destinationWarehouseId: destination.warehouseID,
						sourceQuantity: source.quantity,
						destinationQuantity: destination.quantity,
						mismatchAmount: mismatch,
					})
				}
			}
		}

		// Find orphaned sources
		for (const source of sources) {
			if (!matchedSourceIds.has(source.id)) {
				actions.push({
					type: 'orphaned_transfer',
					transactionId: source.id,
					itemId,
					itemName: getItemName(itemId),
					warehouseId: source.warehouseID,
					quantity: source.quantity,
					missingSide: 'destination',
				})
			}
		}

		// Find orphaned destinations
		for (const dest of destinations) {
			if (!matchedDestIds.has(dest.id)) {
				actions.push({
					type: 'orphaned_transfer',
					transactionId: dest.id,
					itemId,
					itemName: getItemName(itemId),
					warehouseId: dest.warehouseID,
					quantity: dest.quantity,
					missingSide: 'source',
				})
			}
		}
	}

	return {
		orderId,
		totalTransactions: transferTransactions.length,
		actions,
		summary: {
			mismatches: actions.filter(a => a.type === 'transfer_mismatch').length,
			orphanedTransfers: actions.filter(a => a.type === 'orphaned_transfer').length,
			total: actions.length,
		},
	}
}

// ─────────────────────────────────────────────────────────────
// TYPE GUARDS
// ─────────────────────────────────────────────────────────────

export function isTransferMismatchAction(action: TransferReconciliationAction): action is TransferMismatchAction {
	return action.type === 'transfer_mismatch'
}

export function isOrphanedTransferAction(action: TransferReconciliationAction): action is OrphanedTransferAction {
	return action.type === 'orphaned_transfer'
}

// ─────────────────────────────────────────────────────────────
// FIX OPERATIONS
// ─────────────────────────────────────────────────────────────

export interface FixTransferPairOp {
	type: 'fix_transfer_pair'
	sourceTransactionId: string
	destinationTransactionId: string
	newSourceQuantity: number
	newDestinationQuantity: number
}

export interface DeleteTransactionOp {
	type: 'delete_transaction'
	transactionId: string
}

export type TransferFixOp = FixTransferPairOp | DeleteTransactionOp

/**
 * Get fix operations for transfer reconciliation actions
 * Strategy: destination (what was received) is the source of truth
 */
export function getTransferFixOperations(actions: TransferReconciliationAction[]): TransferFixOp[] {
	const ops: TransferFixOp[] = []

	for (const action of actions) {
		if (action.type === 'transfer_mismatch') {
			const destQty = Math.abs(action.destinationQuantity)
			ops.push({
				type: 'fix_transfer_pair',
				sourceTransactionId: action.sourceTransactionId,
				destinationTransactionId: action.destinationTransactionId,
				newSourceQuantity: -destQty,
				newDestinationQuantity: destQty,
			})
		}
		// Orphaned transfers need manual intervention - can't auto-fix
	}

	return ops
}

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

export function hasTransferReconciliationIssues(analysis: TransferReconciliationAnalysis): boolean {
	return analysis.summary.total > 0
}

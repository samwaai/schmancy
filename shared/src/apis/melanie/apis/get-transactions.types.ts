/**
 * Melanie Get Revolut Transactions API Types
 * Request/response types for getTransactions Cloud Function
 */

import type { RevolutRawTransaction } from '../../../melanie/types/payment.types';

/**
 * Request to get Revolut transactions
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
  /** Optional from date filter (ISO 8601) */
  from?: string;
  /** Optional to date filter (ISO 8601) */
  to?: string;
  /** Optional count limit */
  count?: number;
  /** Optional counterparty/account ID filter */
  counterparty?: string;
  /** Optional transaction type filter */
  type?: string;
}

/**
 * Response with Revolut transactions
 */
export interface Response {
  /** Array of raw Revolut transactions */
  transactions: RevolutRawTransaction[];
  /** Total count of transactions returned */
  totalCount: number;
}

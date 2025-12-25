/**
 * Melanie Create Bulk Payment API Types
 * Request/response types for createBulkPayment Cloud Function
 */

/**
 * Processing options for bulk payment
 */
export interface ProcessingOptions {
  /** Number of payments to process in each batch */
  batchSize?: number;
  /** Delay in milliseconds between batches */
  delayBetweenBatches?: number;
  /** Whether to stop processing on first error */
  stopOnError?: boolean;
}

/**
 * Individual payment in bulk request
 */
export interface PaymentRequest {
  /** Unique identifier for the transaction (max 40 characters) */
  request_id: string;
  /** Source account UUID */
  account_id: string;
  /** Receiver details */
  receiver: {
    counterparty_id: string;
    account_id?: string;
    card_id?: string;
  };
  /** Payment amount */
  amount: number;
  /** ISO 4217 currency code */
  currency?: string;
  /** Payment reference */
  reference?: string;
  /** Fee bearer */
  charge_bearer?: 'shared' | 'debtor';
  /** Transfer reason code */
  transfer_reason_code?: string;
  /** Exchange reason code */
  exchange_reason_code?: string;
}

/**
 * Request to create multiple payments in bulk
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
  /** Array of payments to create */
  payments: PaymentRequest[];
  /** Processing options */
  processingOptions?: ProcessingOptions;
}

/**
 * Result of an individual payment in bulk operation
 */
export interface PaymentResult {
  /** Index of payment in request array */
  index: number;
  /** Whether payment succeeded */
  success: boolean;
  /** Revolut payment ID if successful */
  paymentId?: string;
  /** Error message if failed */
  error?: string;
  /** Original payment request */
  request: PaymentRequest;
}

/**
 * Response from bulk payment operation
 */
export interface Response {
  /** Whether overall operation succeeded */
  success: boolean;
  /** Total number of payments attempted */
  totalPayments: number;
  /** Number of successful payments */
  successfulPayments: number;
  /** Number of failed payments */
  failedPayments: number;
  /** Results for each payment */
  results: PaymentResult[];
}

/**
 * Melanie Create Payment API Types
 * Request/response types for createPayment Cloud Function
 */

/**
 * Request to create a Revolut payment
 */
export interface Request {
  /** Organization ID for the payment */
  organizationId: string;

  /** Unique identifier for the transaction (max 40 characters) - Required */
  request_id: string;

  /** Source account UUID from which to make the payment - Required */
  account_id: string;

  /** Receiver details - Required */
  receiver: {
    /** Recipient counterparty UUID - Required */
    counterparty_id: string;
    /** Specific recipient account ID - Optional, required if counterparty has multiple accounts */
    account_id?: string;
    /** Specific recipient card ID - Optional */
    card_id?: string;
  };

  /** Payment amount in major currency units (e.g., euros, dollars, pounds) - Required */
  amount: number;

  /** ISO 4217 currency code (e.g., 'EUR', 'USD', 'GBP') - Optional */
  currency?: string;

  /** Payment reference that appears on statements - Optional */
  reference?: string;

  /** Specifies who pays the transfer fees - Optional, defaults to 'debtor' */
  charge_bearer?: 'shared' | 'debtor';

  /** Reason code for the transfer - Optional */
  transfer_reason_code?: string;

  /** Reason code for currency exchange - Optional */
  exchange_reason_code?: string;
}

/**
 * Response from creating a Revolut payment
 */
export interface Response {
  /** Unique payment identifier from Revolut - Required */
  id: string;

  /** Current state of the payment - Required */
  state: 'created' | 'pending' | 'completed' | 'declined' | 'failed' | 'reverted';

  /** ISO 8601 timestamp when the payment was created - Required */
  created_at: string;

  /** ISO 8601 timestamp when the payment was completed - Optional */
  completed_at?: string;
}

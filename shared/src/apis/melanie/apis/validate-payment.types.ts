/**
 * Melanie Validate Payment API Types
 * Request/response types for validatePayment Cloud Function
 */

/**
 * Request to validate a payment before creation
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
  /** Account ID to use for payment */
  accountId: string;
  /** Recipient IBAN */
  iban: string;
  /** Recipient BIC (optional, required for non-German IBANs) */
  bic?: string;
  /** Recipient name */
  recipientName: string;
  /** Payment amount */
  amount: number;
  /** ISO 4217 currency code */
  currency: string;
  /** Payment reference */
  reference: string;
  /** Recipient email (optional) */
  recipientEmail?: string | null;
}

/**
 * Response from payment validation
 */
export interface Response {
  /** Whether payment is valid */
  valid: boolean;
  /** Validation errors */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
}

/**
 * Melanie Get Revolut Balance API Types
 * Request/response types for getBalance Cloud Function
 */

/**
 * Request to get Revolut account balance
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
}

/**
 * Response with Revolut balance
 */
export interface Response {
  /** Account balance amount */
  balance: number;
  /** Currency code (e.g., "EUR") */
  currency: string;
  /** Revolut account ID */
  accountId: string;
}

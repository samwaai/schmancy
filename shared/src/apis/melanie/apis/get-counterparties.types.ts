/**
 * Melanie Get Revolut Counterparties API Types
 * Request/response types for getCounterparties Cloud Function
 */

/**
 * Request to get Revolut counterparties
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
  /** Optional limit for number of counterparties to return (1-1000) */
  limit?: number;
  /** Optional sort code filter (requires account_no) */
  sort_code?: string;
  /** Optional account number filter (used with sort_code) */
  account_no?: string;
  /** Optional BIC filter (requires iban) */
  bic?: string;
  /** Optional IBAN filter (used with bic) */
  iban?: string;
}

/**
 * Response with Revolut counterparties
 * Passes through Revolut API response
 */
export type Response = any[]; // Array of Revolut counterparty objects

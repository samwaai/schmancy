/**
 * Melanie Create Revolut Counterparty API Types
 * Request/response types for createCounterparty Cloud Function
 */

/**
 * Request to create a Revolut counterparty
 * Matches Revolut API counterparty creation structure
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
  /** Company name */
  company_name: string;
  /** IBAN for the account */
  iban: string;
  /** Bank country code (ISO 3166-1 alpha-2) */
  bank_country: string;
  /** Currency code (ISO 4217) */
  currency: string;
  /** Optional BIC/SWIFT code */
  bic?: string;
  /** Optional email address */
  email?: string;
  /** Optional phone number */
  phone?: string;
}

/**
 * Response from creating counterparty
 * Passes through Revolut API response
 */
export type Response = any; // Revolut counterparty object

/**
 * Melanie Get Revolut Accounts API Types
 * Request/response types for getAccounts Cloud Function
 */

/**
 * Request to get Revolut accounts
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
}

/**
 * Response with Revolut accounts
 * Returns array of account objects from Revolut API
 */
export type Response = any[]; // Array of Revolut account objects

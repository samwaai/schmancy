/**
 * Melanie Check Revolut Status API Types
 * Request/response types for melanieCheckRevolutStatus Cloud Function
 */

/**
 * Request to check Revolut configuration status
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
}

/**
 * Response with Revolut configuration status
 */
export interface Response {
  /** Whether Revolut is configured */
  isConfigured: boolean;
  /** Whether valid tokens exist */
  hasToken: boolean;
  /** Whether setup is needed */
  needsSetup: boolean;
}

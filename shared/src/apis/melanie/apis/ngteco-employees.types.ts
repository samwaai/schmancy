/**
 * Melanie NGTECO Employees API Types
 * Request/response types for NGTECO employees operations
 */

/**
 * Request to get NGTECO employees
 */
export interface Request {
  /** Organization ID */
  orgId: string;
  /** Page number (default: "1") */
  page?: string;
  /** Page size (default: "50") */
  pageSize?: string;
  /** Search keyword (optional) */
  keyword?: string;
  /** Comma-separated department IDs to filter by (optional) */
  departments?: string;
}

/**
 * Response with NGTECO employees
 */
export interface Response {
  /** Whether operation succeeded */
  success: boolean;
  /** Employee data from NGTeco (structure varies) */
  data?: any;
  /** Error message if failed */
  error?: string;
  /** Additional error details */
  details?: string;
}

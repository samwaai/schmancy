/**
 * Melanie NGTECO Departments API Types
 * Request/response types for NGTECO departments operations
 *
 * NOTE: This file handles TWO different functions:
 * 1. melanieNgtecoDepartmentsList - Lists departments
 * 2. melanieNgtecoDepartmentsCreate - Creates a department
 *
 * Since they have different signatures, we use a generic Request
 * that includes all possible fields.
 */

/**
 * Request for NGTECO departments operations
 * Supports both list and create operations
 */
export interface Request {
  /** Organization ID (required for all operations) */
  orgId: string;

  // List operation fields
  /** Page number (default: "1") - used by melanieNgtecoDepartmentsList */
  current?: string;
  /** Page size (default: "20") - used by melanieNgtecoDepartmentsList */
  pageSize?: string;
  /** Search keyword (optional) - used by melanieNgtecoDepartmentsList */
  keyword?: string;

  // Create operation fields
  /** Department data to create - used by melanieNgtecoDepartmentsCreate */
  departmentData?: {
    /** Department code (must be numeric) */
    code: string;
    /** Department name */
    name: string;
  };
}

/**
 * Response from NGTECO departments operations
 * Returns the raw response from NGTeco API
 */
export type Response = any;

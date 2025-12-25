/**
 * Melanie Extract Employee Payslip API Types
 * Request/response types for employee payslip extraction
 */

/**
 * Request to extract employee payslip data
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
  /** Employee ID */
  employeeId: string;
  /** Payslip file URL or data */
  payslipData?: string;
  /** Optional month/year for payslip */
  period?: string;
}

/**
 * Response with extracted payslip data
 */
export interface Response {
  /** Whether extraction succeeded */
  success: boolean;
  /** Extracted payslip data */
  payslip?: any;
  /** Error message if failed */
  error?: string;
}

/**
 * Invoices Remove Invoice Description API Types
 * Request/response types for removeInvoiceDescription Cloud Function
 */

/**
 * Request to remove an invoice description from item's known matches
 */
export interface Request {
  /** Item ID to remove description from */
  itemId: string;
  /** Invoice description to remove */
  invoiceDescription: string;
}

/**
 * Response from removing invoice description
 */
export interface Response {
  /** Whether removal succeeded */
  success: boolean;
  /** Status message */
  message: string;
}

/**
 * Hannah Get Next Order Number API Types
 * Request/response types for hannahGetNextOrderNumber Cloud Function
 */

/**
 * Request to get the next order number for a business
 */
export interface Request {
  /** Organization ID */
  orgId: string;
  /** Business ID to get next order number for */
  businessId: string;
}

/**
 * Response with the next order number
 */
export interface Response {
  /** Whether the operation succeeded */
  success: boolean;
  /** The next order number */
  orderNumber: number;
  /** Error message if failed */
  error?: string;
}

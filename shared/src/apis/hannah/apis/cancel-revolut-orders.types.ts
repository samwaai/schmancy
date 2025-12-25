/**
 * Cancel Revolut Orders API Types
 * Request/response types for hannahCancelRevolutOrders Cloud Function
 */

/**
 * Request to cancel non-completed Revolut orders
 */
export interface Request {
  /** Organization ID */
  orgId: string;
  /** Specific order IDs to cancel. If empty, cancels all non-completed orders */
  orderIds?: string[];
}

/**
 * Response from cancelling Revolut orders
 */
export interface Response {
  /** Whether the operation completed successfully */
  success: boolean;
  /** Number of orders successfully cancelled */
  cancelled: number;
  /** Number of orders that failed to cancel */
  failed: number;
  /** List of errors encountered during cancellation */
  errors: string[];
}

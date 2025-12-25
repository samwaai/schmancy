/**
 * Get Revolut Order Details API Types
 * Request/response types for hannahGetRevolutOrderDetails Cloud Function
 */

import type { RevolutOrderFull } from './revolut-orders.types';

/**
 * Request to fetch a single order's full details from Revolut API
 */
export interface Request {
  /** Organization ID */
  orgId: string;
  /** Revolut Order ID */
  orderId: string;
}

/**
 * Response from fetching order details
 */
export interface Response {
  /** Whether the request succeeded */
  success: boolean;
  /** Full order details (if successful) */
  order?: RevolutOrderFull;
  /** Error message (if failed) */
  error?: string;
}

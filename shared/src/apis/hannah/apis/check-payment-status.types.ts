/**
 * Hannah Check Payment Status API Types
 * Request/response types for hannahCheckPaymentStatus Cloud Function
 */

import type { RevolutOrderState } from './revolut-orders.types';
import type { HannahOrderStatus } from '../../../types/hannah/order.types';

/**
 * Request to check payment status from Revolut API
 * Can lookup by either orderId (Firestore doc ID) or publicId (Revolut's public_id from _rp_oid redirect)
 */
export interface Request {
  /** Order ID to check payment status for (Firestore document ID) */
  orderId?: string;
  /** Revolut's public_id (from _rp_oid URL param after redirect) */
  publicId?: string;
}

/**
 * Response from checking payment status
 * Returns current payment status, order status, and whether Firestore was updated
 */
export interface Response {
  /** Whether the operation succeeded */
  success: boolean;
  /** Order ID (echoed back) */
  orderId: string;
  /** Current payment status - mirrors Revolut state directly */
  paymentStatus: RevolutOrderState;
  /** Current order status (kitchen workflow) - 'new', 'preparing', 'done', 'cancelled' */
  orderStatus: HannahOrderStatus;
  /** Whether Firestore was updated (status changed from pending) */
  updated: boolean;
}

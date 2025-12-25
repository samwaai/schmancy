/**
 * OWL Confirm Delivery API Types
 * Request/response types for confirmDelivery Cloud Function
 */

import { OrderItem } from "../../../types/owl/orders.types.js";

/**
 * Request to confirm delivery of an order
 */
export interface Request {
  /** Order ID to confirm delivery for */
  orderId: string;
  /** Updated order items with delivered quantities */
  updatedOrderItems: OrderItem[];
  /** Optional delivery date (ISO string), defaults to current date if not provided */
  deliveryDate?: string;
}

/**
 * Response from confirming delivery
 */
export interface Response {
  /** Whether delivery confirmation succeeded */
  success: boolean;
  /** Message describing the result */
  message?: string;
  /** Error message if failed */
  error?: string;
}

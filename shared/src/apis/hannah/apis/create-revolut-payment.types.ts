/**
 * Hannah Create Revolut Payment API Types
 * Request/response types for hannahCreateRevolutPayment Cloud Function
 */

/**
 * Request to create a Revolut payment for an order
 */
export interface Request {
  /** Order ID to create payment for */
  orderId: string;
  /** Idempotency key to prevent duplicate orders (UUID from cart session) */
  idempotencyKey?: string;
}

/**
 * Response from creating a Revolut payment
 * Returns payment details including checkout token
 */
export interface Response {
  /** Whether payment creation succeeded */
  success: boolean;
  /** Order ID (echoed back) */
  orderId?: string;
  /** Payment details if successful */
  payment?: {
    /** Revolut order ID */
    id: string;
    /** Checkout token for Card Field widget */
    token: string;
  };
  /** Error message if failed */
  error?: string;
}

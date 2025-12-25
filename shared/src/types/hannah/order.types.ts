/**
 * Hannah Order Types
 * Order management and payment processing types
 */

import type { HannahTableServiceType } from './table.types';
import type { RevolutOrderState } from '../../apis/hannah/apis/revolut-orders.types';

// ISO 4217 currency codes (uppercase) - used by Revolut Merchant API
// Expand as needed for additional markets
export type HannahCurrency = 'EUR' | 'USD' | 'GBP' | 'CHF' | 'SEK' | 'NOK' | 'DKK';

// Consumption type affects tax rate calculation
export type HannahConsumptionType = 'dine-in' | 'takeaway';

// Invoice type (personal or company)
export type HannahInvoiceType = 'personal' | 'company';

// Invoice info stored on order after customer requests invoice
export interface HannahInvoiceInfo {
  type: HannahInvoiceType;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
  taxId?: string;           // Company only (USt-IdNr)
  generatedAt: string;      // ISO string - When invoice was generated
  pdfUrl?: string;          // Signed URL for PDF download
  storagePath?: string;     // Firebase Storage path for cleanup
}

export type HannahOrderStatus =
  | 'new'          // Order received, awaiting chef acceptance
  | 'preparing'    // Chef is cooking
  | 'done'         // Ready and served
  | 'cancelled';   // Order cancelled

/**
 * Our internal payment status (stable, used by frontend)
 * Maps Revolut 'completed' → 'succeeded' for backwards compatibility
 */
export type HannahPaymentStatus =
  | 'pending'     // Payment initiated, awaiting completion
  | 'succeeded'   // Payment completed successfully (maps from Revolut 'completed')
  | 'failed'      // Payment failed
  | 'cancelled'   // Payment cancelled
  | 'refunded';   // Payment fully refunded

/**
 * Check if payment succeeded (accepts both our internal 'succeeded' and Revolut's 'completed')
 * Use this for reading to handle both values during transition
 */
export function isPaymentSucceeded(status: HannahPaymentStatus | string | undefined | null): boolean {
  return status === 'succeeded' || status === 'completed';
}

/**
 * Check if order payment succeeded (checks both paymentStatus and revolutPaymentState)
 * Preferred method - handles all cases
 */
export function isOrderPaymentSucceeded(order: Pick<HannahOrder, 'paymentStatus' | 'revolutPaymentState'>): boolean {
  return order.paymentStatus === 'succeeded' || order.revolutPaymentState === 'completed';
}

export interface HannahOrder {
  id: string;
  uid?: string;  // Anonymous auth UID of customer who created the order
  orgId: string;
  businessId: string;
  tableId: string;
  orderNumber: number;  // Sequential order number unique per business

  items: HannahOrderItem[];
  subtotal: number;  // All amounts in cents (integer) - e.g., 2379 = €23.79
  tax: number;       // All amounts in cents (integer)
  tip: number;       // All amounts in cents (integer)
  total: number;     // All amounts in cents (integer)
  currency: HannahCurrency;         // ISO 4217 currency code

  // Consumption type (affects tax calculation)
  consumptionType: HannahConsumptionType;  // Default for all items, can be overridden per item

  // Order status (kitchen workflow) - independent of payment
  status: HannahOrderStatus;
  statusHistory: HannahOrderStatusUpdate[];

  // Payment status - separate from order workflow
  paymentStatus: HannahPaymentStatus;
  revolutPaymentState?: RevolutOrderState;  // Mirrors Revolut exactly (for admin/debugging)
  payment?: HannahPaymentDetails;   // Optional: exists only after payment succeeds

  notes?: string;
  customerEmail?: string;     // Optional: customer email for receipts and tracking
  serviceType?: HannahTableServiceType;  // Snapshot from table at order time
  createdAt: string;          // ISO string - When order was created (before payment)
  paidAt?: string;            // ISO string - When payment was confirmed
  expiresAt?: string;         // ISO string - For pending payments: createdAt + 30 minutes (Firestore TTL)

  // Kitchen printing
  printed?: boolean;          // True if kitchen ticket was auto-printed (prevents duplicate auto-prints)

  // Customer pickup confirmation (self-service only)
  pickupConfirmedAt?: string; // ISO string - When customer confirmed pickup

  // Invoice (generated on customer request)
  invoice?: HannahInvoiceInfo;

  // Idempotency key to prevent duplicate orders (UUID from cart session)
  idempotencyKey?: string;
}

// Currently Revolut only, extensible to Stripe via discriminated union
export type HannahPaymentDetails = HannahRevolutPaymentDetails;  // | HannahStripePaymentDetails (future)

export interface HannahRevolutPaymentDetails {
  provider: 'revolut';
  id: string;                 // Revolut order ID (from API response)
  publicId?: string;          // Public ID (from API response) - optional, not always returned
  token: string;              // Checkout token (from API response)
  checkoutUrl?: string;       // Constructed: https://checkout.revolut.com/pay/{token} - optional
  failureReason?: string;     // Only if payment failed

  // Enhanced payment method details (fetched from Revolut API after payment completion)
  paymentMethod?: {
    type: 'card' | 'apple_pay' | 'google_pay' | 'revolut_pay';
    card?: {
      brand: string;           // 'VISA', 'MASTERCARD', 'AMEX', etc.
      lastFour: string;        // Last 4 digits
      cardholderName?: string; // Cardholder name if available
    };
  };
  revolutCreatedAt?: string;   // Revolut's creation timestamp (ISO string)
  revolutCompletedAt?: string; // Revolut's completion timestamp (ISO string)

  // Refund tracking
  refundedAmount?: number;     // Amount refunded in cents (if any)
  refundedAt?: string;         // ISO string - When refund was processed

  // Note: amount/currency stored in order.total/order.currency
  // Note: completion time stored in order.paidAt
}

export interface HannahOrderStatusUpdate {
  status: HannahOrderStatus;
  timestamp: string;          // ISO string
  // Note: updatedBy removed - tracking WHO is overkill for v1
}

export interface HannahOrderItem {
  menuItemId: string;
  name: string;
  price: number;     // In cents (integer) - e.g., 1999 = €19.99 - Snapshot at order time
  quantity: number;

  // Tax rates (snapshot from MenuItem at order time)
  taxRateDineIn: number;      // e.g., 0.19 (19%)
  taxRateTakeaway: number;    // e.g., 0.07 (7%)

  // Optional override for this specific item (if different from order.consumptionType)
  consumptionType?: HannahConsumptionType;  // If omitted, uses order.consumptionType

  notes?: string;

  // Extras linking - unique ID for each line item, extras reference parent via belongsToLineItemId
  lineItemId?: string;           // Unique ID per item instance (preserved from cart)
  belongsToLineItemId?: string;  // If set, this is an extra belonging to another line item
}

// Payment Configuration Types
// Stored in Business document (default DB) under `paymentConfig` field
export type HannahPaymentConfig = HannahRevolutPaymentConfig;  // | HannahStripePaymentConfig (future)

export interface HannahRevolutPaymentConfig {
  provider: 'revolut';
  merchantApiKey: string;     // Stored encrypted in Firebase - for creating orders
  publicKey: string;          // Merchant public key for RevolutCheckout.payments() API
  webhookSecret: string;      // REQUIRED - Revolut ALWAYS returns signing_secret in webhook creation response
  currency: HannahCurrency;   // ISO 4217 currency code
  sandboxMode: boolean;
  webhookUrl?: string;        // Full webhook URL for Revolut payment notifications
  applePayDomains?: string[]; // Domains registered for Apple Pay
}

// Future Stripe support
// export interface HannahStripePaymentConfig {
//   provider: 'stripe';
//   secretKey: string;
//   publicKey: string;
//   webhookSecret: string;
//   currency: string;
//   sandboxMode: boolean;
// }

/**
 * Get Next Order Number Types
 * Used for generating sequential order numbers per business
 */

/**
 * Request to get next order number
 */
export interface GetNextOrderNumberRequest {
	/** Organization ID */
	orgId: string;
	/** Business ID */
	businessId: string;
}

/**
 * Response from getting next order number
 */
export interface GetNextOrderNumberResponse {
	/** Sequential order number */
	orderNumber: number;
}

/**
 * Generate Invoice PDF Types
 */

/**
 * Request to generate invoice PDF
 */
export interface GenerateInvoicePDFRequest {
	/** Organization ID */
	orgId: string;
	/** Business ID */
	businessId: string;
	/** Order ID */
	orderId: string;
	/** Invoice recipient info */
	invoiceInfo: Omit<HannahInvoiceInfo, 'generatedAt' | 'pdfUrl' | 'storagePath'>;
}

/**
 * Response from generating invoice PDF
 */
export interface GenerateInvoicePDFResponse {
	/** Signed URL for PDF download */
	pdfUrl: string;
	/** Storage path for the PDF */
	storagePath: string;
}

/**
 * Revolut Merchant API - Shared Types & Constants
 *
 * OFFICIAL DOCUMENTATION:
 * - API Overview: https://developer.revolut.com/docs/merchant/merchant-api-overview
 * - Create Order: https://developer.revolut.com/docs/merchant/create-order
 * - Update Order: https://developer.revolut.com/docs/merchant/update-order
 * - Retrieve Order: https://developer.revolut.com/docs/merchant/retrieve-order
 * - List Orders: https://developer.revolut.com/docs/merchant/retrieve-orders-list
 * - Cancel Order: https://developer.revolut.com/docs/merchant/cancel-order
 * - Webhooks: https://developer.revolut.com/docs/merchant/webhooks
 * - Versioning: https://developer.revolut.com/docs/merchant/versioning
 */

// ============================================================================
// API CONFIGURATION CONSTANTS
// ============================================================================

/**
 * Current Revolut Merchant API version
 * @see https://developer.revolut.com/docs/merchant/versioning
 */
export const REVOLUT_API_VERSION = '2025-10-16' as const;

/**
 * Revolut API base URLs
 * @see https://developer.revolut.com/docs/merchant/merchant-api-overview
 *
 * NOTE: The correct endpoint is /api/orders (NOT /api/1.0/orders)
 * Confirmed by Revolut support on 2025-12-02
 */
export const REVOLUT_API_URLS = {
  /** Production API base URL */
  PRODUCTION: 'https://merchant.revolut.com/api',
  /** Sandbox API base URL for testing */
  SANDBOX: 'https://sandbox-merchant.revolut.com/api',
} as const;

/**
 * Get the appropriate API base URL based on sandbox mode
 * @param sandboxMode Whether to use sandbox environment
 * @returns The appropriate API base URL
 */
export function getRevolutApiBaseUrl(sandboxMode: boolean): string {
  return sandboxMode ? REVOLUT_API_URLS.SANDBOX : REVOLUT_API_URLS.PRODUCTION;
}

/**
 * Get the orders endpoint URL
 * @param sandboxMode Whether to use sandbox environment
 * @returns The orders API endpoint URL
 */
export function getRevolutOrdersUrl(sandboxMode: boolean): string {
  return `${getRevolutApiBaseUrl(sandboxMode)}/orders`;
}

/**
 * Get the webhooks endpoint URL
 * @param sandboxMode Whether to use sandbox environment
 * @returns The webhooks API endpoint URL
 */
export function getRevolutWebhooksUrl(sandboxMode: boolean): string {
  return `${getRevolutApiBaseUrl(sandboxMode)}/1.0/webhooks`;
}

/**
 * Apple Pay domain registration URL (production only)
 * @see https://developer.revolut.com/docs/guides/accept-payments/payment-methods/apple-pay-google-pay/web
 */
export const REVOLUT_APPLE_PAY_DOMAIN_URL = 'https://merchant.revolut.com/api/apple-pay/domains/register' as const;

// ============================================================================
// ORDER STATES
// ============================================================================

/**
 * Revolut order states (lowercase as returned by API)
 * @see https://developer.revolut.com/docs/merchant/retrieve-order
 *
 * State transitions:
 * - pending → processing → authorised → completed
 * - pending → processing → failed
 * - pending → cancelled (manual cancellation)
 * - authorised → completed (after capture for manual capture mode)
 * - authorised → cancelled (manual cancellation before capture)
 */
export const REVOLUT_ORDER_STATES = {
  /** Order created, awaiting payment */
  PENDING: 'pending',
  /** Payment is being processed */
  PROCESSING: 'processing',
  /** Payment authorized (for manual capture mode) */
  AUTHORISED: 'authorised',
  /** Payment completed successfully */
  COMPLETED: 'completed',
  /** Order was cancelled */
  CANCELLED: 'cancelled',
  /** Payment failed */
  FAILED: 'failed',
} as const;

/**
 * Type for Revolut order state values
 */
export type RevolutOrderState = typeof REVOLUT_ORDER_STATES[keyof typeof REVOLUT_ORDER_STATES];

/**
 * All possible order state values as an array
 * Useful for validation and iteration
 */
export const REVOLUT_ORDER_STATE_VALUES: RevolutOrderState[] = Object.values(REVOLUT_ORDER_STATES);

/**
 * States that indicate the order can still be modified (amount, line_items, etc.)
 * @see https://developer.revolut.com/docs/merchant/update-order
 */
export const REVOLUT_UPDATABLE_STATES: RevolutOrderState[] = [
  REVOLUT_ORDER_STATES.PENDING,
];

/**
 * States that indicate the order can be cancelled
 * @see https://developer.revolut.com/docs/merchant/cancel-order
 */
export const REVOLUT_CANCELLABLE_STATES: RevolutOrderState[] = [
  REVOLUT_ORDER_STATES.PENDING,
  REVOLUT_ORDER_STATES.PROCESSING,
  REVOLUT_ORDER_STATES.AUTHORISED,
];

/**
 * States that are NOT final (order is still in progress)
 */
export const REVOLUT_NON_COMPLETED_STATES: RevolutOrderState[] = [
  REVOLUT_ORDER_STATES.PENDING,
  REVOLUT_ORDER_STATES.PROCESSING,
  REVOLUT_ORDER_STATES.AUTHORISED,
];

/**
 * States that are final (order processing is complete)
 */
export const REVOLUT_FINAL_STATES: RevolutOrderState[] = [
  REVOLUT_ORDER_STATES.COMPLETED,
  REVOLUT_ORDER_STATES.CANCELLED,
  REVOLUT_ORDER_STATES.FAILED,
];

/**
 * Check if a state indicates the order is updatable
 * @param state The order state to check
 * @returns True if the order can be updated
 */
export function isRevolutOrderUpdatable(state: RevolutOrderState): boolean {
  return REVOLUT_UPDATABLE_STATES.includes(state);
}

/**
 * Check if a state indicates the order can be cancelled
 * @param state The order state to check
 * @returns True if the order can be cancelled
 */
export function isRevolutOrderCancellable(state: RevolutOrderState): boolean {
  return REVOLUT_CANCELLABLE_STATES.includes(state);
}

/**
 * Check if a state is a final state (no more changes possible)
 * @param state The order state to check
 * @returns True if the order is in a final state
 */
export function isRevolutOrderFinal(state: RevolutOrderState): boolean {
  return REVOLUT_FINAL_STATES.includes(state);
}

// ============================================================================
// WEBHOOK EVENTS
// ============================================================================

/**
 * Revolut webhook event types
 * @see https://developer.revolut.com/docs/merchant/webhooks
 */
export const REVOLUT_WEBHOOK_EVENTS = {
  /** Order payment completed successfully */
  ORDER_COMPLETED: 'ORDER_COMPLETED',
  /** Order payment authorized (manual capture mode) */
  ORDER_AUTHORISED: 'ORDER_AUTHORISED',
  /** Payment was declined by card issuer */
  ORDER_PAYMENT_DECLINED: 'ORDER_PAYMENT_DECLINED',
  /** Payment failed for other reasons */
  ORDER_PAYMENT_FAILED: 'ORDER_PAYMENT_FAILED',
} as const;

/**
 * Type for Revolut webhook event values
 */
export type RevolutWebhookEvent = typeof REVOLUT_WEBHOOK_EVENTS[keyof typeof REVOLUT_WEBHOOK_EVENTS];

/**
 * Webhook events that indicate successful payment
 */
export const REVOLUT_SUCCESS_WEBHOOK_EVENTS: RevolutWebhookEvent[] = [
  REVOLUT_WEBHOOK_EVENTS.ORDER_COMPLETED,
];

/**
 * Webhook events that indicate failed payment
 */
export const REVOLUT_FAILURE_WEBHOOK_EVENTS: RevolutWebhookEvent[] = [
  REVOLUT_WEBHOOK_EVENTS.ORDER_PAYMENT_DECLINED,
  REVOLUT_WEBHOOK_EVENTS.ORDER_PAYMENT_FAILED,
];

/**
 * Default webhook events to subscribe to
 * @see https://developer.revolut.com/docs/merchant/webhooks
 */
export const REVOLUT_DEFAULT_WEBHOOK_EVENTS: RevolutWebhookEvent[] = [
  REVOLUT_WEBHOOK_EVENTS.ORDER_COMPLETED,
  REVOLUT_WEBHOOK_EVENTS.ORDER_PAYMENT_DECLINED,
  REVOLUT_WEBHOOK_EVENTS.ORDER_PAYMENT_FAILED,
];

// ============================================================================
// LINE ITEM TYPES
// ============================================================================

/**
 * Line item types
 * @see https://developer.revolut.com/docs/merchant/create-order#line_items
 */
export const REVOLUT_LINE_ITEM_TYPES = {
  /** Physical product that will be shipped */
  PHYSICAL: 'physical',
  /** Service or digital product */
  SERVICE: 'service',
} as const;

/**
 * Type for line item type values
 */
export type RevolutLineItemType = typeof REVOLUT_LINE_ITEM_TYPES[keyof typeof REVOLUT_LINE_ITEM_TYPES];

// ============================================================================
// CAPTURE MODES
// ============================================================================

/**
 * Payment capture modes
 * @see https://developer.revolut.com/docs/merchant/create-order
 */
export const REVOLUT_CAPTURE_MODES = {
  /** Capture payment automatically when authorized */
  AUTOMATIC: 'automatic',
  /** Require manual capture after authorization */
  MANUAL: 'manual',
} as const;

/**
 * Type for capture mode values
 */
export type RevolutCaptureMode = typeof REVOLUT_CAPTURE_MODES[keyof typeof REVOLUT_CAPTURE_MODES];

// ============================================================================
// ORDER TYPES
// ============================================================================

/**
 * Order types
 * @see https://developer.revolut.com/docs/merchant/retrieve-order
 */
export const REVOLUT_ORDER_TYPES = {
  /** Standard payment order (lowercase per Revolut API response) */
  PAYMENT: 'payment',
} as const;

/**
 * Type for order type values
 */
export type RevolutOrderType = typeof REVOLUT_ORDER_TYPES[keyof typeof REVOLUT_ORDER_TYPES];

// ============================================================================
// PAYMENT METHOD TYPES
// ============================================================================

/**
 * Payment method types
 * @see https://developer.revolut.com/docs/merchant/retrieve-order
 */
export const REVOLUT_PAYMENT_METHOD_TYPES = {
  /** Card payment */
  CARD: 'card',
  /** Apple Pay */
  APPLE_PAY: 'apple_pay',
  /** Google Pay */
  GOOGLE_PAY: 'google_pay',
  /** Revolut Pay */
  REVOLUT_PAY: 'revolut_pay',
} as const;

/**
 * Type for payment method type values
 */
export type RevolutPaymentMethodType = typeof REVOLUT_PAYMENT_METHOD_TYPES[keyof typeof REVOLUT_PAYMENT_METHOD_TYPES];

// ============================================================================
// API REQUEST/RESPONSE INTERFACES
// ============================================================================

/**
 * Amount object used throughout the API
 * @see https://developer.revolut.com/docs/merchant/create-order
 */
export interface RevolutAmount {
  /** Amount in minor units (cents) - e.g., 1999 = €19.99 */
  value: number;
  /** ISO 4217 currency code (e.g., 'EUR', 'USD', 'GBP') */
  currency: string;
}

/**
 * Tax details for line items
 * @see https://developer.revolut.com/docs/merchant/create-order#line_items
 */
export interface RevolutTax {
  /** Tax name (e.g., 'VAT 19%') */
  name: string;
  /** Tax amount in minor units (cents) */
  amount: number;
}

/**
 * Discount details for line items
 * @see https://developer.revolut.com/docs/merchant/create-order#line_items
 */
export interface RevolutDiscount {
  /** Discount name */
  name: string;
  /** Discount amount in minor units (cents) */
  amount: number;
}

/**
 * Revolut line item (for order requests and responses)
 * @see https://developer.revolut.com/docs/merchant/create-order#line_items
 */
export interface RevolutLineItem {
  /** Product name (max 250 chars) */
  name: string;
  /** Item type: physical or service */
  type: RevolutLineItemType;
  /** Quantity details */
  quantity: {
    /** Number of items */
    value: number;
    /** Unit type (e.g., 'pcs', 'kg') */
    unit?: string;
  };
  /** Price per unit in minor units (cents) */
  unit_price_amount: number;
  /** Total amount (quantity * unit_price) in minor units */
  total_amount: number;
  /** External ID for reconciliation (e.g., our menuItemId) */
  external_id?: string;
  /** Item description */
  description?: string;
  /** Product URL */
  url?: string;
  /** Image URLs */
  image_urls?: string[];
  /** Tax details */
  taxes?: RevolutTax[];
  /** Discount details */
  discounts?: RevolutDiscount[];
}

/**
 * Customer object for order requests
 * @see https://developer.revolut.com/docs/merchant/create-order#customer
 */
export interface RevolutCustomerRequest {
  /** Your customer ID (e.g., Firebase UID) */
  id?: string;
  /** Customer email for receipts */
  email?: string;
}

/**
 * Customer object in order responses
 * @see https://developer.revolut.com/docs/merchant/retrieve-order
 */
export interface RevolutCustomerResponse {
  /** Revolut customer ID */
  id?: string;
  /** Customer full name */
  full_name?: string;
  /** Customer phone number */
  phone?: string;
  /** Customer email */
  email?: string;
}

/**
 * Merchant order data for external reference
 * @see https://developer.revolut.com/docs/merchant/create-order
 *
 * IMPORTANT: Naming differs between request, response, and webhooks:
 * - REQUEST (Create/Update Order): Send as `merchant_order_data.reference`
 * - RESPONSE (Get Order): Returned as `merchant_order_data.reference` (object echoed back)
 * - WEBHOOK: Returned as `merchant_order_ext_ref` (flat string, NOT object)
 */
export interface RevolutMerchantOrderData {
  /** Your order reference */
  reference?: string;
  /** Order URL for confirmation emails */
  url?: string;
}

/**
 * Payment method details in order response
 * NOTE: Card fields are FLAT on payment_method, NOT nested under a 'card' object!
 * @see https://developer.revolut.com/docs/merchant/retrieve-order#payments
 */
export interface RevolutPaymentMethod {
  /** Payment method ID */
  id?: string;
  /** Payment method type: card, apple_pay, google_pay, revolut_pay_card, revolut_pay_account */
  type: RevolutPaymentMethodType | string;
  /** Card brand (visa, mastercard, american_express) - FLAT, not nested! */
  card_brand?: string;
  /** Last 4 digits of card number - FLAT, not nested! */
  card_last_four?: string;
  /** Cardholder name - FLAT, not nested! */
  cardholder_name?: string;
  /** Card BIN (first 6-8 digits) */
  card_bin?: string;
  /** Card expiry (MM/YY format) */
  card_expiry?: string;
  /** Card country code (ISO 3166-1 alpha-2) */
  card_country_code?: string;
  /** Funding type: credit, debit, prepaid */
  funding?: string;
  /** Security checks performed */
  checks?: {
    three_ds?: {
      eci?: string;
      version?: string;
      authentication_status?: string;
    };
    cvv_verification?: string;
    address_verification?: string;
    postcode_verification?: string;
    cardholder_verification?: string;
  };
}

/**
 * Payment attempt details
 * @see https://developer.revolut.com/docs/merchant/retrieve-order
 */
export interface RevolutPayment {
  /** Payment ID */
  id: string;
  /** Payment state */
  state: string;
  /** Payment amount */
  amount: RevolutAmount;
  /** Payment method details */
  payment_method?: RevolutPaymentMethod;
  /** When the payment was created (ISO 8601) */
  created_at: string;
  /** When the payment was last updated (ISO 8601) */
  updated_at: string;
}

/**
 * Create order request body
 * @see https://developer.revolut.com/docs/merchant/create-order
 */
export interface RevolutCreateOrderRequest {
  /** Total amount in minor units (cents) - REQUIRED */
  amount: number;
  /** ISO 4217 currency code - REQUIRED */
  currency: string;
  /** Order description */
  description?: string;
  /** Settlement currency (defaults to currency if not specified) */
  settlement_currency?: string;
  /** Customer information */
  customer?: RevolutCustomerRequest;
  /** Line items for detailed breakdown */
  line_items?: RevolutLineItem[];
  /** Custom metadata (max 50 items, 500 char values) */
  metadata?: Record<string, string>;
  /** External order reference */
  merchant_order_data?: RevolutMerchantOrderData;
  /** Capture mode (default: automatic) */
  capture_mode?: RevolutCaptureMode;
}

/**
 * Update order request body
 * @see https://developer.revolut.com/docs/merchant/update-order
 */
export interface RevolutUpdateOrderRequest {
  /** Total amount in minor units (cents) */
  amount?: number;
  /** ISO 4217 currency code */
  currency?: string;
  /** Order description */
  description?: string;
  /** Customer information */
  customer?: RevolutCustomerRequest;
  /** Line items for detailed breakdown */
  line_items?: RevolutLineItem[];
  /** Custom metadata */
  metadata?: Record<string, string>;
  /** External order reference */
  merchant_order_data?: RevolutMerchantOrderData;
}

/**
 * Revolut order - unified interface for all endpoints
 * @see https://developer.revolut.com/docs/merchant/retrieve-order
 */
export interface RevolutOrder {
  id: string;
  token?: string;
  type: string;
  state: RevolutOrderState;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  description?: string;
  capture_mode: string;
  merchant_order_ext_ref?: string;
  merchant_order_data?: RevolutMerchantOrderData;
  customer_id?: string;
  email?: string;
  phone?: string;
  amount: number;
  outstanding_amount: number;
  currency: string;
  settlement_currency?: string;
  enforce_challenge?: string;
  metadata?: Record<string, string>;
  payments?: RevolutPayment[];
  public_id?: string;
  refunded_amount?: number;
  customer?: RevolutCustomerResponse;
  line_items?: RevolutLineItem[];
  checkout_url?: string;
}

/** @deprecated Use RevolutOrder */
export type RevolutOrderSummary = RevolutOrder;
/** @deprecated Use RevolutOrder */
export type RevolutOrderFull = RevolutOrder;
/** @deprecated Use RevolutOrder */
export type RevolutCreateOrderResponse = RevolutOrder;

/** @deprecated Use RevolutOrder */
export type RevolutUpdateOrderResponse = RevolutOrder;

// ============================================================================
// WEBHOOK INTERFACES
// ============================================================================

/**
 * Webhook payload structure
 * @see https://developer.revolut.com/docs/merchant/webhooks
 */
export interface RevolutWebhookPayload {
  /** Webhook event type */
  event: RevolutWebhookEvent;
  /** Revolut order ID */
  order_id: string;
  /** Our merchant reference (businessId_orderNumber) set in merchant_order_data.reference */
  merchant_order_ext_ref?: string;
  /** Timestamp (Unix epoch in milliseconds) */
  timestamp?: number;
}

// ============================================================================
// HTTP HEADERS HELPER
// ============================================================================

/**
 * Get standard Revolut API headers
 * @param apiKey The merchant API key
 * @returns Headers object for axios requests
 */
export function getRevolutApiHeaders(apiKey: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Revolut-Api-Version': REVOLUT_API_VERSION,
  };
}

/**
 * Get Revolut API headers without Content-Type (for GET/DELETE requests)
 * @param apiKey The merchant API key
 * @returns Headers object for axios requests
 */
export function getRevolutApiHeadersNoBody(apiKey: string): Record<string, string> {
  return {
    'Authorization': `Bearer ${apiKey}`,
    'Revolut-Api-Version': REVOLUT_API_VERSION,
  };
}

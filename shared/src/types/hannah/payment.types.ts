/**
 * Hannah Payment API Types
 * Request/response types for payment-related Cloud Functions
 *
 * NOTE: New module-based namespaced types are available at src/apis/hannah/apis/
 * These legacy exports are kept for backward compatibility
 */

import { HannahCurrency } from './order.types';

/**
 * Hannah Create Payment Request
 * @deprecated Use hannah.apis.CreateRevolutPayment.Request from src/apis/hannah/apis/
 */
export interface HannahCreatePaymentRequest {
  /** Order ID to create payment for */
  orderId: string;
}

/**
 * Hannah Create Payment Response
 * @deprecated Use hannah.apis.CreateRevolutPayment.Response from src/apis/hannah/apis/
 */
export interface HannahCreatePaymentResponse {
  /** Whether payment creation succeeded */
  success: boolean;
  /** Order ID (echoed back) */
  orderId?: string;
  /** Payment details if successful */
  payment?: {
    /** Revolut order ID */
    id: string;
    /** Public ID for reference */
    publicId: string;
    /** Checkout token for Card Field widget */
    token: string;
  };
  /** Error message if failed */
  error?: string;
}

/**
 * Save Hannah Payment Configuration Request
 * @deprecated Use hannah.apis.SavePaymentConfig.Request from src/apis/hannah/apis/
 */
export interface SaveHannahPaymentConfigRequest {
  /** Organization ID */
  orgId: string;
  /** Revolut merchant API key (starts with sk_) */
  merchantApiKey: string;
  /** Revolut public key (starts with pk_) */
  publicKey: string;
  /** ISO 4217 currency code */
  currency: HannahCurrency;
  /** Whether to use Revolut sandbox mode */
  sandboxMode: boolean;
}

/**
 * Save Hannah Payment Configuration Response
 * @deprecated Use hannah.apis.SavePaymentConfig.Response from src/apis/hannah/apis/
 */
export interface SaveHannahPaymentConfigResponse {
  /** Whether configuration was saved successfully */
  success: boolean;
  /** Error message if failed */
  error?: string;
}

/**
 * Hannah Revolut Health Check Request
 * @deprecated Use hannah.apis.RevolutHealthCheck.Request from src/apis/hannah/apis/
 */
export interface HannahRevolutHealthCheckRequest {
  /** Organization ID */
  orgId: string;
}

/**
 * Health check item result
 */
export interface HealthCheckItem {
  /** Check name */
  check: string;
  /** Whether check passed */
  success: boolean;
  /** Error message if failed */
  message?: string;
}

/**
 * Hannah Revolut Health Check Response
 * @deprecated Use hannah.apis.RevolutHealthCheck.Response from src/apis/hannah/apis/
 */
export interface HannahRevolutHealthCheckResponse {
  /** Whether overall health check passed */
  success: boolean;
  /** Individual check results */
  checks: HealthCheckItem[];
  /** Error message if failed */
  error?: string;
}

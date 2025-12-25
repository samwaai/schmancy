/**
 * Hannah Save Payment Configuration API Types
 * Request/response types for hannahSavePaymentConfig Cloud Function
 */

import { HannahCurrency } from '../../../types/hannah/order.types';

/**
 * Request to save Revolut payment configuration for an organization
 */
export interface Request {
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
  /** Full webhook URL for Revolut payment notifications */
  webhookUrl?: string;
  /** Domain to register for Apple Pay (e.g., "samwa.ai") */
  applePayDomain?: string;
}

/**
 * Response from saving payment configuration
 */
export interface Response {
  /** Whether configuration was saved successfully */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Apple Pay domain registration result (if domain was provided) */
  applePayDomainRegistered?: boolean;
  /** Apple Pay domain registration error (if failed) */
  applePayDomainError?: string;
}

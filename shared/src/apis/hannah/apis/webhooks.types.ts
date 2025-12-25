/**
 * Hannah Webhook Management API Types
 * Request/response types for webhook list and delete operations
 *
 * @see https://developer.revolut.com/docs/merchant/webhooks
 * @see https://developer.revolut.com/docs/merchant/retrieve-all-webhooks
 * @see https://developer.revolut.com/docs/merchant/delete-webhook
 */

/**
 * Revolut webhook object structure
 */
export interface Webhook {
  /** Webhook unique identifier (UUID) */
  id: string;
  /** HTTPS/HTTP endpoint URL for POST notifications (max 2000 chars) */
  url: string;
  /** Array of subscribed event types */
  events: string[];
}

/**
 * Request to get all webhooks for an organization
 */
export interface GetWebhooksRequest {
  /** Organization ID */
  orgId: string;
}

/**
 * Response from getting webhooks
 */
export interface GetWebhooksResponse {
  /** Whether the request was successful */
  success: boolean;
  /** List of registered webhooks (if successful) */
  webhooks?: Webhook[];
  /** Error message (if failed) */
  error?: string;
}

/**
 * Request to delete a webhook
 */
export interface DeleteWebhookRequest {
  /** Organization ID */
  orgId: string;
  /** Webhook ID to delete (UUID) */
  webhookId: string;
}

/**
 * Response from deleting a webhook
 */
export interface DeleteWebhookResponse {
  /** Whether the deletion was successful */
  success: boolean;
  /** Error message (if failed) */
  error?: string;
}

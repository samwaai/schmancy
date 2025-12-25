/**
 * Hannah Revolut Health Check API Types
 * Request/response types for hannahRevolutHealthCheck Cloud Function
 */

/**
 * Request to validate Revolut API credentials
 */
export interface Request {
  /** Organization ID */
  orgId: string;
}

/**
 * Individual health check item result
 */
export interface HealthCheckItem {
  /** Check name */
  name: string;
  /** Whether check passed */
  passed: boolean;
  /** Result message */
  message: string;
  /** Additional check data */
  data?: Record<string, any>;
}

/**
 * Response from Revolut health check
 */
export interface Response {
  /** Whether the overall check succeeded */
  success: boolean;
  /** Whether the integration is healthy */
  healthy?: boolean;
  /** Individual check results */
  checks?: {
    webhookRegistered: HealthCheckItem;
    webhookReachable: HealthCheckItem;
    signatureValidation: HealthCheckItem;
  };
  /** Summary message */
  summary?: string;
  /** Error message if failed */
  error?: string;
}

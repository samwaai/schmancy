/**
 * Melanie Get Product Groups API Types
 * Request/response types for melanieGetProductGroups Cloud Function
 */

/**
 * Request to get product groups from Speedy POS
 */
export interface Request {
  /** Organization ID */
  organizationId: string;
}

/**
 * Response with product groups
 */
export interface Response {
  /** Whether fetch succeeded */
  success: boolean;
  /** Array of unique product group names */
  productGroups: string[];
}

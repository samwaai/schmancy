/**
 * OWL Create Item API Types
 * Request/response types for createItem Cloud Function
 */

/**
 * Request to create an item from raw text
 */
export interface Request {
  /** Raw text description of the item (e.g., from invoice) */
  rawText: string;
  /** Supplier ID for the item */
  supplierId: string;
}

/**
 * Response from creating an item
 */
export interface Response {
  /** Whether item creation succeeded */
  success: boolean;
  /** Created or found item ID */
  itemId?: string;
  /** Item name */
  itemName?: string;
  /** Whether this was a duplicate item that already existed */
  isDuplicate?: boolean;
  /** Error message if failed */
  error?: string;
}

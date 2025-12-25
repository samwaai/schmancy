/**
 * Invoices Suggest Item From Invoice API Types
 * Request/response types for suggestItemFromInvoice Cloud Function
 */

import type { Item } from '../../../types/owl/items.types.js';

/**
 * Request to suggest an item from invoice line description
 */
export interface Request {
  /** Invoice line item description */
  itemDescription: string;
  /** Supplier ID for the item */
  supplierID?: string;
  /** Unit price from invoice */
  unitPrice?: number;
  /** Quantity from invoice */
  quantity?: number;
}

/**
 * Response with suggested item structure
 */
export interface Response {
  /** Whether suggestion succeeded */
  success: boolean;
  /** Status message */
  message: string;
  /** Suggested item object */
  item?: Item;
  /** Confidence score (0-1) */
  confidence?: number;
}

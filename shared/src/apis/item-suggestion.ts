// packages/shared/src/apis/item-suggestion.ts
import { Item } from "../types";

/**
 * Request type for the suggestItemFromInvoice function
 */
export type SuggestItemFromInvoiceFnRequest = {
  itemDescription: string;
  unitPrice?: number;
  quantity?: number;
  supplierID?: string;
};

/**
 * Response type for the suggestItemFromInvoice function
 */
export type SuggestItemFromInvoiceFnResponse = {
  success: boolean;
  message: string;
  item?: Item;
  confidence?: number;
};

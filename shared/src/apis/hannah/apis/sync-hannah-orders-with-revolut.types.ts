/**
 * Sync Hannah Orders with Revolut - Request/Response Types
 *
 * Safely syncs Hannah order payment status against Revolut API.
 */

export interface Request {
  orgId: string;
  businessId: string;
  /** Optional: Sync only specific order IDs. If not provided, syncs all pending/failed orders. */
  orderIds?: string[];
}

export interface Response {
  success: boolean;
  checked: number;
  updated: number;
  fixed: number;     // Orders fixed from incorrect cancellation (frontend bug)
  refunded: number;  // Orders detected as refunded in Revolut
  errors: string[];
}

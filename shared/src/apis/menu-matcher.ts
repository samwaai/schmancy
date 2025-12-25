// packages/shared/src/apis/menu-matcher.ts

/**
 * Interface for the request to match a single sales record to a menu item
 */
export interface MatchSalesRecordRequest {
  orgId: string;
  productText: string;
}

/**
 * Interface for the response from matching a single sales record
 */
export interface MatchSalesRecordResponse {
  success: boolean;
  menuItemId?: string;
  menuItemName?: string;
  message: string;
}

/**
 * Interface for the request to match all unmapped sales records
 */
export interface MatchAllSalesRecordsRequest {
  orgId: string;
}

/**
 * Interface for the response from matching all unmapped sales records
 */
export interface MatchAllSalesRecordsResponse {
  success: boolean;
  message: string;
  matchedCount: number;
}
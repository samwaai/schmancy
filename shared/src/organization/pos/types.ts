/**
 * Universal POS Types
 * Simple, clean types for any POS integration
 */

// ============================================================================
// SALES SOURCE - Extensible for any POS system
// ============================================================================

/** Known POS systems */
export type KnownSalesSource = 'speedy' | 'hannah';

/** Any sales source - extensible string with autocomplete for known values */
export type SalesSource = KnownSalesSource | (string & {});

// ============================================================================
// TIP SUMMARY - Aggregated tip data from a terminal
// ============================================================================

export interface POSTipSummary {
  id: string;
  terminalName: string;
  sourceName: SalesSource;
  totalTips: number;
  receiptCount: number;
  totalSales: number;
  tipPercentage: number;
}

// ============================================================================
// CATEGORY REVENUE - Revenue by product category
// ============================================================================

export interface POSCategoryRevenue {
  category: string;
  revenue: number;
}

// ============================================================================
// SALES ITEM - Individual line item from any POS
// ============================================================================

export interface POSSalesItem {
  itemName: string;
  category: string;
  quantity: number;
  revenue: number;       // GROSS (includes VAT)
  taxAmount?: number;    // VAT in euros
  timestamp: string;
  hour: number;
  paymentMethod: string;
  salesSource?: SalesSource;
}

// ============================================================================
// SALES TIPS RESULT - Combined result from any POS fetch
// ============================================================================

export interface POSSalesTipsResult {
  tips: POSTipSummary[];
  categoryRevenue?: POSCategoryRevenue[];
  salesItems?: POSSalesItem[];
}

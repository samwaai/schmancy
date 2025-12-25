/**
 * Speedy POS (Kassenspeicher) specific types
 * Uses generic POS types from parent module
 */

import type { SalesSource } from '../types.js';

// ============================================================================
// SPEEDY-SPECIFIC TIP SUMMARY - With Kassenspeicher naming
// ============================================================================

/**
 * Speedy tip summary with Kassenspeicher-specific naming
 * @deprecated Use generic TipSummary from ../types.js for new code
 */
export interface TipSummary {
  id: string;
  cashboxName: string;    // Speedy-specific: maps to generic terminalName
  accountName: string;    // Speedy-specific: maps to generic sourceName
  totalTips: number;
  receiptCount: number;
  totalSales: number;
  tipPercentage: number;
}

// ============================================================================
// CATEGORY REVENUE - Simple revenue by category
// ============================================================================

export interface CategoryRevenue {
  category: string;
  revenue: number;
}

// ============================================================================
// SPEEDY SALES ITEM - Individual sale line item
// ============================================================================

export interface SpeedySalesItem {
  itemName: string;
  category: string;
  quantity: number;
  revenue: number;        // GROSS amount (includes VAT)
  taxAmount?: number;     // VAT amount in euros
  timestamp: string;
  hour: number;
  paymentMethod: string;
  salesSource?: SalesSource;
}

// ============================================================================
// SPEEDY TIPS RESULT - Combined result from fetch
// ============================================================================

export interface SpeedyTipsResult {
  tips: TipSummary[];
  categoryRevenue?: CategoryRevenue[];
  salesItems?: SpeedySalesItem[];
}

// ============================================================================
// TRANSFORMED TIP - Individual transaction detail
// ============================================================================

export interface TransformedTip {
  receiptId: string;
  timestamp: string;
  amount: number;
  paymentMethod: string;
}

// ============================================================================
// KASSENSPEICHER API TYPES - Specific to Speedy's API responses
// ============================================================================

export interface LoginResponse {
  data: {
    accessToken: string;
  };
}

export interface IndividualDataItem {
  AccountName: string;
  CashboxName: string;
  ReceiptID: string;
  ReceiptDateTime: string;
  ReceiptDateTime_Month: number;
  ReceiptDateTime_DayOfWeek: number;
  ReceiptDateTime_Hour: number;
  ReceiptNumber: string;
  ReceiptPosID: string;
  PosTextShort: string;
  ProductTextShort: string;
  ProductGroupText: string;
  Quantity: string;
  QuantityUnit: string;
  SalesPriceNet: string;
  SalesPriceGross: string;
  DepositTotalNet: string;
  DepositTotalGross: string;
  TaxPercentage: string;
  TaxTotal: string;
  Status: number;
  PaymentMethod: string;
  CustomerName: string;
  CustomerGroupText: string;
  UserName: string;
  UserGroupText: string;
  Costs: string;
  Profit: string;
  ProfitGross: string;
}

export interface IndividualResponse {
  status: string;
  message: string;
  data: {
    tableData: {
      data: IndividualDataItem[];
      timeConsumedBySQL?: number;
      timeConsumedByServer?: number;
    };
  };
}

// Cashbox Value from Kassenspeicher API
export interface CashboxValue {
  key: string;
  value: string;
  active: boolean;
  cloudAccount: string;
  parentEnumId: string | null;
  translate: boolean;
}

// Cashbox Response from Kassenspeicher API
export interface CashboxResponse {
  column: string;
  values: CashboxValue[];
}

// Terminal information
export interface SpeedyTerminal {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}

// Validation Request/Response
export interface ValidateSpeedyCredentialsRequest {
  email: string;
  password: string;
}

export interface ValidateSpeedyCredentialsResponse {
  valid: boolean;
  terminals?: SpeedyTerminal[];
  error?: string;
}

// Get Speedy Terminals Request/Response
export interface GetSpeedyTerminalsRequest {
  organizationId: string;
}

export interface GetSpeedyTerminalsResponse {
  success: boolean;
  terminals?: SpeedyTerminal[];
  error?: string;
}

// Product Groups (existing types)
export interface ProductGroupsResponse {
  success: boolean;
  categoryRevenue: Record<string, number>;
  productGroups?: string[];
}

export interface ProductGroupsRequest {
  credentials: {
    email: string;
    password: string;
  };
  includeRevenue?: boolean;
  from?: string;
  to?: string;
  terminals?: {
    included?: string[];
    excluded?: string[];
  };
}

// ============================================================================
// SPEEDY API REQUEST/RESPONSE TYPES - Verified from actual API calls
// ============================================================================

/**
 * Speedy API filter operators
 * - '≈' (approximately equal): Contains/partial match for enum values
 * - '=' : Exact match
 */
export type SpeedyFilterOperation = '≈' | '=' | '>' | '<' | '>=' | '<=';

/**
 * Speedy API filter structure
 *
 * IMPORTANT: Multiple values must be joined with '$$' separator
 * Example: "Zola Ufer 1$$Zola Ufer 10$$Zola Ufer 11"
 *
 * @example
 * {
 *   dataColumnName: 'CashboxName',
 *   columnType: 'enum',
 *   value: 'Terminal A$$Terminal B',  // Multiple values joined with $$
 *   operation: '≈'
 * }
 */
export interface SpeedyApiFilter {
  dataColumnName: string;
  columnType: 'enum' | 'string' | 'number' | 'date';
  value: string;
  operation: SpeedyFilterOperation;
  numberOfDecimals?: number;
}

/**
 * Helper to join multiple filter values with the correct separator
 * @param values - Array of values to join
 * @returns Joined string with $$ separator
 */
export const joinSpeedyFilterValues = (values: string[]): string => values.join('$$');

/**
 * Speedy API pagination preference
 */
export interface SpeedyPaginationPreference {
  page: number;
  pageSize: number;
}

/**
 * Speedy API sort preference
 */
export interface SpeedySortPreference {
  columnName: string;
  order: 'asc' | 'desc';
}

/**
 * Speedy API date filter
 */
export interface SpeedyDateFilter {
  start_date: string; // Format: "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD HH:mm"
  end_date: string; // Format: "YYYY-MM-DD HH:mm:ss" or "YYYY-MM-DD HH:mm"
  timePeriod: 'any' | 'today' | 'yesterday' | 'last7days' | 'last30days';
  number_of_days?: string;
}

/**
 * Speedy API column request preference
 */
export interface SpeedyColumnRequestPreference {
  columnsForSummation: string[];
  groupByColumns: string[];
  primaryColumns: string[];
  visibleColumns: string[];
  filters: SpeedyApiFilter[];
}

// ============================================================================
// REPORT-TURNOVER-INDIVIDUAL API (Individual Sales Items)
// ============================================================================

/**
 * Request body for report-turnover-individual API
 * Endpoint: POST /api/v1/report-turnover-individual
 */
export interface SpeedyIndividualTurnoverRequest {
  cloudAccounts: string[];
  paginationPreference: SpeedyPaginationPreference;
  sortPreference: SpeedySortPreference;
  dateFilterColumn: 'ReceiptDateTime';
  dateFilter: SpeedyDateFilter;
  columnRequestPreference: SpeedyColumnRequestPreference;
  getTreeStructure: boolean;
  loadDeleted: boolean;
  translationKey: string;
}

/**
 * Individual data item from report-turnover-individual API
 * Extended with additional fields from verified API responses
 */
export interface SpeedyIndividualDataItem {
  AccountName: string;
  CashboxID: string;
  CashboxName: string;
  ReceiptID: string;
  ReceiptDateTime: string;
  ReceiptDateTime_Month: number;
  ReceiptDateTime_DayOfWeek: number;
  ReceiptDateTime_Hour: number;
  ReceiptNumber: string;
  ReceiptPosID: string;
  PosTextShort: string;
  ProductID: string;
  ProductNumber: string;
  ProductTextShort: string;
  ProductGroupID: string;
  ProductGroupText: string;
  Quantity: string;
  QuantityUnit: string;
  SalesPriceNet: string;
  SalesPriceGross: string;
  DepositTotalNet: string;
  DepositTotalGross: string;
  TaxPercentage: string;
  TaxTotal: string;
  Status: number;
  ClosingStatus: number;
  PaymentMethod: string;
  CustomerID: string;
  CustomerNumber: string;
  CustomerName: string;
  CustomerGroupID: string;
  CustomerGroupText: string;
  UserID: string;
  UserNumber: string;
  UserName: string;
  UserGroupID: string;
  UserGroupText: string;
  PosUserName: string;
  PosUserGroupText: string;
  DiscountText: string;
  MemoText: string;
  Costs: string;
  Profit: string;
  ProfitGross: string;
  CreatedDateTimeUTC: string;
  ReceiptOrigin: string;
}

/**
 * Response from report-turnover-individual API
 */
export interface SpeedyIndividualTurnoverResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    tableData: {
      data: SpeedyIndividualDataItem[];
      timeConsumedBySQL?: number;
      timeConsumedByServer?: number;
    };
  };
}

// ============================================================================
// REPORT-TURNOVER-CASHBOXES API (Tips/Cashbox Summary)
// ============================================================================

/**
 * Request body for report-turnover-cashboxes API
 * Endpoint: POST /api/v1/report-turnover-cashboxes
 */
export interface SpeedyCashboxTurnoverRequest {
  cloudAccounts: string[];
  paginationPreference: SpeedyPaginationPreference;
  sortPreference: SpeedySortPreference;
  dateFilterColumn: 'ReceiptDateTime';
  dateFilter: SpeedyDateFilter;
  columnRequestPreference: SpeedyColumnRequestPreference;
  getTreeStructure: boolean;
  loadDeleted: boolean;
  translationKey: string;
  getDataSums?: boolean;
}

/**
 * Cashbox data item from report-turnover-cashboxes API
 */
export interface SpeedyCashboxDataItem {
  AccountName: string;
  CashboxID: string;
  CashboxName: string;
  SumSalesTotalNet: string;
  SumSalesTotalGross: string;
  SumTaxTotal: string;
  AmountTip: string;
  AmountGiven: string;
  AmountChange: string;
  CountPayedReceipts: string;
  SumSalesTotalCashNet: string;
  SumSalesTotalNonCashNet: string;
  SumSalesTotalCashGross: string;
  SumSalesTotalNonCashGross: string;
  SumOpenTotalGross: string;
  SumCanceledTotalGross: string;
  AmountSumDeposit: string;
  AverageSumNet?: string;
  AverageSumGross?: string;
  CountOpenReceipts: string;
  CountCanceledReceipts: string;
  CountPaymentsInReceipts: string;
  CountPaymentsOutReceipts: string;
  SumPaymentsIn: string;
  SumPaymentsOut: string;
}

/**
 * Column sums from report-turnover-cashboxes API (when getDataSums=true)
 */
export interface SpeedyCashboxColumnSums {
  SumSalesTotalNet: string;
  SumSalesTotalGross: string;
  SumTaxTotal: string;
  AmountTip: string;
  AmountGiven: string;
  AmountChange: string;
  CountPayedReceipts: string;
  SumSalesTotalCashNet: string;
  SumSalesTotalNonCashNet: string;
  SumSalesTotalCashGross: string;
  SumSalesTotalNonCashGross: string;
  SumOpenTotalGross: string;
  SumCanceledTotalGross: string;
  AmountSumDeposit: string;
  CountOpenReceipts: string;
  CountCanceledReceipts: string;
  CountPaymentsInReceipts: string;
  CountPaymentsOutReceipts: string;
  SumPaymentsIn: string;
  SumPaymentsOut: string;
}

/**
 * Response from report-turnover-cashboxes API
 */
export interface SpeedyCashboxTurnoverResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    tableData?: {
      data: SpeedyCashboxDataItem[];
      timeConsumedBySQL?: number;
      timeConsumedByServer?: number;
    };
    columnSums?: SpeedyCashboxColumnSums;
    totalEntries?: number;
  };
}

// ============================================================================
// SPEEDY API CONSTANTS
// ============================================================================

/**
 * Speedy API filter value separator
 * Use this constant when joining multiple values for a filter
 */
export const SPEEDY_FILTER_VALUE_SEPARATOR = '$$';

/**
 * Speedy API base URL
 */
export const SPEEDY_API_BASE_URL = 'https://srv1.kassenspeicher.de/webui/backend/public/api/v1';

/**
 * Speedy API endpoints
 */
export const SPEEDY_API_ENDPOINTS = {
  LOGIN: '/login',
  REPORT_TURNOVER_INDIVIDUAL: '/report-turnover-individual',
  REPORT_TURNOVER_CASHBOXES: '/report-turnover-cashboxes',
} as const;
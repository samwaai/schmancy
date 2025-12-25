// types.ts - Place this file where both frontend and backend can access it

/**
 * Sales record interface with all fields from the API
 */
export interface SalesRecord {
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
  Costs: string;
  Profit: string;
  ProfitGross: string;
  CreatedDateTimeUTC: string;
}

/**
 * Order record interface with all fields from the API
 */
export interface OrderRecord {
  AccountName: string;
  CashboxName: string;
  ReceiptID: string;
  ReceiptNumber: string;
  ReceiptDateTime: string;
  ReceiptDateTime_Month: number;
  ReceiptDateTime_DayOfWeek: number;
  ReceiptDateTime_Hour: number;
  ReceiptDateTime_Minute: number;
  ServerTimestampUTC: string;
  ChangedDateTimeUTC: string;
  CustomerID?: string;
  CustomerNumber?: string;
  CustomerName: string;
  CustomerGroupID?: string;
  CustomerGroupText: string;
  UserID?: string;
  UserNumber?: string;
  UserName: string;
  UserGroupID: string;
  UserGroupText: string;
  PosUserName?: string;
  PaymentMethod: string;
  PaymentTransactionData: string;
  AmountSumDeposit: string;
  AmountSumNet: string;
  AmountSumGross: string;
  AmountGiven: string;
  AmountChange: string;
  AmountTip: string;
  PosCount: number;
  TaxMode: number;
  SignatureStatus: number;
  Status?: number;
  ClosingStatus?: number;
  CreatedDateTimeUTC: string;
}

/**
 * Payment transaction data structure
 */
export interface PaymentTransaction {
  provider: string;
  status: string;
  terminalID: number;
  amount: number;
  traceNr: number;
  time: string;
  date: string;
  expiryDate: string;
  cardSequNr: number;
  paymentType: string;
  pan: string;
  receiptNr: number;
  aid: string;
  vuNr: string;
  cardTypeName: string;
  cardType: string;
  addText?: string;
  tlv?: string;
}

/**
 * API request parameters
 */
export interface ApiRequestParams {
  startDate: string;
  endDate: string;
  enableChunking?: boolean;
}

/**
 * API response structures
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T[];
  totalRecords: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
}

export interface SalesDataResponse extends ApiResponse<SalesRecord> {}
export interface OrdersDataResponse extends ApiResponse<OrderRecord> {}

/**
 * Date range interface for chunking operations
 */
export interface DateRange {
  start: string;
  end: string;
}

// Legacy PaymentRequest - keeping for backward compatibility if needed
export interface PaymentRequest {
  iban: string;
  bic?: string;
  amount: number;
  currency: string;
  reference: string;
  recipientName: string;
  recipientEmail?: string;
}

/**
 * Revolut Payment Request Interface
 * Exact match of Revolut Business API POST /pay request body
 * @see https://developer.revolut.com/docs/business/create-payment
 */
export interface RevolutPaymentRequest {
  /** Unique identifier for the transaction (max 40 characters) - Required */
  request_id: string;
  
  /** Source account UUID from which to make the payment - Required */
  account_id: string;
  
  /** Receiver details - Required */
  receiver: {
    /** Recipient counterparty UUID - Required */
    counterparty_id: string;
    /** Specific recipient account ID - Optional, required if counterparty has multiple accounts */
    account_id?: string;
    /** Specific recipient card ID - Optional */
    card_id?: string;
  };
  
  /** Payment amount in major currency units (e.g., euros, dollars, pounds) - Required */
  amount: number;
  
  /** ISO 4217 currency code (e.g., 'EUR', 'USD', 'GBP') - Optional */
  currency?: string;
  
  /** Payment reference that appears on statements - Optional */
  reference?: string;
  
  /** Specifies who pays the transfer fees - Optional, defaults to 'debtor' */
  charge_bearer?: 'shared' | 'debtor';
  
  /** Reason code for the transfer - Optional */
  transfer_reason_code?: string;
  
  /** Reason code for currency exchange - Optional */
  exchange_reason_code?: string;
}

/**
 * Revolut Payment Response Interface
 * Exact match of Revolut Business API POST /pay response body
 * @see https://developer.revolut.com/docs/business/create-payment
 */
export interface RevolutPaymentResponse {
  /** Unique payment identifier from Revolut - Required */
  id: string;
  
  /** Current state of the payment - Required */
  state: 'created' | 'pending' | 'completed' | 'declined' | 'failed' | 'reverted';
  
  /** ISO 8601 timestamp when the payment was created - Required */
  created_at: string;
  
  /** ISO 8601 timestamp when the payment was completed - Optional */
  completed_at?: string;
}

// Bulk Payment Types
export interface BulkPaymentRequest {
  payments: RevolutPaymentRequest[];
  processingOptions?: {
    batchSize?: number;
    delayBetweenBatches?: number;
    stopOnError?: boolean;
  };
}

export interface PaymentResult {
  index: number;
  success: boolean;
  paymentId?: string;
  error?: string;
  request: RevolutPaymentRequest;
}

export interface BulkPaymentResponse {
  success: boolean;
  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;
  results: PaymentResult[];
}

// Legacy PaymentResponse - keeping for backward compatibility
export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  status: PaymentStatus;
  message: string;
  revolutPaymentId?: string;
}

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'declined'
  | 'refunded';

export interface Payment {
  id: string;
  userId: string;
  requestId: string;
  counterpartyId: string;
  amount: number;
  currency: string;
  reference: string;
  recipient: {
    name: string;
    iban: string;
    bic?: string;
  };
  status: PaymentStatus;
  revolutPaymentId?: string;
  revolutResponse?: any;
  createdAt: Date;
  updatedAt?: Date;
  completedAt?: string;
}


export interface WebhookEvent {
  event: string;
  data: {
    id: string;
    state: string;
    completed_at?: string;
    [key: string]: any;
  };
}

export interface ErrorResponse {
  error: string;
  details?: any;
}

// CSV Payment Row Interface - for bulk CSV uploads
// @deprecated Use CsvPaymentRecord from csv-payment.types.ts for all CSV payment exports
// This interface is kept for backward compatibility with existing CSV upload functionality
export interface PaymentRow {
  recipient_name: string;
  iban: string;
  amount: string;
  currency: string;
  reference: string;
  recipient_email?: string;
  bic?: string;
}

// ============================================================================
// Revolut API Response Interfaces
// ============================================================================

/**
 * Raw Revolut Transaction from API
 * This is the actual structure returned by Revolut's /transactions endpoint
 * @see https://developer.revolut.com/docs/business/get-transactions
 */
export interface RevolutRawTransaction {
  id: string;
  type: string;
  state: string;
  request_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  reference?: string;
  legs: Array<{
    leg_id: string;
    account_id: string;
    counterparty?: {
      id?: string;  // May be present for some counterparty types
      account_type: string;  // Note: it's account_type, not type
      account_id: string;
    };
    amount: number;
    fee?: number;
    currency: string;
    bill_amount?: number;
    bill_currency?: string;
    description?: string;
    balance?: number;
  }>;
  merchant?: {
    name: string;
    city?: string;
    category_code?: string;
    country?: string;
  };
  card?: {
    id: string;
    card_number: string;
    first_name: string;
    last_name: string;
    phone?: string;
  };
}

/**
 * Revolut Transaction Interface
 * Represents a simplified/transformed transaction for frontend consumption
 */
export interface RevolutTransaction {
  id: string;
  type: string;
  state: string;
  amount: number;
  currency: string;
  direction: 'incoming' | 'outgoing';
  reference: string;
  description: string; // Added to preserve leg.description (contains recipient names like "To John Doe")
  createdAt: string;
  completedAt?: string;
  accountId: string;
  counterparty?: {
    id?: string;
    type: string;
    account_id?: string;
  };
  merchant?: {
    name: string;
    city?: string;
    category_code?: string;
    country?: string;
    reference?: string;
  };
  balance?: number;
}

/**
 * Balance Response Interface
 */
export interface BalanceResponse {
  success: boolean;
  balance: number;
  currency: string;
  accountId?: string;
}

/**
 * Transactions Response Interface
 */
export interface TransactionsResponse {
  success: boolean;
  transactions: RevolutTransaction[];
  hasMore?: boolean;
  nextCursor?: string;
}

/**
 * Raw Transactions Response Interface - direct from Revolut API
 */
export interface RawTransactionsResponse {
  success: boolean;
  transactions: RevolutRawTransaction[];
  hasMore?: boolean;
  nextCursor?: string;
}


/**
 * Revolut Account Interface
 * Represents a Revolut account with balance and currency information
 */
export interface RevolutAccount {
  id: string;
  name?: string;
  balance: number;
  currency: string;
  state: 'active' | 'inactive';
  public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Auth Status Response Interface
 */
export interface AuthStatusResponse {
  success: boolean;
  isConfigured: boolean;
  needsSetup?: boolean;
  error?: string;
}

/**
 * Employee View Data Response
 * @deprecated Use EmployeeViewResponse from shared/types/employee-view.types.ts instead
 * This interface is kept for backward compatibility only
 */
export interface EmployeeViewDataResponse {
  success: boolean;
  data?: {
    employee: any; // Use appropriate Employee type from shared
    attendance: any[]; // Use appropriate Attendance type from shared
  };
  error?: string;
}

/**
 * Restaurant Data Response
 */
export interface RestaurantDataResponse {
  id: string;
  name: string;
  tipsDistribution: any;
  tipsData?: {
    summary: {
      totalTips: number;
      totalReceipts: number;
      totalSales: number;
      avgTipPercentage: number;
    };
    distribution: Array<{
      employeeCode: string;
      name: string;
      hours: number;
      group: string;
      tipAmount: number;
      customPercentage?: number;
      deviceHours?: Array<{ device: string; hours: number }>;
      missedCheckout?: boolean;
      excludedFromTips?: boolean;
      punchTimes?: { firstPunch: string; lastPunch: string };
    }>;
    groupTips: Record<string, number>;
    groupHours: Record<string, number>;
    totalHours: number;
    tips: Array<{
      id: string;
      cashboxName: string;
      accountName: string;
      totalTips: number;
      receiptCount: number;
      totalSales: number;
      tipPercentage: number;
    }>;
  };
}
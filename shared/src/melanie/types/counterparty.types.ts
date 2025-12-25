/**
 * Counterparty Types
 * Shared types for Revolut counterparty management
 */

/**
 * Revolut Counterparty Card - for card-based counterparties
 * Direct mapping from API response
 */
export interface RevolutCounterpartyCard {
  id: string;
  name: string;
  last_digits: number;
  scheme: string;
  country: string;
  currency: string;
}

/**
 * Revolut Counterparty Account
 * Direct mapping from API response - NO TRANSFORMATIONS
 */
export interface RevolutCounterpartyAccount {
  id: string;
  type?: string;
  name?: string;
  bank_country?: string;
  currency?: string;
  account_no?: string;
  sort_code?: string;
  iban?: string;
  routing_number?: string;
  bic?: string;
  clabe?: string;
  ifsc?: string;
  bsb_code?: string;
  beneficiary?: boolean;
  estimated_time?: {
    unit: string;
    min?: number;
    max?: number;
  };
  schemes?: Array<{
    scheme_id: string;
    fee?: {
      currency: string;
      amount: number;
    };
    estimated_time?: {
      unit: string;
      min?: number;
      max?: number;
    };
  }>;
}

/**
 * Revolut Counterparty
 * Direct mapping from GET /counterparties API response - NO TRANSFORMATIONS
 * @see https://developer.revolut.com/docs/business/get-counterparties
 */
export interface RevolutCounterparty {
  id: string;
  name: string;
  revtag?: string;
  phone?: string;
  email?: string;
  profile_type?: 'personal' | 'business';
  country?: string;
  state: 'created' | 'draft' | 'deleted';
  created_at: string;
  updated_at: string;
  accounts?: RevolutCounterpartyAccount[];
  cards?: RevolutCounterpartyCard[];
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * Request to create a new counterparty
 */
export interface CreateCounterpartyRequest {
  /** Company or individual name */
  company_name: string;
  /** IBAN */
  iban: string;
  /** BIC/SWIFT code (optional, required for non-SEPA transfers) */
  bic?: string;
  /** Bank country (ISO 3166-1 alpha-2) */
  bank_country: string;
  /** Currency (ISO 4217) */
  currency: string;
  /** Email address (optional) */
  email?: string;
  /** Phone number (optional) */
  phone?: string;
}

/**
 * Query parameters for GET /counterparties endpoint
 * Direct mapping from API documentation - NO TRANSFORMATIONS
 * @see https://developer.revolut.com/docs/business/get-counterparties
 */
export interface GetCounterpartiesQueryParams {
  name?: string;
  account_no?: string;
  sort_code?: string;
  iban?: string;
  bic?: string;
  created_before?: string;
  limit?: number;
}


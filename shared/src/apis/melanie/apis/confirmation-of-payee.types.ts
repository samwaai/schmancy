/**
 * Melanie Confirmation of Payee API Types
 * Request/response types for confirmation of payee validation
 *
 * NOTE: This file handles TWO different functions:
 * 1. melanieConfirmationOfPayee - Authenticated CoP validation (updates employee document)
 * 2. melanieConfirmationOfPayeePublic - Public CoP validation (no auth, no Firestore writes)
 *
 * Since they have different signatures, we use a generic Request/Response
 * that includes all possible fields.
 */

/**
 * Request for CoP validation
 * Supports both public and authenticated operations
 */
export interface Request {
  // Public API fields (melanieConfirmationOfPayeePublic)
  /** IBAN to validate */
  iban?: string;
  /** Full name to validate (public API) */
  name?: string;

  // Authenticated API fields (melanieConfirmationOfPayee)
  /** Organization ID (authenticated API) */
  orgId?: string;
  /** Employee ID (authenticated API) */
  employeeId?: string;
  /** First name (authenticated API) */
  firstName?: string;
  /** Last name (authenticated API) */
  lastName?: string;
  /** Optional recipient country (authenticated API) */
  recipientCountry?: string;
  /** Optional recipient currency (authenticated API) */
  recipientCurrency?: string;
}

/**
 * Response from CoP validation
 * Supports both public and authenticated response formats
 */
export interface Response {
  /** Match status */
  status: 'matched' | 'close_match' | 'not_matched' | 'cannot_be_checked' | 'not_verified';

  // Public API fields
  /** Status message (public API) */
  message?: string;
  /** Currency (public API) */
  currency?: string;
  /** Bank country (public API) */
  bankCountry?: string;

  // Common fields
  /** Profile type */
  profileType?: 'personal' | 'business';
  /** First name (for personal profiles) */
  firstName?: string;
  /** Last name (for personal profiles) */
  lastName?: string;
  /** Company name (for business profiles) */
  companyName?: string;

  // Authenticated API fields
  /** Actual name from bank records (authenticated API) */
  actualName?: string;
  /** Validation timestamp (authenticated API) */
  validatedAt?: string;
  /** Retry attempts details (authenticated API) */
  retryAttempts?: Array<{
    attempt: number;
    profileType: 'personal' | 'business';
    resultCode: string;
    succeeded: boolean;
  }>;
  /** Error message if failed */
  error?: string;
}

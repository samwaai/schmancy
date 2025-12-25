/**
 * Unified CSV Payment Export Types
 * 
 * This module defines the standard CSV payment format used throughout the application.
 * All CSV payment exports MUST use this format to ensure consistency.
 * 
 * Source of truth: TipsHeader.generateAllRestaurantsCSVFile method
 * Format: semicolon-delimited with specific column order
 */

/**
 * Standard CSV Payment Record Interface
 * 
 * This interface represents a single payment record in the unified CSV format.
 * All CSV payment exports must conform to this structure.
 * 
 * CSV Format: recipient_name;iban;amount;reference;recipient_email;bic;restaurant
 * 
 * @mandatory This is the ONLY interface that should be used for CSV payment exports.
 * @enforcement All new CSV payment export code MUST use this interface.
 * @see generatePaymentCSV() for the standardized export function.
 */
export interface CsvPaymentRecord {
  /** Recipient's full name (IBAN account holder name preferred) */
  recipient_name: string;
  
  /** International Bank Account Number (required) */
  iban: string;
  
  /** Payment amount - will be automatically formatted with 2 decimal places and comma as decimal separator (e.g., "123,45") */
  amount: string | number;
  
  /** Payment reference that appears on bank statements */
  reference: string;
  
  /** Recipient's email address (optional) */
  recipient_email?: string;
  
  /** Bank Identifier Code (optional, required for non-German IBANs) */
  bic?: string;
  
  /** Restaurant/source name (optional, used for multi-source exports) */
  restaurant?: string;
}

/**
 * CSV Payment Export Options
 * 
 * Configuration options for generating CSV payment exports
 */
export interface CsvPaymentExportOptions {
  /** Include restaurant column in export (default: false) */
  includeRestaurant?: boolean;
  
  /** Include email column in export (default: true) */
  includeEmail?: boolean;
  
  /** Include BIC column in export (default: true) */
  includeBic?: boolean;
  
  /** Custom filename prefix (default: 'payment-export') */
  filenamePrefix?: string;
  
  /** Date range for filename generation */
  dateRange?: {
    startDate: string;
    endDate?: string;
  };
}

/**
 * CSV Payment Export Result
 * 
 * Result of a CSV payment export operation
 */
export interface CsvPaymentExportResult {
  /** Whether the export was successful */
  success: boolean;
  
  /** Generated filename */
  filename: string;
  
  /** Number of records exported */
  recordCount: number;
  
  /** CSV content as string */
  csvContent: string;
  
  /** Any validation errors or warnings */
  errors?: string[];
  
  /** Any validation warnings */
  warnings?: string[];
}

/**
 * CSV Payment Headers
 * 
 * Standard CSV headers used for payment exports
 */
export const CSV_PAYMENT_HEADERS = {
  /** Full headers including all optional columns */
  FULL: 'recipient_name;iban;amount;reference;recipient_email;bic;restaurant',
  
  /** Minimal headers for basic payment exports */
  MINIMAL: 'recipient_name;iban;amount;reference',
  
  /** Headers without restaurant column (most common case) */
  STANDARD: 'recipient_name;iban;amount;reference;recipient_email;bic'
} as const;

/**
 * CSV Payment Delimiters
 * 
 * Standard delimiters used for payment CSV exports
 */
export const CSV_PAYMENT_DELIMITERS = {
  /** Column delimiter (semicolon) */
  COLUMN: ';',
  
  /** Row delimiter (newline) */
  ROW: '\n',
  
  /** Decimal separator for amounts (comma) */
  DECIMAL: ','
} as const;

/**
 * ENFORCEMENT RULES FOR CSV PAYMENT EXPORTS
 * 
 * 1. MANDATORY: All CSV payment exports MUST use CsvPaymentRecord interface
 * 2. MANDATORY: All CSV payment exports MUST use generatePaymentCSV() function
 * 3. FORBIDDEN: Creating custom CSV generation code for payments
 * 4. FORBIDDEN: Using different delimiters or formats for payment CSV
 * 5. FORBIDDEN: Using PaymentRow interface for new CSV exports (deprecated)
 * 
 * Violations of these rules will result in inconsistent CSV formats across the application.
 * 
 * @example Correct usage:
 * ```typescript
 * import { generatePaymentCSV, type CsvPaymentRecord } from 'shared/utils/csv-payment-export';
 * 
 * const records: CsvPaymentRecord[] = [...];
 * const result = generatePaymentCSV(records, options);
 * if (result.success) {
 *   downloadCSV(result.csvContent, result.filename);
 * }
 * ```
 * 
 * @example WRONG - Do not do this:
 * ```typescript
 * // DON'T: Manual CSV generation
 * const csv = records.map(r => `${r.name},${r.iban},...`).join('\n');
 * 
 * // DON'T: Different delimiters
 * const csv = records.map(r => `${r.name}\t${r.iban}...`).join('\n');
 * 
 * // DON'T: Using deprecated PaymentRow for exports
 * const paymentRows: PaymentRow[] = [...];
 * ```
 */
export const CSV_PAYMENT_ENFORCEMENT_RULES = {
  MANDATORY_INTERFACE: 'CsvPaymentRecord',
  MANDATORY_FUNCTION: 'generatePaymentCSV',
  FORBIDDEN_MANUAL_GENERATION: true,
  REQUIRED_DELIMITER: ';',
  REQUIRED_DECIMAL_SEPARATOR: ','
} as const;
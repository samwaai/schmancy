/**
 * Unified CSV Payment Export Utility
 * 
 * This utility provides a single, standardized way to generate CSV payment exports
 * that matches the exact format used by TipsHeader.generateAllRestaurantsCSVFile.
 * 
 * All CSV payment exports in the application MUST use this utility to ensure
 * consistent formatting across frontend and backend.
 */

import dayjs from 'dayjs';
import type { 
  CsvPaymentRecord, 
  CsvPaymentExportOptions, 
  CsvPaymentExportResult
} from '../types/csv-payment.types';

/**
 * Generates a CSV string from payment records using the unified format
 * 
 * This function replicates the exact behavior of TipsHeader.generateAllRestaurantsCSVFile
 * to ensure all CSV exports use the same format:
 * - Semicolon (;) as column delimiter
 * - Comma (,) as decimal separator for amounts
 * - Standard column order: recipient_name;iban;amount;reference;recipient_email;bic;restaurant
 * 
 * @mandatory This is the ONLY function that should be used for CSV payment exports.
 * @enforcement All CSV payment export code MUST use this function.
 * @param records Array of payment records to export
 * @param options Export configuration options
 * @returns CSV export result with content and metadata
 */
export function generatePaymentCSV(
  records: CsvPaymentRecord[],
  options: CsvPaymentExportOptions = {}
): CsvPaymentExportResult {
  const {
    includeRestaurant = false,
    includeEmail = true,
    includeBic = true,
    filenamePrefix = 'payment-export',
    dateRange
  } = options;

  // Validation
  if (!records || records.length === 0) {
    return {
      success: false,
      filename: '',
      recordCount: 0,
      csvContent: '',
      errors: ['No payment records provided']
    };
  }

  // Validate records and collect errors/warnings
  const errors: string[] = [];
  const warnings: string[] = [];
  
  records.forEach((record, index) => {
    if (!record.recipient_name?.trim()) {
      errors.push(`Row ${index + 1}: Recipient name is required`);
    }
    if (!record.iban?.trim()) {
      errors.push(`Row ${index + 1}: IBAN is required`);
    }
    if (!record.amount && record.amount !== 0 && record.amount !== '0' && record.amount !== '0,00' && record.amount !== '0.00') {
      errors.push(`Row ${index + 1}: Amount is required`);
    } else if (typeof record.amount === 'string' && record.amount.trim() === '') {
      errors.push(`Row ${index + 1}: Amount is required`);
    } else if (typeof record.amount === 'number' && record.amount < 0) {
      errors.push(`Row ${index + 1}: Amount cannot be negative`);
    }
    if (!record.reference?.trim()) {
      errors.push(`Row ${index + 1}: Reference is required`);
    }
  });

  // Build headers based on options (following TipsHeader format)
  const headerParts: string[] = [
    'recipient_name',
    'iban', 
    'amount',
    'reference'
  ];
  
  if (includeEmail) {
    headerParts.push('recipient_email');
  }
  
  if (includeBic) {
    headerParts.push('bic');
  }
  
  if (includeRestaurant) {
    headerParts.push('restaurant');
  }
  
  const headers = headerParts.join(';');
  
  // Build data rows
  // IMPORTANT: All values must be trimmed to avoid spaces/tabs that cause banking system import failures
  const rows = records.map(record => {
    const rowParts: string[] = [
      (record.recipient_name || '').trim(),
      (record.iban || '').replace(/\s/g, ''), // Remove ALL whitespace from IBAN
      ensureAmountFormatted(record.amount), // Enforce amount formatting
      (record.reference || '').trim()
    ];

    if (includeEmail) {
      rowParts.push((record.recipient_email || '').trim());
    }

    if (includeBic) {
      rowParts.push((record.bic || '').trim());
    }

    if (includeRestaurant) {
      rowParts.push((record.restaurant || '').trim());
    }

    return rowParts.join(';');
  });
  
  // Combine headers and rows (exact TipsHeader format)
  const csvContent = [headers, ...rows].join('\n');
  
  // Generate filename (following TipsHeader naming convention)
  let filename: string;
  if (dateRange) {
    if (dateRange.startDate === dateRange.endDate) {
      filename = `${filenamePrefix}-${dateRange.startDate}.csv`;
    } else {
      filename = `${filenamePrefix}-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    }
  } else {
    filename = `${filenamePrefix}-${dayjs().format('YYYY-MM-DD')}.csv`;
  }
  
  return {
    success: errors.length === 0,
    filename,
    recordCount: records.length,
    csvContent,
    errors: errors.length > 0 ? errors : undefined,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Creates a browser download for the CSV content
 * 
 * This function replicates the download behavior from TipsHeader.generateAllRestaurantsCSVFile
 * 
 * @param csvContent The CSV content to download
 * @param filename The filename for the download
 */
export function downloadCSV(csvContent: string, filename: string): void {
  // Add UTF-8 BOM for Windows/StarMoney compatibility
  // BOM = Byte Order Mark (0xEF 0xBB 0xBF) tells Windows this is UTF-8
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Converts cents to euros with proper precision for Revolut API
 *
 * @param cents - Amount in cents (integer)
 * @returns Amount in euros as number with 2 decimal places precision
 */
export function centsToEuros(cents: number): number {
  return cents / 100;
}

/**
 * Formats cents amount for CSV export
 *
 * Converts cents to euros and formats to the standard CSV format used by TipsHeader:
 * - Divides by 100 to convert cents to euros
 * - 2 decimal places
 * - Comma as decimal separator
 *
 * @param cents The amount in cents as integer
 * @returns Formatted amount string (e.g., "123,45" for 12345 cents)
 */
export function formatAmountForCSV(cents: number): string {
  return centsToEuros(cents).toFixed(2).replace('.', ',');
}

/**
 * Ensures amount is formatted correctly for CSV export
 * 
 * This function handles both string and number inputs and ensures
 * the amount is always formatted with comma as decimal separator.
 * 
 * @param amount The amount as string or number
 * @returns Formatted amount string (e.g., "123,45")
 */
function ensureAmountFormatted(amount: string | number | undefined): string {
  if (amount === undefined || amount === null) return '';
  
  // Handle zero explicitly (important for tips that might be 0.00)
  if (amount === 0 || amount === '0' || amount === '0,00' || amount === '0.00') {
    return '0,00';
  }
  
  // If it's already a string with comma separator, use it
  if (typeof amount === 'string' && amount.includes(',')) {
    return amount;
  }
  
  // Convert to number and format properly
  const numAmount = typeof amount === 'number' ? amount : 
    parseFloat(typeof amount === 'string' ? amount.replace(',', '.') : '0');
    
  return isNaN(numAmount) ? '' : formatAmountForCSV(numAmount);
}

/**
 * Converts a PaymentRow (from existing types) to CsvPaymentRecord
 *
 * This helper ensures backward compatibility when migrating existing code
 * to use the unified CSV format.
 *
 * IMPORTANT: Trims all string values to prevent spaces/tabs that cause banking import failures
 *
 * @param paymentRow Existing PaymentRow data
 * @param restaurant Optional restaurant name for multi-source exports
 * @returns Converted CsvPaymentRecord with trimmed values
 */
export function convertPaymentRowToCsvRecord(
  paymentRow: {
    recipient_name: string;
    iban: string;
    amount: string;
    reference: string;
    recipient_email?: string;
    bic?: string;
  },
  restaurant?: string
): CsvPaymentRecord {
  return {
    recipient_name: (paymentRow.recipient_name || '').trim(),
    iban: (paymentRow.iban || '').trim(),
    amount: (paymentRow.amount || '').trim(),
    reference: (paymentRow.reference || '').trim(),
    recipient_email: paymentRow.recipient_email ? paymentRow.recipient_email.trim() : undefined,
    bic: paymentRow.bic ? paymentRow.bic.trim() : undefined,
    restaurant: restaurant ? restaurant.trim() : undefined
  };
}

/**
 * Default export options that match TipsHeader behavior
 */
export const DEFAULT_CSV_EXPORT_OPTIONS: CsvPaymentExportOptions = {
  includeRestaurant: false,
  includeEmail: true,
  includeBic: true,
  filenamePrefix: 'payment-export'
};
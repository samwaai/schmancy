/**
 * Unified Payment Validation Module
 *
 * Provides comprehensive validation for payment data including:
 * - IBAN validation with proper mod-97 checksum
 * - BIC validation with country-specific requirements
 * - Data normalization and cleaning
 * - Country-specific rules (BIC optional for German IBANs)
 */

import { validateIBAN, isBICRequired, getIBANCountryCode } from './iban-validation';
import { normalizeIBAN } from '../../utils/normalize';

export interface PaymentValidationOptions {
  /** Whether to require BIC even for German IBANs */
  forceBICRequired?: boolean;
  /** Whether to allow empty recipient email */
  allowEmptyEmail?: boolean;
  /** Maximum amount allowed */
  maxAmount?: number;
  /** Minimum amount allowed */
  minAmount?: number;
}

export interface PaymentValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  normalizedData?: NormalizedPaymentData;
}

export interface NormalizedPaymentData {
  iban: string;
  bic: string | null;
  amount: number;
  currency: string;
  reference: string;
  recipientName: string;
  recipientEmail: string | null;
}

export interface PaymentValidationInput {
  iban?: string | null;
  bic?: string | null;
  amount?: number | string | null;
  currency?: string | null;
  reference?: string | null;
  recipientName?: string | null;
  recipientEmail?: string | null;
}

// normalizeIBAN is imported from '../../utils/normalize' and used internally
// It's already exported from the main utils package, so we don't re-export it here
// to avoid duplicate export ambiguity

/**
 * Clean and normalize BIC
 */
export function normalizeBIC(bic: string | null | undefined): string | null {
  if (!bic || bic.trim() === '') return null;
  return bic.replace(/\s+/g, '').toUpperCase();
}

/**
 * Validate BIC format
 * BIC format: 6 letters (bank code) + 2 alphanumeric (country) + optional 3 alphanumeric (branch)
 */
export function validateBICFormat(bic: string): boolean {
  if (!bic) return false;
  // BIC can be 8 or 11 characters: AAAABBCC or AAAABBCCDDD
  const bicRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
  return bicRegex.test(bic);
}

/**
 * Basic email format check (not RFC 5322 compliant)
 * Checks for: local@domain.tld structure
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;

  // More strict: alphanumeric + some special chars, @ sign, domain, dot, tld
  const emailRegex = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Additional checks
  if (!emailRegex.test(email)) return false;
  if (email.includes('..')) return false; // No consecutive dots
  if (email.startsWith('.') || email.endsWith('.')) return false; // No leading/trailing dots

  return true;
}

/**
 * Validate currency code format (3 uppercase letters)
 * Note: This validates format only, not whether it's a real ISO 4217 code
 * Common supported currencies: EUR, USD, GBP, CHF, SEK, NOK, DKK, PLN, CZK, HUF
 */
export function validateCurrency(currency: string): boolean {
  if (!currency) return false;
  // Validate format: exactly 3 uppercase letters
  const currencyFormat = /^[A-Z]{3}$/;
  return currencyFormat.test(currency.toUpperCase());
}

/**
 * Validate amount
 */
export function validateAmount(amount: number | string, options: PaymentValidationOptions = {}): { valid: boolean; error?: string } {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return { valid: false, error: 'Amount must be a valid number' };
  }
  
  if (numAmount <= 0) {
    return { valid: false, error: 'Amount must be greater than 0' };
  }
  
  const minAmount = options.minAmount ?? 0.01;
  if (numAmount < minAmount) {
    return { valid: false, error: `Amount must be at least ${minAmount}` };
  }
  
  const maxAmount = options.maxAmount ?? 999999.99;
  if (numAmount > maxAmount) {
    return { valid: false, error: `Amount cannot exceed ${maxAmount}` };
  }
  
  // Check for reasonable decimal places (max 2 for currency)
  const decimalPlaces = (numAmount.toString().split('.')[1] || '').length;
  if (decimalPlaces > 2) {
    return { valid: false, error: 'Amount cannot have more than 2 decimal places' };
  }
  
  return { valid: true };
}

/**
 * Validate reference field
 */
export function validateReference(reference: string): { valid: boolean; error?: string } {
  if (!reference || reference.trim() === '') {
    return { valid: false, error: 'Reference is required' };
  }
  
  if (reference.length > 140) {
    return { valid: false, error: 'Reference cannot exceed 140 characters' };
  }
  
  // Character validation - only allow safe characters (whitelist approach)
  // Only allow: letters, numbers, spaces, and common safe punctuation (.-_,/)
  const validChars = /^[a-zA-Z0-9\s.\-_,/]+$/;
  if (!validChars.test(reference)) {
    return {
      valid: false,
      error: 'Reference contains invalid characters. Only letters, numbers, spaces, and .-_,/ are allowed'
    };
  }
  
  return { valid: true };
}

/**
 * Validate recipient name
 */
export function validateRecipientName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Recipient name is required' };
  }
  
  if (name.length > 100) {
    return { valid: false, error: 'Recipient name cannot exceed 100 characters' };
  }
  
  // Basic validation - should contain at least some letters
  if (!/[a-zA-Z]/.test(name)) {
    return { valid: false, error: 'Recipient name must contain letters' };
  }
  
  return { valid: true };
}

/**
 * Comprehensive payment data validation
 */
export function validatePaymentData(
  input: PaymentValidationInput,
  options: PaymentValidationOptions = {}
): PaymentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Normalize input data
  const normalizedIBAN = normalizeIBAN(input.iban);
  const normalizedBIC = normalizeBIC(input.bic);
  const currency = input.currency?.toUpperCase() || '';
  const amount = typeof input.amount === 'string' ? parseFloat(input.amount) : (input.amount || 0);
  const reference = input.reference?.trim() || '';
  const recipientName = input.recipientName?.trim() || '';
  const recipientEmail = input.recipientEmail?.trim() || null;
  
  // Validate IBAN
  if (!normalizedIBAN) {
    errors.push('IBAN is required');
  } else if (!validateIBAN(normalizedIBAN)) {
    errors.push('Invalid IBAN format or checksum');
  }
  
  // Validate BIC based on IBAN country
  const bicRequired = options.forceBICRequired || isBICRequired(normalizedIBAN);
  
  if (bicRequired && !normalizedBIC) {
    const countryCode = getIBANCountryCode(normalizedIBAN);
    if (countryCode === 'DE') {
      warnings.push('BIC is optional for German IBANs but recommended for faster processing');
    } else {
      errors.push('BIC is required for non-German IBANs');
    }
  } else if (normalizedBIC && !validateBICFormat(normalizedBIC)) {
    errors.push('Invalid BIC format');
  }
  
  // Validate amount
  const amountValidation = validateAmount(amount, options);
  if (!amountValidation.valid) {
    errors.push(amountValidation.error!);
  }
  
  // Validate currency
  if (!currency) {
    errors.push('Currency is required');
  } else if (!validateCurrency(currency)) {
    errors.push('Invalid or unsupported currency code');
  }
  
  // Validate reference
  const referenceValidation = validateReference(reference);
  if (!referenceValidation.valid) {
    errors.push(referenceValidation.error!);
  }
  
  // Validate recipient name
  const nameValidation = validateRecipientName(recipientName);
  if (!nameValidation.valid) {
    errors.push(nameValidation.error!);
  }
  
  // Validate recipient email
  if (recipientEmail) {
    if (!validateEmail(recipientEmail)) {
      errors.push('Invalid email format');
    }
  } else if (!options.allowEmptyEmail) {
    warnings.push('Recipient email is recommended for payment notifications');
  }
  
  // Create normalized data if validation passes
  let normalizedData: NormalizedPaymentData | undefined;
  if (errors.length === 0) {
    normalizedData = {
      iban: normalizedIBAN,
      bic: normalizedBIC,
      amount: amount,
      currency: currency,
      reference: reference,
      recipientName: recipientName,
      recipientEmail: recipientEmail,
    };
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    normalizedData
  };
}

/**
 * Quick validation function for simple use cases
 */
export function isValidPaymentData(input: PaymentValidationInput, options?: PaymentValidationOptions): boolean {
  return validatePaymentData(input, options).valid;
}

/**
 * Extract validation errors as a simple string array
 */
export function getValidationErrors(input: PaymentValidationInput, options?: PaymentValidationOptions): string[] {
  return validatePaymentData(input, options).errors;
}

/**
 * Utility function to check if BIC is required for a given IBAN
 * This is a re-export from iban-validation for convenience
 */
export { isBICRequired, validateIBAN, getIBANCountryCode, validateBICMatchesIBAN } from './iban-validation';
export type { BICIBANMatchResult } from './iban-validation';
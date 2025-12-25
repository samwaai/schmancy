/**
 * Comprehensive IBAN validation utilities
 * Implements proper mod-97 checksum validation and country-specific length checks
 */

// IBAN country code to length mapping (most common European countries)
const IBAN_LENGTHS: Record<string, number> = {
  'AD': 24, // Andorra
  'AT': 20, // Austria
  'AZ': 28, // Azerbaijan
  'BH': 22, // Bahrain
  'BE': 16, // Belgium
  'BA': 20, // Bosnia and Herzegovina
  'BR': 29, // Brazil
  'BG': 22, // Bulgaria
  'CR': 22, // Costa Rica
  'HR': 21, // Croatia
  'CY': 28, // Cyprus
  'CZ': 24, // Czech Republic
  'DK': 18, // Denmark
  'DO': 28, // Dominican Republic
  'EE': 20, // Estonia
  'FO': 18, // Faroe Islands
  'FI': 18, // Finland
  'FR': 27, // France
  'GE': 22, // Georgia
  'DE': 22, // Germany
  'GI': 23, // Gibraltar
  'GR': 27, // Greece
  'GL': 18, // Greenland
  'GT': 28, // Guatemala
  'HU': 28, // Hungary
  'IS': 26, // Iceland
  'IE': 22, // Ireland
  'IL': 23, // Israel
  'IT': 27, // Italy
  'JO': 30, // Jordan
  'KZ': 20, // Kazakhstan
  'XK': 20, // Kosovo
  'KW': 30, // Kuwait
  'LV': 21, // Latvia
  'LB': 28, // Lebanon
  'LI': 21, // Liechtenstein
  'LT': 20, // Lithuania
  'LU': 20, // Luxembourg
  'MK': 19, // North Macedonia
  'MT': 31, // Malta
  'MR': 27, // Mauritania
  'MU': 30, // Mauritius
  'MD': 24, // Moldova
  'MC': 27, // Monaco
  'ME': 22, // Montenegro
  'NL': 18, // Netherlands
  'NO': 15, // Norway
  'PK': 24, // Pakistan
  'PS': 29, // Palestine
  'PL': 28, // Poland
  'PT': 25, // Portugal
  'QA': 29, // Qatar
  'RO': 24, // Romania
  'SM': 27, // San Marino
  'SA': 24, // Saudi Arabia
  'RS': 22, // Serbia
  'SK': 24, // Slovakia
  'SI': 19, // Slovenia
  'ES': 24, // Spain
  'SE': 24, // Sweden
  'CH': 21, // Switzerland
  'TN': 24, // Tunisia
  'TR': 26, // Turkey
  'AE': 23, // United Arab Emirates
  'GB': 22, // United Kingdom
  'VG': 24, // British Virgin Islands
};

/**
 * Clean IBAN by removing spaces and converting to uppercase
 */
function cleanIBAN(iban: string): string {
  return iban.replace(/\s+/g, '').toUpperCase();
}

/**
 * Convert letters to numbers for mod-97 algorithm
 * A=10, B=11, ..., Z=35
 */
function letterToNumber(letter: string): string {
  return (letter.charCodeAt(0) - 55).toString();
}

/**
 * Rearrange IBAN for mod-97 calculation
 * Move first 4 characters to the end and convert letters to numbers
 */
function rearrangeForMod97(iban: string): string {
  // Move first 4 characters to the end
  const rearranged = iban.substring(4) + iban.substring(0, 4);
  
  // Convert letters to numbers
  return rearranged.replace(/[A-Z]/g, letterToNumber);
}

/**
 * Calculate mod-97 for large numbers (IBAN can be quite long)
 * Process in chunks to avoid JavaScript number precision issues
 */
function calculateMod97(numericString: string): number {
  let remainder = 0;
  
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i])) % 97;
  }
  
  return remainder;
}

/**
 * Validate IBAN checksum using mod-97 algorithm
 */
function validateIBANChecksum(iban: string): boolean {
  try {
    const rearranged = rearrangeForMod97(iban);
    const remainder = calculateMod97(rearranged);
    return remainder === 1;
  } catch (error) {
    return false;
  }
}

/**
 * Validate IBAN format (basic structure)
 */
function validateIBANFormat(iban: string): boolean {
  // IBAN should start with 2 letters (country code) followed by 2 digits (check digits)
  // followed by alphanumeric characters
  const ibanRegex = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/;
  return ibanRegex.test(iban);
}

/**
 * Validate IBAN length for the specific country
 */
function validateIBANLength(iban: string): boolean {
  const countryCode = iban.substring(0, 2);
  const expectedLength = IBAN_LENGTHS[countryCode];
  
  if (!expectedLength) {
    // Unknown country code - we can't validate length
    return false;
  }
  
  return iban.length === expectedLength;
}

/**
 * Complete IBAN validation
 * Validates format, length, and checksum
 */
export function validateIBAN(iban: string): boolean {
  if (!iban || typeof iban !== 'string') {
    return false;
  }
  
  const cleanedIBAN = cleanIBAN(iban);
  
  // Basic format validation
  if (!validateIBANFormat(cleanedIBAN)) {
    return false;
  }
  
  // Length validation
  if (!validateIBANLength(cleanedIBAN)) {
    return false;
  }
  
  // Checksum validation (mod-97)
  return validateIBANChecksum(cleanedIBAN);
}

/**
 * Check if BIC is required for the given IBAN
 * Currently, only German IBANs don't require BIC for SEPA transfers
 */
export function isBICRequired(iban: string): boolean {
  if (!iban || typeof iban !== 'string') {
    return true;
  }
  
  const cleanedIBAN = cleanIBAN(iban);
  return !cleanedIBAN.startsWith('DE');
}

/**
 * Get the country code from an IBAN
 */
export function getIBANCountryCode(iban: string): string | null {
  if (!iban || typeof iban !== 'string') {
    return null;
  }
  
  const cleanedIBAN = cleanIBAN(iban);
  if (cleanedIBAN.length < 2) {
    return null;
  }
  
  return cleanedIBAN.substring(0, 2);
}

/**
 * Get validation details for debugging/error messages
 */
export interface IBANValidationResult {
  valid: boolean;
  formatValid: boolean;
  lengthValid: boolean;
  checksumValid: boolean;
  countryCode: string | null;
  expectedLength: number | null;
  actualLength: number;
}

export function validateIBANDetailed(iban: string): IBANValidationResult {
  const result: IBANValidationResult = {
    valid: false,
    formatValid: false,
    lengthValid: false,
    checksumValid: false,
    countryCode: null,
    expectedLength: null,
    actualLength: 0,
  };
  
  if (!iban || typeof iban !== 'string') {
    return result;
  }
  
  const cleanedIBAN = cleanIBAN(iban);
  result.actualLength = cleanedIBAN.length;
  result.countryCode = getIBANCountryCode(cleanedIBAN);
  
  if (result.countryCode) {
    result.expectedLength = IBAN_LENGTHS[result.countryCode] || null;
  }
  
  result.formatValid = validateIBANFormat(cleanedIBAN);
  result.lengthValid = validateIBANLength(cleanedIBAN);
  result.checksumValid = result.formatValid && result.lengthValid ? validateIBANChecksum(cleanedIBAN) : false;
  
  result.valid = result.formatValid && result.lengthValid && result.checksumValid;
  
  return result;
}

/**
 * Format IBAN for display (add spaces every 4 characters)
 */
export function formatIBANForDisplay(iban: string): string {
  if (!iban || typeof iban !== 'string') {
    return '';
  }

  const cleanedIBAN = cleanIBAN(iban);
  return cleanedIBAN.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Validate that BIC country code matches IBAN country code
 * BIC format: BANKCCXX where CC is the country code (positions 4-5)
 * IBAN format: CC... where CC is the country code (positions 0-1)
 */
export interface BICIBANMatchResult {
  valid: boolean;
  error?: string;
  ibanCountry?: string;
  bicCountry?: string;
}

export function validateBICMatchesIBAN(iban: string, bic?: string): BICIBANMatchResult {
  if (!bic || !bic.trim()) {
    return { valid: true }; // No BIC to validate
  }

  if (!iban || !iban.trim()) {
    return { valid: true }; // No IBAN to compare against
  }

  const cleanedIBAN = cleanIBAN(iban);
  const cleanedBIC = bic.replace(/\s/g, '').toUpperCase();

  // BIC must be at least 8 characters
  if (cleanedBIC.length < 8) {
    return { valid: true }; // Invalid BIC format, let other validation handle it
  }

  const ibanCountry = cleanedIBAN.substring(0, 2);
  const bicCountry = cleanedBIC.substring(4, 6); // BIC format: BANKCCXX

  if (ibanCountry !== bicCountry) {
    return {
      valid: false,
      error: `BIC country (${bicCountry}) does not match IBAN country (${ibanCountry})`,
      ibanCountry,
      bicCountry
    };
  }

  return { valid: true, ibanCountry, bicCountry };
}
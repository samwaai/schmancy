/**
 * Utility for normalizing NGTeco date formats
 * NGTeco API may return dates in different formats:
 * - Old format: "YYYY-MM-DD " (with trailing space)
 * - New format: "MM/DD/YYYY"
 * 
 * This utility ensures consistent YYYY-MM-DD format across the system
 */

/**
 * Normalize NGTeco date string to YYYY-MM-DD format
 * 
 * @param dateStr - The date string from NGTeco API
 * @returns Normalized date in YYYY-MM-DD format
 * 
 * @example
 * normalizeNgtecoDate("2025-01-31 ") // Returns "2025-01-31"
 * normalizeNgtecoDate("09/04/2025") // Returns "2025-09-04"
 * normalizeNgtecoDate("12/31/2024") // Returns "2024-12-31"
 */
export function normalizeNgtecoDate(dateStr: string): string {
  let normalized = dateStr.trim();
  
  // Handle MM/DD/YYYY format
  if (normalized.includes('/')) {
    const [month, day, year] = normalized.split('/');
    normalized = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  } else {
    // Handle YYYY-MM-DD format (with or without trailing space)
    normalized = normalized.split(' ')[0];
  }
  
  return normalized;
}

/**
 * Format date for NGTeco API compatibility (adds trailing space)
 * Some parts of the system may expect the old format with trailing space
 * 
 * @param dateStr - The normalized date string
 * @returns Date string with trailing space for compatibility
 * 
 * @example
 * formatForNgtecoCompatibility("2025-01-31") // Returns "2025-01-31 "
 */
export function formatForNgtecoCompatibility(dateStr: string): string {
  if (!dateStr.endsWith(' ')) {
    return dateStr + ' ';
  }
  return dateStr;
}

/**
 * Check if a date string is in the new MM/DD/YYYY format
 * 
 * @param dateStr - The date string to check
 * @returns True if the date is in MM/DD/YYYY format
 */
export function isNewNgtecoFormat(dateStr: string): boolean {
  return dateStr.includes('/');
}

/**
 * Parse and validate a NGTeco date string
 * 
 * @param dateStr - The date string from NGTeco API
 * @returns Object with normalized date and format info
 */
export function parseNgtecoDate(dateStr: string): {
  normalized: string;
  isNewFormat: boolean;
  original: string;
} {
  const isNewFormat = isNewNgtecoFormat(dateStr);
  const normalized = normalizeNgtecoDate(dateStr);
  
  return {
    normalized,
    isNewFormat,
    original: dateStr
  };
}
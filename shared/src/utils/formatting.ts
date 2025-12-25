/**
 * Shared formatting utilities for consistent display across the application
 */

/**
 * Formats decimal hours to human-readable format
 * @param hours - Number of hours as decimal (e.g., 11.5)
 * @returns Formatted string (e.g., "11h 30m")
 */
export function formatHoursDisplay(hours: number): string {
  if (hours === 0) return '0h 0m';
  
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

/**
 * Formats currency amounts with proper symbol and decimals
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '€')
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = '€', decimals: number = 2): string {
  const formatted = amount.toFixed(decimals);
  return `${currency}${formatted}`;
}

/**
 * Formats percentage values
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @param includeSign - Whether to include % sign (default: true)
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number, decimals: number = 1, includeSign: boolean = true): string {
  const formatted = value.toFixed(decimals);
  return includeSign ? `${formatted}%` : formatted;
}

/**
 * Formats file sizes in human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number): string {
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
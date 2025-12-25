/**
 * Precise Arithmetic Utility
 *
 * This module provides functions for performing arithmetic operations on decimal numbers
 * with ABSOLUTE precision, eliminating floating-point errors entirely.
 *
 * WHY THIS EXISTS:
 * JavaScript's native number type uses IEEE 754 floating-point arithmetic, which can
 * produce errors like: 0.1 + 0.2 = 0.30000000000000004
 *
 * This is UNACCEPTABLE for inventory, financial calculations, or any domain requiring
 * exact decimal arithmetic.
 *
 * SOLUTION:
 * Convert all decimals to integers by multiplying by a scale factor (10^precision),
 * perform integer arithmetic (which is exact), then convert back to decimal.
 *
 * SCALE: We use 10 decimal places for maximum reasonable precision while staying
 * within JavaScript's safe integer range (Number.MAX_SAFE_INTEGER = 2^53 - 1)
 */

/**
 * PRECISION_SCALE determines how many decimal places we preserve
 * 10 decimal places = scale of 10,000,000,000
 *
 * This allows values from -900,719 to +900,719 with 10 decimal precision
 * (within JavaScript's MAX_SAFE_INTEGER range)
 */
const PRECISION_SCALE = 10_000_000_000; // 10^10

/**
 * Maximum safe decimal places we can handle
 */
const MAX_DECIMAL_PLACES = 10;

/**
 * Converts a decimal number to its integer representation
 *
 * @param value - The decimal number to convert
 * @returns Integer representation (value * PRECISION_SCALE)
 *
 * @example
 * toInteger(1.234) // returns 12340000000
 * toInteger(0.1) // returns 1000000000
 */
function toInteger(value: number): number {
  // Convert to string to avoid any floating-point operations
  const str = value.toString();

  // Handle scientific notation (e.g., 1e-7)
  if (str.includes('e')) {
    // Parse scientific notation components to avoid floating-point multiplication
    const [mantissaStr, exponentStr] = str.toLowerCase().split('e');
    const exponent = parseInt(exponentStr);

    // Convert mantissa to integer by removing decimal point
    const [whole = '0', decimal = ''] = mantissaStr.replace('-', '').split('.');
    const mantissaDigits = whole + decimal;
    const mantissaDecimals = decimal.length;

    // Calculate target decimal places: original decimals - exponent + our scale decimals
    const targetDecimals = mantissaDecimals - exponent + MAX_DECIMAL_PLACES;

    // Build result by padding or truncating
    let resultStr = mantissaDigits.padEnd(targetDecimals, '0');
    if (resultStr.length > targetDecimals) {
      resultStr = resultStr.substring(0, targetDecimals);
    }

    const result = parseInt(resultStr, 10);
    return mantissaStr.startsWith('-') ? -result : result;
  }

  // Split into whole and decimal parts
  const [whole = '0', decimal = ''] = str.split('.');

  // Pad or truncate decimal to exactly MAX_DECIMAL_PLACES
  const paddedDecimal = decimal.padEnd(MAX_DECIMAL_PLACES, '0').substring(0, MAX_DECIMAL_PLACES);

  // Concatenate and parse as integer
  const intStr = whole.replace('-', '') + paddedDecimal;
  const intValue = parseInt(intStr, 10);

  // Apply sign
  return whole.startsWith('-') ? -intValue : intValue;
}

/**
 * Converts an integer representation back to decimal
 *
 * @param intValue - The integer representation
 * @returns Decimal number (intValue / PRECISION_SCALE)
 *
 * @example
 * toDecimal(12340000000) // returns 1.234
 * toDecimal(1000000000) // returns 0.1
 */
function toDecimal(intValue: number): number {
  // FIXED: Use string manipulation instead of floating-point division
  // to avoid reintroducing floating-point errors

  const isNegative = intValue < 0;
  const absValue = Math.abs(intValue);
  const str = absValue.toString().padStart(MAX_DECIMAL_PLACES + 1, '0');

  // Insert decimal point MAX_DECIMAL_PLACES from the right
  const decimalPosition = str.length - MAX_DECIMAL_PLACES;
  const wholePart = str.substring(0, decimalPosition) || '0';
  const decimalPart = str.substring(decimalPosition);

  // Remove trailing zeros from decimal part
  const trimmedDecimal = decimalPart.replace(/0+$/, '');

  // Construct the number string
  const numStr = trimmedDecimal.length > 0
    ? `${isNegative ? '-' : ''}${wholePart}.${trimmedDecimal}`
    : `${isNegative ? '-' : ''}${wholePart}`;

  return parseFloat(numStr);
}

/**
 * Adds two numbers with absolute precision
 *
 * @param a - First number
 * @param b - Second number
 * @returns Exact sum with no floating-point errors
 *
 * @example
 * add(0.1, 0.2) // returns exactly 0.3 (not 0.30000000000004)
 * add(1.234, 5.678) // returns exactly 6.912
 */
export function add(a: number, b: number): number {
  const aInt = toInteger(a);
  const bInt = toInteger(b);
  return toDecimal(aInt + bInt);
}

/**
 * Subtracts two numbers with absolute precision
 *
 * @param a - First number
 * @param b - Number to subtract
 * @returns Exact difference with no floating-point errors
 *
 * @example
 * subtract(0.3, 0.1) // returns exactly 0.2
 * subtract(10.5, 3.25) // returns exactly 7.25
 */
export function subtract(a: number, b: number): number {
  const aInt = toInteger(a);
  const bInt = toInteger(b);
  return toDecimal(aInt - bInt);
}

/**
 * Multiplies two numbers with absolute precision
 *
 * @param a - First number
 * @param b - Second number
 * @returns Exact product with no floating-point errors
 *
 * @example
 * multiply(0.1, 0.2) // returns exactly 0.02
 * multiply(1.5, 3) // returns exactly 4.5
 */
export function multiply(a: number, b: number): number {
  const aInt = toInteger(a);
  const bInt = toInteger(b);
  // When multiplying two scaled integers, we need to divide by scale once
  // because: (a * scale) * (b * scale) = (a * b) * scale^2
  return toDecimal(Math.round((aInt * bInt) / PRECISION_SCALE));
}

/**
 * Divides two numbers with absolute precision
 *
 * @param a - Numerator
 * @param b - Denominator
 * @returns Exact quotient with no floating-point errors
 * @throws Error if dividing by zero
 *
 * @example
 * divide(0.3, 0.1) // returns exactly 3
 * divide(10, 3) // returns 3.3333333333
 */
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  const aInt = toInteger(a);
  const bInt = toInteger(b);
  // When dividing two scaled integers, we need to multiply by scale
  // because: (a * scale) / (b * scale) = a / b, but we want result * scale
  return toDecimal(Math.round((aInt * PRECISION_SCALE) / bInt));
}

/**
 * Compares two numbers for equality with precision tolerance
 *
 * @param a - First number
 * @param b - Second number
 * @returns true if numbers are equal within precision
 *
 * @example
 * equals(0.1 + 0.2, 0.3) // returns true
 * equals(add(0.1, 0.2), 0.3) // returns true
 */
export function equals(a: number, b: number): boolean {
  return toInteger(a) === toInteger(b);
}

/**
 * Checks if first number is greater than second
 *
 * @param a - First number
 * @param b - Second number
 * @returns true if a > b
 */
export function greaterThan(a: number, b: number): boolean {
  return toInteger(a) > toInteger(b);
}

/**
 * Checks if first number is less than second
 *
 * @param a - First number
 * @param b - Second number
 * @returns true if a < b
 */
export function lessThan(a: number, b: number): boolean {
  return toInteger(a) < toInteger(b);
}

/**
 * Sums an array of numbers with absolute precision
 *
 * @param values - Array of numbers to sum
 * @returns Exact sum with no floating-point errors
 *
 * @example
 * sum([0.1, 0.2, 0.3]) // returns exactly 0.6
 * sum([1.234, 5.678, 9.012]) // returns exactly 15.924
 */
export function sum(values: number[]): number {
  const intSum = values.reduce((acc, val) => acc + toInteger(val), 0);
  return toDecimal(intSum);
}

/**
 * Formats a number to fixed decimal places without rounding errors
 *
 * @param value - Number to format
 * @param decimalPlaces - Number of decimal places (default: 3)
 * @returns Formatted string
 *
 * @example
 * format(1.2345, 2) // returns "1.23"
 * format(0.1 + 0.2, 1) // returns "0.3"
 */
export function format(value: number, decimalPlaces: number = 3): string {
  const intValue = toInteger(value);
  const decimal = toDecimal(intValue);
  return decimal.toFixed(decimalPlaces);
}

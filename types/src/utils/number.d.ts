export declare class Numbers {
    /**
     * Rounds a number to the specified number of decimal places.
     * @param {number} number - The number to round.
     * @param {number} [decimalPlaces=2] - The number of decimal places to round to.
     * @returns {number} - The rounded number.
     */
    roundNumber(number: number, decimalPlaces?: number): number;
    /**
     * Formats a number according to the specified locale and options.
     * @param {number} number - The number to format.
     * @param {string} [locale='de-DE'] - The locale string (e.g., 'de-DE' for German).
     * @param {Intl.NumberFormatOptions} [options={}] - Additional formatting options.
     * @returns {string} - The formatted number as a string.
     */
    formatNumber(number: number, locale?: string, options?: Intl.NumberFormatOptions): string;
    /**
     * Parses a string with a specified decimal separator into a number.
     * @param {string} numberString - The string to parse.
     * @param {string} [decimalSeparator=','] - The decimal separator used in the string.
     * @returns {number} - The parsed number.
     */
    parseToPureNumber(numberString: string, decimalSeparator?: string): number;
    /**
     * Rounds a number to the specified decimal places and formats it according to the specified locale and options.
     * @param {number} number - The number to process.
     * @param {number} [decimalPlaces=2] - The number of decimal places to round to.
     * @param {string} [locale='de-DE'] - The locale string.
     * @param {Intl.NumberFormatOptions} [options={}] - Additional formatting options.
     * @returns {string} - The formatted number as a string.
     */
    doIt(number: number, decimalPlaces?: number, locale?: string, options?: Intl.NumberFormatOptions): string;
    /**
     * Format a currency amount consistently across the application
     *
     * @param amount The amount to format
     * @param currency The currency symbol to display (default: '€')
     * @returns Formatted amount with currency symbol
     */
    formatCurrency(amount: number, currency?: string): string;
    /**
     * Format a delta value with appropriate directional indicator
     *
     * @param delta The delta amount to format
     * @param currency The currency symbol to display (default: '€')
     * @returns Formatted delta with direction indicator and currency symbol
     */
    formatDelta(delta: number, currency?: string): string;
    /**
     * Get CSS class for delta value
     *
     * @param delta The delta amount
     * @returns CSS class based on delta direction
     */
    getDeltaClass(delta: number): string;
    /**
     * Converts a decimal number to a mixed fraction string
     * For example: 1.5 becomes "1 1/2", 2.25 becomes "2 1/4"
     *
     * @param number The decimal number to convert
     * @param precision The precision level for fraction approximation (default: 16)
     * @param maxDenominator The maximum allowed denominator (default: 4)
     * @returns A string representing the mixed fraction
     */
    toMixedFraction(number: number, precision?: number, maxDenominator?: number): string;
    /**
     * Converts a decimal to a simplified fraction with a maximum denominator
     *
     * @param decimal The decimal part to convert (0 <= decimal < 1)
     * @param precision The precision level for approximation
     * @param maxDenominator The maximum allowed denominator (default: 4)
     * @returns Object containing numerator and denominator
     */
    private decimalToFraction;
    /**
     * Calculates the greatest common divisor of two numbers
     */
    private findGCD;
    /**
     * Alternative method to get a formatted mixed fraction with a specified format
     *
     * @param number The decimal number to convert
     * @param format The format specification ('unicode', 'ascii', 'superscript')
     * @param precision The precision level for fraction approximation
     * @param maxDenominator The maximum allowed denominator (default: 4)
     * @returns A formatted string representing the mixed fraction
     */
    formatMixedFraction(number: number, format?: "unicode" | "ascii" | "superscript", precision?: number, maxDenominator?: number): string;
    /**
     * Gets the Unicode fraction character if available
     *
     * @param numerator The numerator
     * @param denominator The denominator
     * @returns Unicode fraction character or null if not available
     */
    private getUnicodeFraction;
    /**
     * Converts digits to superscript
     */
    private toSuperscript;
    /**
     * Converts digits to subscript
     */
    private toSubscript;
}
declare const numbers: Numbers;
export default numbers;

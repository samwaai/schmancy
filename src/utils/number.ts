export class Numbers {
  /**
   * Rounds a number to the specified number of decimal places.
   * @param {number} number - The number to round.
   * @param {number} [decimalPlaces=2] - The number of decimal places to round to.
   * @returns {number} - The rounded number.
   */
  roundNumber(number: number, decimalPlaces: number = 2): number {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
  }

  /**
   * Formats a number according to the specified locale and options.
   * @param {number} number - The number to format.
   * @param {string} [locale='de-DE'] - The locale string (e.g., 'de-DE' for German).
   * @param {Intl.NumberFormatOptions} [options={}] - Additional formatting options.
   * @returns {string} - The formatted number as a string.
   */
  formatNumber(
    number: number,
    locale: string = "de-DE",
    options: Intl.NumberFormatOptions = {},
  ): string {
    return new Intl.NumberFormat(locale, options).format(number);
  }

  /**
   * Parses a string with a specified decimal separator into a number.
   * @param {string} numberString - The string to parse.
   * @param {string} [decimalSeparator=','] - The decimal separator used in the string.
   * @returns {number} - The parsed number.
   */
  parseToPureNumber(
    numberString: string,
    decimalSeparator: string = ",",
  ): number {
    const normalizedString = numberString.replace(decimalSeparator, ".");
    return parseFloat(normalizedString);
  }

  /**
   * Rounds a number to the specified decimal places and formats it according to the specified locale and options.
   * @param {number} number - The number to process.
   * @param {number} [decimalPlaces=2] - The number of decimal places to round to.
   * @param {string} [locale='de-DE'] - The locale string.
   * @param {Intl.NumberFormatOptions} [options={}] - Additional formatting options.
   * @returns {string} - The formatted number as a string.
   */
  doIt(
    number: number,
    decimalPlaces: number = 2,
    locale: string = "de-DE",
    options: Intl.NumberFormatOptions = {},
  ): string {
    const roundedNumber = this.roundNumber(number, decimalPlaces);
    return this.formatNumber(roundedNumber, locale, options);
  }

  /**
   * Format a currency amount consistently across the application
   *
   * @param amount The amount to format
   * @param currency The currency symbol to display (default: '€')
   * @returns Formatted amount with currency symbol
   */
  formatCurrency(amount: number, currency: string = "€"): string {
    return `${currency}${this.doIt(amount)}`;
  }

  /**
   * Format a delta value with appropriate directional indicator
   *
   * @param delta The delta amount to format
   * @param currency The currency symbol to display (default: '€')
   * @returns Formatted delta with direction indicator and currency symbol
   */
  formatDelta(delta: number, currency: string = "€"): string {
    const symbol = delta > 0 ? "↑" : delta < 0 ? "↓" : "→";
    return `${symbol} ${currency}${this.doIt(Math.abs(delta))}`;
  }

  /**
   * Get CSS class for delta value
   *
   * @param delta The delta amount
   * @returns CSS class based on delta direction
   */
  getDeltaClass(delta: number): string {
    return delta > 0
      ? "text-error-default"
      : delta < 0
        ? "text-primary-default"
        : "text-neutral";
  }

  /**
   * Converts a decimal number to a mixed fraction string
   * For example: 1.5 becomes "1 1/2", 2.25 becomes "2 1/4"
   *
   * @param number The decimal number to convert
   * @param precision The precision level for fraction approximation (default: 16)
   * @param maxDenominator The maximum allowed denominator (default: 4)
   * @returns A string representing the mixed fraction
   */
  toMixedFraction(
    number: number,
    precision: number = 16,
    maxDenominator: number = 4,
  ): string {
    // Handle negative numbers
    const isNegative = number < 0;
    number = Math.abs(number);

    // Extract whole number part
    const wholePart = Math.floor(number);

    // Extract decimal part and convert to fraction
    let decimalPart = number - wholePart;

    // If the decimal part is very small or zero, just return the whole number
    if (decimalPart < 1 / Math.pow(10, precision)) {
      return isNegative ? `-${wholePart}` : `${wholePart}`;
    }

    // Find the best fraction approximation using precision and max denominator
    const { numerator, denominator } = this.decimalToFraction(
      decimalPart,
      precision,
      maxDenominator,
    );

    // Format based on whether there's a whole part
    if (wholePart === 0) {
      return isNegative
        ? `-${numerator}/${denominator}`
        : `${numerator}/${denominator}`;
    } else {
      return isNegative
        ? `-${wholePart} ${numerator}/${denominator}`
        : `${wholePart} ${numerator}/${denominator}`;
    }
  }

  /**
   * Converts a decimal to a simplified fraction with a maximum denominator
   *
   * @param decimal The decimal part to convert (0 <= decimal < 1)
   * @param precision The precision level for approximation
   * @param maxDenominator The maximum allowed denominator (default: 4)
   * @returns Object containing numerator and denominator
   */
  private decimalToFraction(
    decimal: number,
    precision: number,
    maxDenominator: number = 4,
  ): { numerator: number; denominator: number } {
    if (decimal === 0) {
      return { numerator: 0, denominator: 1 };
    }

    // Initialize best approximation
    let bestError = Infinity;
    let bestNumerator = 0;
    let bestDenominator = 1;

    // Check common fractions first for better user experience
    // Filter to only include fractions with denominators <= maxDenominator
    const commonFractions = [
      { n: 1, d: 2 }, // 1/2
      { n: 1, d: 3 }, // 1/3
      { n: 2, d: 3 }, // 2/3
      { n: 1, d: 4 }, // 1/4
      { n: 3, d: 4 }, // 3/4
    ];

    // Add additional fractions only if maxDenominator allows
    const additionalFractions = [];
    if (maxDenominator >= 5) {
      additionalFractions.push(
        { n: 1, d: 5 }, // 1/5
        { n: 2, d: 5 }, // 2/5
        { n: 3, d: 5 }, // 3/5
        { n: 4, d: 5 }, // 4/5
      );
    }
    if (maxDenominator >= 6) {
      additionalFractions.push(
        { n: 1, d: 6 }, // 1/6
        { n: 5, d: 6 }, // 5/6
      );
    }
    if (maxDenominator >= 8) {
      additionalFractions.push(
        { n: 1, d: 8 }, // 1/8
        { n: 3, d: 8 }, // 3/8
        { n: 5, d: 8 }, // 5/8
        { n: 7, d: 8 }, // 7/8
      );
    }
    if (maxDenominator >= 10) {
      additionalFractions.push(
        { n: 1, d: 10 }, // 1/10
        { n: 3, d: 10 }, // 3/10
        { n: 7, d: 10 }, // 7/10
        { n: 9, d: 10 }, // 9/10
      );
    }
    if (maxDenominator >= 12) {
      additionalFractions.push(
        { n: 1, d: 12 }, // 1/12
        { n: 5, d: 12 }, // 5/12
        { n: 7, d: 12 }, // 7/12
        { n: 11, d: 12 }, // 11/12
      );
    }
    if (maxDenominator >= 16) {
      additionalFractions.push(
        { n: 1, d: 16 }, // 1/16
        { n: 3, d: 16 }, // 3/16
        { n: 5, d: 16 }, // 5/16
        { n: 7, d: 16 }, // 7/16
        { n: 9, d: 16 }, // 9/16
        { n: 11, d: 16 }, // 11/16
        { n: 13, d: 16 }, // 13/16
        { n: 15, d: 16 }, // 15/16
      );
    }

    // Combine all applicable fractions
    const allFractions = [...commonFractions, ...additionalFractions];

    // Check common fractions first
    for (const frac of allFractions) {
      if (frac.d <= maxDenominator) {
        const error = Math.abs(decimal - frac.n / frac.d);
        if (error < bestError) {
          bestError = error;
          bestNumerator = frac.n;
          bestDenominator = frac.d;

          // If we're very close to a common fraction, just use it
          if (error < 1 / Math.pow(10, precision)) {
            return { numerator: frac.n, denominator: frac.d };
          }
        }
      }
    }

    // If no suitable common fraction found, use a more sophisticated approach
    // for denominators up to maxDenominator

    // Find the best approximation with denominator <= maxDenominator
    for (let d = 1; d <= maxDenominator; d++) {
      // Find best numerator for this denominator
      const n = Math.round(decimal * d);
      const error = Math.abs(decimal - n / d);

      if (error < bestError) {
        bestError = error;
        bestNumerator = n;
        bestDenominator = d;
      }
    }

    // Only use continued fraction expansion if we're significantly off
    // and maxDenominator allows for larger denominators
    if (bestError > 1 / Math.pow(10, precision / 2) && maxDenominator > 4) {
      // Implementation of continued fraction expansion
      let n1 = 1,
        n2 = 0;
      let d1 = 0,
        d2 = 1;
      let b = decimal;

      do {
        let a = Math.floor(b);
        let aux = n1;
        n1 = a * n1 + n2;
        n2 = aux;

        aux = d1;
        d1 = a * d1 + d2;
        d2 = aux;

        b = 1 / (b - a);

        // Calculate the current approximation
        const currentError = Math.abs(decimal - n1 / d1);

        // If we hit the precision limit or if the denominator gets too large, use this approximation
        if (currentError < 1 / Math.pow(10, precision) || d1 > maxDenominator) {
          // If d1 exceeds maxDenominator, return the previous best result
          if (d1 > maxDenominator) {
            return { numerator: bestNumerator, denominator: bestDenominator };
          }

          // Otherwise return this result
          return { numerator: n1, denominator: d1 };
        }
      } while (b !== Infinity);

      bestNumerator = n1;
      bestDenominator = d1;
    }

    // Simplify the fraction
    const gcd = this.findGCD(bestNumerator, bestDenominator);
    return {
      numerator: bestNumerator / gcd,
      denominator: bestDenominator / gcd,
    };
  }

  /**
   * Calculates the greatest common divisor of two numbers
   */
  private findGCD(a: number, b: number): number {
    return b === 0 ? a : this.findGCD(b, a % b);
  }

  /**
   * Alternative method to get a formatted mixed fraction with a specified format
   *
   * @param number The decimal number to convert
   * @param format The format specification ('unicode', 'ascii', 'superscript')
   * @param precision The precision level for fraction approximation
   * @param maxDenominator The maximum allowed denominator (default: 4)
   * @returns A formatted string representing the mixed fraction
   */
  formatMixedFraction(
    number: number,
    format: "unicode" | "ascii" | "superscript" = "ascii",
    precision: number = 16,
    maxDenominator: number = 4,
  ): string {
    // Get the basic mixed fraction
    const basicFraction = this.toMixedFraction(
      number,
      precision,
      maxDenominator,
    );

    // If the format is ascii, just return the basic fraction
    if (format === "ascii") {
      return basicFraction;
    }

    // For unicode and superscript formats, we need to parse the basic fraction
    const isNegative = basicFraction.startsWith("-");
    const withoutSign = isNegative ? basicFraction.substring(1) : basicFraction;

    // Check if it's a pure fraction or mixed fraction
    const hasMixedPart = withoutSign.includes(" ");

    if (!withoutSign.includes("/")) {
      // If there's no fraction part, just return the number
      return basicFraction;
    }

    let wholePart = "";
    let fractionPart = withoutSign;

    if (hasMixedPart) {
      // Split the whole and fraction parts
      const parts = withoutSign.split(" ");
      wholePart = parts[0];
      fractionPart = parts[1];
    }

    // Split the fraction part into numerator and denominator
    const [numerator, denominator] = fractionPart.split("/");

    if (format === "unicode") {
      // Try to find a unicode fraction character
      const unicodeFraction = this.getUnicodeFraction(
        parseInt(numerator),
        parseInt(denominator),
      );

      if (unicodeFraction) {
        return isNegative
          ? `-${wholePart}${hasMixedPart ? " " : ""}${unicodeFraction}`
          : `${wholePart}${hasMixedPart ? " " : ""}${unicodeFraction}`;
      }

      // Fallback to basic format if no unicode fraction is available
      return basicFraction;
    }

    // Handle superscript format
    if (format === "superscript") {
      const superNumerator = this.toSuperscript(numerator);
      const subDenominator = this.toSubscript(denominator);

      if (hasMixedPart) {
        return isNegative
          ? `-${wholePart} ${superNumerator}⁄${subDenominator}`
          : `${wholePart} ${superNumerator}⁄${subDenominator}`;
      } else {
        return isNegative
          ? `-${superNumerator}⁄${subDenominator}`
          : `${superNumerator}⁄${subDenominator}`;
      }
    }

    // Fallback to basic format
    return basicFraction;
  }

  /**
   * Gets the Unicode fraction character if available
   *
   * @param numerator The numerator
   * @param denominator The denominator
   * @returns Unicode fraction character or null if not available
   */
  private getUnicodeFraction(
    numerator: number,
    denominator: number,
  ): string | null {
    // Map common fractions to their Unicode characters
    const fractionMap: Record<string, string> = {
      "1/4": "¼",
      "1/2": "½",
      "3/4": "¾",
      "1/3": "⅓",
      "2/3": "⅔",
      "1/5": "⅕",
      "2/5": "⅖",
      "3/5": "⅗",
      "4/5": "⅘",
      "1/6": "⅙",
      "5/6": "⅚",
      "1/7": "⅐",
      "1/8": "⅛",
      "3/8": "⅜",
      "5/8": "⅝",
      "7/8": "⅞",
      "1/9": "⅑",
      "1/10": "⅒",
    };

    const key = `${numerator}/${denominator}`;
    return fractionMap[key] || null;
  }

  /**
   * Converts digits to superscript
   */
  private toSuperscript(str: string): string {
    const superscriptMap: Record<string, string> = {
      "0": "⁰",
      "1": "¹",
      "2": "²",
      "3": "³",
      "4": "⁴",
      "5": "⁵",
      "6": "⁶",
      "7": "⁷",
      "8": "⁸",
      "9": "⁹",
      "-": "⁻",
    };

    return str
      .split("")
      .map((char) => superscriptMap[char] || char)
      .join("");
  }

  /**
   * Converts digits to subscript
   */
  private toSubscript(str: string): string {
    const subscriptMap: Record<string, string> = {
      "0": "₀",
      "1": "₁",
      "2": "₂",
      "3": "₃",
      "4": "₄",
      "5": "₅",
      "6": "₆",
      "7": "₇",
      "8": "₈",
      "9": "₉",
      "-": "₋",
    };

    return str
      .split("")
      .map((char) => subscriptMap[char] || char)
      .join("");
  }
}



const numbers = new Numbers()

export default numbers
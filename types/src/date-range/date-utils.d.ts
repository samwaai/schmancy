type DateFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm';
/**
 * Validates if the initial date range values are in the expected format.
 *
 * @param dateFrom The dateFrom value to validate.
 * @param dateTo The dateTo value to validate.
 * @param expectedFormat The expected date format.
 * @returns An object indicating whether each date is valid, and the formatted date or null if invalid.
 */
declare function validateInitialDateRange(dateFrom: string | undefined, dateTo: string | undefined, expectedFormat: DateFormat): {
    dateFrom: string | null;
    dateTo: string | null;
    isValid: boolean;
};
export { validateInitialDateRange };

import dayjs from 'dayjs'

type DateFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm'

/**
 * Ensures that a date string conforms to a specific format.
 * If the date is already in the correct format, it returns the original string.
 * If the date is in a different format, it attempts to convert it to the specified format.
 * If the date is invalid or cannot be converted, it returns null.
 *
 * @param dateString The date string to validate and format.
 * @param expectedFormat The expected date format (e.g., 'YYYY-MM-DD', 'YYYY-MM-DDTHH:mm').
 * @returns The formatted date string, or null if the date is invalid.
 */
function enforceDateFormat(dateString: string | undefined, expectedFormat: DateFormat): string | null {
	if (!dateString) {
		return null // Or handle the undefined case differently if needed
	}

	const parsedDate = dayjs(dateString)

	if (!parsedDate.isValid()) {
		return null // Date is invalid
	}

	return parsedDate.format(expectedFormat)
}

/**
 * Validates if the initial date range values are in the expected format.
 *
 * @param dateFrom The dateFrom value to validate.
 * @param dateTo The dateTo value to validate.
 * @param expectedFormat The expected date format.
 * @returns An object indicating whether each date is valid, and the formatted date or null if invalid.
 */
function validateInitialDateRange(
	dateFrom: string | undefined,
	dateTo: string | undefined,
	expectedFormat: DateFormat,
): {
	dateFrom: string | null
	dateTo: string | null
	isValid: boolean
} {
	const formattedDateFrom = enforceDateFormat(dateFrom, expectedFormat)
	const formattedDateTo = enforceDateFormat(dateTo, expectedFormat)

	const isValid = formattedDateFrom !== null && formattedDateTo !== null

	return {
		dateFrom: formattedDateFrom,
		dateTo: formattedDateTo,
		isValid,
	}
}

export { validateInitialDateRange }

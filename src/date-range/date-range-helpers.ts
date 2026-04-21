import dayjs from 'dayjs'

/**
 * Format a date range into a human-readable string
 */
export function formatDateRange(
	fromValue: string,
	toValue: string,
	type: 'date' | 'datetime-local',
	placeholder: string
): string {
	if (!fromValue || !toValue) {
		return placeholder
	}

	const fromDate = dayjs(fromValue)
	const toDate = dayjs(toValue)

	if (!fromDate.isValid() || !toDate.isValid()) {
		return placeholder
	}

	// Format times if needed (for datetime-local)
	const fromTime = type === 'datetime-local' ? fromDate.format(' h:mm A') : ''
	const toTime = type === 'datetime-local' ? toDate.format(' h:mm A') : ''

	// Check if same day
	if (fromDate.isSame(toDate, 'day')) {
		return `${fromDate.format('ddd, MMM D, YYYY')}${fromTime}`
	}

	// Check if same month and year
	if (fromDate.isSame(toDate, 'month') && fromDate.isSame(toDate, 'year')) {
		return `${fromDate.format('ddd MMM D')} - ${toDate.format('ddd D, YYYY')}${toTime}`
	}

	// Check if same year
	if (fromDate.isSame(toDate, 'year')) {
		return `${fromDate.format('ddd MMM D')} - ${toDate.format('ddd MMM D, YYYY')}${toTime}`
	}

	// Different years
	return `${fromDate.format('ddd MMM D, YYYY')}${fromTime} - ${toDate.format('ddd MMM D, YYYY')}${toTime}`
}

/**
 * Detect the type of date range (full month, full quarter, etc.)
 */
export interface DateRangeType {
	isFullMonth: boolean
	isFullQuarter: boolean
	isFullYear: boolean
	isFullWeek: boolean
}

export function detectDateRangeType(fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs): DateRangeType {
	return {
		isFullMonth: fromDate.date() === 1 && toDate.isSame(fromDate.endOf('month'), 'day'),
		isFullQuarter: fromDate.isSame(fromDate.startOf('quarter'), 'day') && toDate.isSame(toDate.endOf('quarter'), 'day'),
		isFullYear: fromDate.isSame(fromDate.startOf('year'), 'day') && toDate.isSame(toDate.endOf('year'), 'day'),
		isFullWeek: fromDate.day() === 0 && toDate.day() === 6 && toDate.diff(fromDate, 'days') === 6,
	}
}


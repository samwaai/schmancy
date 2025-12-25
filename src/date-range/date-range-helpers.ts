import dayjs from 'dayjs'
import { PresetUnit } from './date-range-presets'

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

/**
 * Calculate the appropriate shift unit and amount for a date range
 */
export function calculateShiftParams(
	fromDate: dayjs.Dayjs,
	toDate: dayjs.Dayjs,
	activePresetStep?: PresetUnit
): { unit: PresetUnit; amount: number } {
	if (activePresetStep) {
		return { unit: activePresetStep, amount: 1 }
	}

	const rangeDurationInDays = toDate.diff(fromDate, 'day')

	// For very long ranges, use years
	if (rangeDurationInDays >= 360) {
		return { unit: 'year', amount: Math.round(rangeDurationInDays / 365) }
	}
	// For long ranges, use quarters
	else if (rangeDurationInDays >= 90) {
		return { unit: 'quarter', amount: Math.round(rangeDurationInDays / 90) }
	}
	// For medium-long ranges, use months
	else if (rangeDurationInDays >= 30) {
		return { unit: 'month', amount: Math.round(rangeDurationInDays / 30) }
	}
	// For medium ranges, use weeks
	else if (rangeDurationInDays >= 7) {
		return { unit: 'week', amount: Math.round(rangeDurationInDays / 7) }
	}
	// For shorter ranges, use days
	else {
		return { unit: 'day', amount: rangeDurationInDays + 1 }
	}
}

/**
 * Helper method to safely add/subtract quarter values
 */
export function adjustQuarter(date: dayjs.Dayjs, amount: number, direction: 1 | -1): dayjs.Dayjs {
	// Get current quarter (1-4)
	const currentQuarter = date.quarter()

	// Calculate new quarter
	let newQuarter = currentQuarter + direction * amount
	let yearAdjustment = 0

	// Handle year boundaries
	while (newQuarter > 4) {
		newQuarter -= 4
		yearAdjustment += 1
	}

	while (newQuarter < 1) {
		newQuarter += 4
		yearAdjustment -= 1
	}

	// Adjust year if needed
	const adjustedDate = date.add(yearAdjustment, 'year')

	// Set to the start of the new quarter
	const newDate = adjustedDate.month((newQuarter - 1) * 3)

	// Maintain the same day of month if possible
	const daysInMonth = newDate.daysInMonth()
	const targetDay = Math.min(date.date(), daysInMonth)

	return newDate.date(targetDay)
}
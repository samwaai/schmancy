import dayjs from 'dayjs'

export type PresetUnit = dayjs.OpUnitType | 'quarter'

export interface DateRangePreset {
	label: string
	range: { dateFrom: string; dateTo: string }
	step: PresetUnit
}

export interface PresetCategory {
	name: string
	presets: DateRangePreset[]
}

/**
 * Generate date range presets for different time periods
 */
export function generatePresetCategories(format: string, includeTime: boolean = false): PresetCategory[] {
	const categories: PresetCategory[] = []

	// Hours category (only for datetime-local)
	if (includeTime) {
		categories.push({
			name: 'Hours',
			presets: [
				{
					label: 'Last 24 Hours',
					range: {
						dateFrom: dayjs().subtract(24, 'hours').format(format),
						dateTo: dayjs().format(format),
					},
					step: 'hour',
				},
				{
					label: 'Last 12 Hours',
					range: {
						dateFrom: dayjs().subtract(12, 'hours').format(format),
						dateTo: dayjs().format(format),
					},
					step: 'hour',
				},
			],
		})
	}

	// Days category
	categories.push({
		name: 'Days',
		presets: [
			{
				label: 'Today',
				range: {
					dateFrom: dayjs().startOf('day').format(format),
					dateTo: dayjs().endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'Yesterday',
				range: {
					dateFrom: dayjs().subtract(1, 'days').startOf('day').format(format),
					dateTo: dayjs().subtract(1, 'days').endOf('day').format(format),
				},
				step: 'day',
			},
			...generateLastNDaysPresets([7, 14, 30, 60, 90], format),
		],
	})

	// Weeks category
	categories.push({
		name: 'Weeks',
		presets: [
			{
				label: 'This Week',
				range: {
					dateFrom: dayjs().startOf('week').format(format),
					dateTo: dayjs().endOf('week').format(format),
				},
				step: 'week',
			},
			{
				label: 'Last Week',
				range: {
					dateFrom: dayjs().subtract(1, 'weeks').startOf('week').format(format),
					dateTo: dayjs().subtract(1, 'weeks').endOf('week').format(format),
				},
				step: 'week',
			},
			...generateLastNWeeksPresets([2, 4], format),
		],
	})

	// Months category
	categories.push({
		name: 'Months',
		presets: [
			{
				label: 'This Month',
				range: {
					dateFrom: dayjs().startOf('month').format(format),
					dateTo: dayjs().endOf('month').format(format),
				},
				step: 'month',
			},
			{
				label: 'Last Month',
				range: {
					dateFrom: dayjs().subtract(1, 'month').startOf('month').format(format),
					dateTo: dayjs().subtract(1, 'month').endOf('month').format(format),
				},
				step: 'month',
			},
			...generateLastNMonthsPresets([3, 6], format),
		],
	})

	// Quarters category
	categories.push({
		name: 'Quarters',
		presets: [
			{
				label: 'This Quarter',
				range: {
					dateFrom: dayjs().startOf('quarter').format(format),
					dateTo: dayjs().endOf('quarter').format(format),
				},
				step: 'quarter',
			},
			{
				label: 'Last Quarter',
				range: {
					dateFrom: dayjs().subtract(1, 'quarter').startOf('quarter').format(format),
					dateTo: dayjs().subtract(1, 'quarter').endOf('quarter').format(format),
				},
				step: 'quarter',
			},
			...generateLastNQuartersPresets([2, 4], format),
		],
	})

	// Years category
	categories.push({
		name: 'Years',
		presets: [
			{
				label: 'This Year',
				range: {
					dateFrom: dayjs().startOf('year').format(format),
					dateTo: dayjs().endOf('year').format(format),
				},
				step: 'year',
			},
			{
				label: 'Last Year',
				range: {
					dateFrom: dayjs().subtract(1, 'year').startOf('year').format(format),
					dateTo: dayjs().subtract(1, 'year').endOf('year').format(format),
				},
				step: 'year',
			},
			{
				label: 'Year to Date',
				range: {
					dateFrom: dayjs().startOf('year').format(format),
					dateTo: dayjs().endOf('day').format(format),
				},
				step: 'day',
			},
		],
	})

	return categories
}

// Helper functions to generate preset arrays
function generateLastNDaysPresets(days: number[], format: string): DateRangePreset[] {
	return days.map(n => ({
		label: `Last ${n} Days`,
		range: {
			dateFrom: dayjs().subtract(n - 1, 'days').startOf('day').format(format),
			dateTo: dayjs().endOf('day').format(format),
		},
		step: 'day' as PresetUnit,
	}))
}

function generateLastNWeeksPresets(weeks: number[], format: string): DateRangePreset[] {
	return weeks.map(n => ({
		label: `Last ${n} Weeks`,
		range: {
			dateFrom: dayjs().subtract(n, 'weeks').startOf('week').format(format),
			dateTo: dayjs().endOf('day').format(format),
		},
		step: 'week' as PresetUnit,
	}))
}

function generateLastNMonthsPresets(months: number[], format: string): DateRangePreset[] {
	return months.map(n => ({
		label: `Last ${n} Months`,
		range: {
			dateFrom: dayjs().subtract(n, 'months').startOf('month').format(format),
			dateTo: dayjs().endOf('day').format(format),
		},
		step: 'month' as PresetUnit,
	}))
}

function generateLastNQuartersPresets(quarters: number[], format: string): DateRangePreset[] {
	return quarters.map(n => ({
		label: `Last ${n} Quarters`,
		range: {
			dateFrom: dayjs().subtract(n, 'quarters').startOf('quarter').format(format),
			dateTo: dayjs().endOf('day').format(format),
		},
		step: 'quarter' as PresetUnit,
	}))
}
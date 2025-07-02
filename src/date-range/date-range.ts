import { $LitElement } from '@mixins/index'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { debounceTime, fromEvent, takeUntil, timer } from 'rxjs'
import { $dialog } from '../dialog/dialog-service'
import { validateInitialDateRange } from './date-utils'

// Add quarter plugin to dayjs
dayjs.extend(quarterOfYear)

export type SchmancyDateRangeChangeEvent = CustomEvent<{
	dateFrom: string
	dateTo: string
}>

// Custom type to include 'quarter' as a valid unit
type ExtendedTimeUnit = dayjs.OpUnitType | 'quarter'

/**
 * A date range selector that supports presets and manual date input.
 *
 * @element schmancy-date-range
 * @fires change - Fired when the date range changes with dateFrom and dateTo values
 */
@customElement('schmancy-date-range')
export class SchmancyDateRange extends $LitElement() {
	// Core properties
	@property({ type: String }) type: 'date' | 'datetime-local' = 'date'
	@property({ type: Object }) dateFrom: { label: string; value: string } = { label: 'From', value: '' }
	@property({ type: Object }) dateTo: { label: string; value: string } = { label: 'To', value: '' }
	@property({ type: String }) minDate?: string
	@property({ type: String }) maxDate?: string

	// Enhanced functionality
	@property({ type: Array }) customPresets: Array<{
		label: string
		dateFrom: string
		dateTo: string
	}> = []
	@property({ type: String }) format?: string
	@property({ type: Boolean }) disabled = false
	@property({ type: Boolean }) required = false
	@property({ type: String }) placeholder = 'Select date range'
	@property({ type: Boolean }) clearable = true

	// Internal states
	@state() private isOpen = false
	@state() private selectedDateRange: string = ''
	@state() private activePreset: string | null = null
	@state() private announceMessage: string = ''
	@state() private isMobile = false

	// Default presets
	private presetRanges: Array<{
		label: string
		range: { dateFrom: string; dateTo: string }
		step: ExtendedTimeUnit
	}> = []

	// Categorized presets
	private presetCategories: Array<{
		name: string
		presets: Array<{
			label: string
			range: { dateFrom: string; dateTo: string }
			step: ExtendedTimeUnit
		}>
	}> = []

	
	// Memoization cache
	private memoizedPresets = new Map<string, typeof this.presetCategories>()

	connectedCallback(): void {
		super.connectedCallback()
		this.initPresetRanges()
		this.checkMobileView()

		// Validate initial date range
		const dateFormat = this.getDateFormat() as 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm'
		const validatedRange = validateInitialDateRange(this.dateFrom.value, this.dateTo.value, dateFormat)

		if (validatedRange.isValid) {
			this.dateFrom.value = validatedRange.dateFrom!
			this.dateTo.value = validatedRange.dateTo!
			this.updateSelectedDateRange()
		} else {
			const now = dayjs().format(dateFormat)
			this.dateFrom.value = now
			this.dateTo.value = now
			this.updateSelectedDateRange()
		}

		// Set up global event handlers using RxJS
		this.setupEventHandlers()
	}

	private setupEventHandlers() {
		// Handle keyboard navigation
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				this.handleKeyboardNavigation(event)
			})

		// Handle window resize with debouncing
		fromEvent(window, 'resize')
			.pipe(
				debounceTime(150),
				takeUntil(this.disconnecting)
			)
			.subscribe(() => {
				this.checkMobileView()
			})
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
	}

	updated(changedProps: PropertyValues) {
		super.updated(changedProps)

		if (
			(changedProps.has('dateFrom') || changedProps.has('dateTo')) &&
			(this.dateFrom?.value !== undefined || this.dateTo?.value !== undefined)
		) {
			this.updateSelectedDateRange()
		}
	}

	private initPresetRanges() {
		const format = this.getDateFormat()
		const cacheKey = `${this.type}-${format}-${JSON.stringify(this.customPresets)}`
		
		// Check memoization cache
		if (this.memoizedPresets.has(cacheKey)) {
			const cached = this.memoizedPresets.get(cacheKey)!
			this.presetCategories = cached
			this.presetRanges = []
			cached.forEach(category => {
				this.presetRanges.push(...category.presets)
			})
			return
		}

		// Define categories with their presets
		this.presetCategories = [
			{
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
					{
						label: 'Last 7 Days',
						range: {
							dateFrom: dayjs().subtract(6, 'days').startOf('day').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'day',
					},
					{
						label: 'Last 14 Days',
						range: {
							dateFrom: dayjs().subtract(13, 'days').startOf('day').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'day',
					},
					{
						label: 'Last 30 Days',
						range: {
							dateFrom: dayjs().subtract(29, 'days').startOf('day').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'day',
					},
					{
						label: 'Last 60 Days',
						range: {
							dateFrom: dayjs().subtract(59, 'days').startOf('day').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'day',
					},
					{
						label: 'Last 90 Days',
						range: {
							dateFrom: dayjs().subtract(89, 'days').startOf('day').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'day',
					},
				],
			},
			{
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
					{
						label: 'Last 2 Weeks',
						range: {
							dateFrom: dayjs().subtract(2, 'weeks').startOf('week').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'week',
					},
					{
						label: 'Last 4 Weeks',
						range: {
							dateFrom: dayjs().subtract(4, 'weeks').startOf('week').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'week',
					},
				],
			},
			{
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
					{
						label: 'Last 3 Months',
						range: {
							dateFrom: dayjs().subtract(3, 'months').startOf('month').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'month',
					},
					{
						label: 'Last 6 Months',
						range: {
							dateFrom: dayjs().subtract(6, 'months').startOf('month').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'month',
					},
				],
			},
			{
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
					{
						label: 'Last 2 Quarters',
						range: {
							dateFrom: dayjs().subtract(2, 'quarters').startOf('quarter').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'quarter',
					},
					{
						label: 'Last 4 Quarters',
						range: {
							dateFrom: dayjs().subtract(4, 'quarters').startOf('quarter').format(format),
							dateTo: dayjs().endOf('day').format(format),
						},
						step: 'quarter',
					},
				],
			},
			{
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
			},
		]

		// For datetime-local type, add time-specific presets
		if (this.type === 'datetime-local') {
			this.presetCategories.unshift({
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

		// Flatten presets for other methods that expect a flat list
		this.presetRanges = []
		this.presetCategories.forEach(category => {
			this.presetRanges.push(...category.presets)
		})

		// Add custom presets if provided
		if (this.customPresets && this.customPresets.length > 0) {
			const customCategory = {
				name: 'Custom',
				presets: this.customPresets.map(preset => ({
					label: preset.label,
					range: {
						dateFrom: preset.dateFrom,
						dateTo: preset.dateTo,
					},
					step: 'day' as ExtendedTimeUnit,
				})),
			}

			this.presetCategories.push(customCategory)
			this.presetRanges.push(...customCategory.presets)
		}
		
		// Cache the result
		this.memoizedPresets.set(cacheKey, [...this.presetCategories])
	}

	private getDateFormat(): string {
		return this.format || (this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')
	}

	/**
	 * Creates a concise display format for the selected date range
	 */
	private updateSelectedDateRange() {
		// Find matching preset
		const preset = this.presetRanges.find(
			p => p.range.dateFrom === this.dateFrom.value && p.range.dateTo === this.dateTo.value,
		)

		if (preset) {
			// If matches a preset, just use the preset name
			this.selectedDateRange = preset.label
			this.activePreset = preset.label
			return
		}

		// If we didn't find a preset match, check if we should update the active preset
		this.checkAndUpdateActivePreset(this.dateFrom.value, this.dateTo.value)

		// Custom date range - create concise format
		this.activePreset = null

		if (!this.dateFrom.value || !this.dateTo.value) {
			this.selectedDateRange = this.placeholder
			return
		}

		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) {
			this.selectedDateRange = this.placeholder
			return
		}

		// Format times if needed (for datetime-local)
		const fromTime = this.type === 'datetime-local' ? fromDate.format(' h:mm A') : ''
		const toTime = this.type === 'datetime-local' ? toDate.format(' h:mm A') : ''

		// Check if same day
		if (fromDate.isSame(toDate, 'day')) {
			this.selectedDateRange = `${fromDate.format('MMM D, YYYY')}${fromTime}`
			return
		}

		// Check if same month and year
		if (fromDate.isSame(toDate, 'month') && fromDate.isSame(toDate, 'year')) {
			this.selectedDateRange = `${fromDate.format('MMM D')}-${toDate.format('D, YYYY')}${toTime}`
			return
		}

		// Check if same year
		if (fromDate.isSame(toDate, 'year')) {
			this.selectedDateRange = `${fromDate.format('MMM D')} - ${toDate.format('MMM D, YYYY')}${toTime}`
			return
		}

		// Different years
		this.selectedDateRange = `${fromDate.format('MMM D, YYYY')}${fromTime} - ${toDate.format('MMM D, YYYY')}${toTime}`
	}

	private setDateRange(dateFrom: string, dateTo: string) {
		this.dateFrom.value = dateFrom
		this.dateTo.value = dateTo
		this.updateSelectedDateRange()

		// Announce change to screen readers
		this.announceToScreenReader(`Date range updated: ${this.selectedDateRange}`)

		this.dispatchEvent(
			new CustomEvent<{ dateFrom: string; dateTo: string }>('change', {
				detail: { dateFrom, dateTo },
				bubbles: true,
				composed: true,
			}),
		)
	}

	private handlePresetSelection(preset: { label: string; range: { dateFrom: string; dateTo: string } }, e: Event) {
		e.stopPropagation()
		this.activePreset = preset.label
		this.setDateRange(preset.range.dateFrom, preset.range.dateTo)
		$dialog.dismiss()
	}



	private toggleDropdown(e: Event) {
		e.stopPropagation()
		if (this.disabled) return

		if (this.isOpen) {
			this.closeDropdown()
		} else {
			this.openDropdown()
		}
	}

	private openDropdown() {
		if (this.disabled) return
		
		this.isOpen = true
		
		// Create dialog content
		const dialogContent = this.createDialogContent()
		
		// Use the dialog service - it will automatically find the nearest schmancy-theme
		$dialog.component(dialogContent, {
			title: 'Select Date Range',
			width: this.isMobile ? '100vw' : '800px',
			hideActions: true
		}).then(() => {
			this.isOpen = false
		})
	}

	private closeDropdown() {
		$dialog.dismiss()
		this.isOpen = false
	}

	/**
	 * Helper method to safely add/subtract quarter values
	 */
	private adjustQuarter(date: dayjs.Dayjs, amount: number, direction: 1 | -1): dayjs.Dayjs {
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

	/**
	 * Shifts the date range based on its type (preset or custom)
	 * Enhanced to properly handle various time units and preserve date patterns
	 */
	private shiftDateRange(direction: number, e: Event) {
		e.stopPropagation()

		if (!this.dateFrom.value || !this.dateTo.value) return

		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) return

		const format = this.getDateFormat()

		// Convert direction to a type that our helper methods can use
		const dir = direction > 0 ? 1 : -1

		let newFromDate: dayjs.Dayjs
		let newToDate: dayjs.Dayjs

		// For preset ranges, use their specific step unit
		const activePreset = this.presetRanges.find(p => p.label === this.activePreset)

		// Detect if the date range represents full time periods
		const isFullMonth = fromDate.date() === 1 && toDate.isSame(fromDate.endOf('month'), 'day')
		const isFullQuarter =
			fromDate.isSame(fromDate.startOf('quarter'), 'day') && toDate.isSame(toDate.endOf('quarter'), 'day')
		const isFullYear = fromDate.isSame(fromDate.startOf('year'), 'day') && toDate.isSame(toDate.endOf('year'), 'day')
		const isFullWeek = fromDate.day() === 0 && toDate.day() === 6 && toDate.diff(fromDate, 'days') === 6

		// Determine shift unit and amount
		let unit: ExtendedTimeUnit = 'day'
		let amount = 1

		if (activePreset) {
			// Use the preset's specific unit (day, week, month, quarter, year)
			unit = activePreset.step
			amount = 1 // For presets, we shift by one unit
		} else {
			// For custom ranges, calculate the appropriate step size
			const rangeDurationInDays = toDate.diff(fromDate, 'day')

			// For very long ranges, use years
			if (rangeDurationInDays >= 360) {
				unit = 'year'
				amount = Math.round(rangeDurationInDays / 365)
			}
			// For long ranges, use quarters
			else if (rangeDurationInDays >= 90) {
				unit = 'quarter'
				amount = Math.round(rangeDurationInDays / 90)
			}
			// For medium-long ranges, use months
			else if (rangeDurationInDays >= 30) {
				unit = 'month'
				amount = Math.round(rangeDurationInDays / 30)
			}
			// For medium ranges, use weeks
			else if (rangeDurationInDays >= 7) {
				unit = 'week'
				amount = Math.round(rangeDurationInDays / 7)
			}
			// For shorter ranges, use days
			else {
				unit = 'day'
				amount = rangeDurationInDays + 1 // Include both start and end days
			}
		}

		// Handle special case for quarters
		if (unit === 'quarter') {
			if (isFullQuarter) {
				// Full quarter logic
				if (dir > 0) {
					newFromDate = this.adjustQuarter(fromDate, amount, 1).startOf('quarter')
					newToDate = newFromDate.endOf('quarter')
				} else {
					newFromDate = this.adjustQuarter(fromDate, amount, -1).startOf('quarter')
					newToDate = newFromDate.endOf('quarter')
				}
			} else {
				// Partial quarter logic - maintain day pattern
				if (dir > 0) {
					newFromDate = this.adjustQuarter(fromDate, amount, 1)
					newToDate = this.adjustQuarter(toDate, amount, 1)
				} else {
					newFromDate = this.adjustQuarter(fromDate, amount, -1)
					newToDate = this.adjustQuarter(toDate, amount, -1)
				}
			}
		}
		// For hour-based units (used in datetime-local type)
		else if (unit === 'hour') {
			const rangeDurationInHours = toDate.diff(fromDate, 'hour')
			if (dir > 0) {
				newFromDate = fromDate.add(rangeDurationInHours, 'hour')
				newToDate = toDate.add(rangeDurationInHours, 'hour')
			} else {
				newFromDate = fromDate.subtract(rangeDurationInHours, 'hour')
				newToDate = toDate.subtract(rangeDurationInHours, 'hour')
			}
		}
		// For year-based shifting
		else if (unit === 'year' && isFullYear) {
			// For full year ranges
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'year').startOf('year')
				newToDate = newFromDate.endOf('year')
			} else {
				newFromDate = fromDate.subtract(amount, 'year').startOf('year')
				newToDate = newFromDate.endOf('year')
			}
		} else if (unit === 'year') {
			// For year unit but not full year range
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'year')
				newToDate = toDate.add(amount, 'year')
			} else {
				newFromDate = fromDate.subtract(amount, 'year')
				newToDate = toDate.subtract(amount, 'year')
			}
		}
		// For month-based shifting
		else if (unit === 'month' && isFullMonth) {
			// For full month ranges
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'month').startOf('month')
				newToDate = newFromDate.endOf('month')
			} else {
				newFromDate = fromDate.subtract(amount, 'month').startOf('month')
				newToDate = newFromDate.endOf('month')
			}
		} else if (unit === 'month') {
			// For month unit but not a full month range
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'month')
				newToDate = toDate.add(amount, 'month')
			} else {
				newFromDate = fromDate.subtract(amount, 'month')
				newToDate = toDate.subtract(amount, 'month')
			}
		}
		// For week-based shifting
		else if (unit === 'week' && isFullWeek) {
			// For full week ranges
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'week').startOf('week')
				newToDate = newFromDate.endOf('week')
			} else {
				newFromDate = fromDate.subtract(amount, 'week').startOf('week')
				newToDate = newFromDate.endOf('week')
			}
		} else if (unit === 'week') {
			// For week unit but not full week range
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'week')
				newToDate = toDate.add(amount, 'week')
			} else {
				newFromDate = fromDate.subtract(amount, 'week')
				newToDate = toDate.subtract(amount, 'week')
			}
		}
		// For day-based shifting (default)
		else {
			if (dir > 0) {
				newFromDate = fromDate.add(amount, 'day')
				newToDate = toDate.add(amount, 'day')
			} else {
				newFromDate = fromDate.subtract(amount, 'day')
				newToDate = toDate.subtract(amount, 'day')
			}
		}

		// Format the new dates and update the range
		const newFromDateStr = newFromDate.format(format)
		const newToDateStr = newToDate.format(format)

		// Set new date range
		this.setDateRange(newFromDateStr, newToDateStr)

		// Check if the new date range matches a preset, and update activePreset if needed
		this.checkAndUpdateActivePreset(newFromDateStr, newToDateStr)
	}

	/**
	 * Handle keyboard navigation for accessibility
	 */
	private handleKeyboardNavigation(event: KeyboardEvent) {
		const key = event.key
		
		// Handle date navigation keys
		if (this.dateFrom.value && this.dateTo.value && !this.disabled) {
			switch (key) {
				case 'PageUp':
					if (event.target === this || this.contains(event.target as Node)) {
						this.shiftDateRange(-1, event)
						event.preventDefault()
					}
					break
				case 'PageDown':
					if (event.target === this || this.contains(event.target as Node)) {
						this.shiftDateRange(1, event)
						event.preventDefault()
					}
					break
				case 'Home':
					if (event.ctrlKey && (event.target === this || this.contains(event.target as Node))) {
						// Ctrl+Home: Jump to start of current month
						const currentFrom = dayjs(this.dateFrom.value)
						const currentTo = dayjs(this.dateTo.value)
						const monthStart = currentFrom.startOf('month')
						const daysDiff = currentTo.diff(currentFrom, 'day')
						
						this.setDateRange(
							monthStart.format(this.getDateFormat()),
							monthStart.add(daysDiff, 'day').format(this.getDateFormat())
						)
						event.preventDefault()
					}
					break
				case 'End':
					if (event.ctrlKey && (event.target === this || this.contains(event.target as Node))) {
						// Ctrl+End: Jump to end of current month
						const currentFrom = dayjs(this.dateFrom.value)
						const currentTo = dayjs(this.dateTo.value)
						const daysDiff = currentTo.diff(currentFrom, 'day')
						const monthEnd = currentTo.endOf('month')
						
						this.setDateRange(
							monthEnd.subtract(daysDiff, 'day').format(this.getDateFormat()),
							monthEnd.format(this.getDateFormat())
						)
						event.preventDefault()
					}
					break
			}
		}
	}

	/**
	 * Checks if the current date range matches any predefined preset,
	 * and updates the activePreset accordingly
	 */
	private checkAndUpdateActivePreset(fromDate: string, toDate: string) {
		// Find a preset that matches the current date range
		const matchingPreset = this.presetRanges.find(
			preset => preset.range.dateFrom === fromDate && preset.range.dateTo === toDate,
		)

		if (matchingPreset) {
			this.activePreset = matchingPreset.label
		} else {
			this.activePreset = null
		}
	}

	private applyManualDateSelection(e: Event) {
		e.stopPropagation()
		// Validate dates before applying
		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) {
			this.announceToScreenReader('Invalid date format. Please check your input.')
			return
		}

		// Ensure from date is before to date
		if (fromDate.isAfter(toDate)) {
			this.setDateRange(toDate.format(this.getDateFormat()), fromDate.format(this.getDateFormat()))
		} else {
			this.setDateRange(this.dateFrom.value, this.dateTo.value)
		}

		$dialog.dismiss()
	}

	/**
	 * Check if view is mobile
	 */
	private checkMobileView() {
		this.isMobile = window.innerWidth < 768
	}



	/**
	 * Create dialog content
	 */
	private createDialogContent() {
		return html`
			<div class="w-full min-h-[400px] max-h-[80vh] flex flex-col p-4">
				<!-- Custom Range Section with Inline Calendars -->
				<schmancy-surface type="container" class="rounded-xl p-4 mb-6">
					<div class="flex flex-col gap-4">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							<!-- From Date Calendar -->
							<div class="flex flex-col gap-2">
								<schmancy-typography type="label" token="md" class="text-surface-onVariant">
									${this.dateFrom.label || 'From'}
								</schmancy-typography>
								<schmancy-input
									type="${this.type}"
									.value="${this.dateFrom.value}"
									min="${ifDefined(this.minDate)}"
									max="${ifDefined(this.maxDate)}"
									@change="${(e: Event) => {
										const target = e.target as HTMLInputElement
										this.dateFrom.value = target.value
										this.updateSelectedDateRange()
									}}"
								></schmancy-input>
							</div>
							
							<!-- To Date Calendar -->
							<div class="flex flex-col gap-2">
								<schmancy-typography type="label" token="md" class="text-surface-onVariant">
									${this.dateTo.label || 'To'}
								</schmancy-typography>
								<schmancy-input
									type="${this.type}"
									.value="${this.dateTo.value}"
									min="${ifDefined(this.dateFrom.value)}"
									max="${ifDefined(this.maxDate)}"
									@change="${(e: Event) => {
										const target = e.target as HTMLInputElement
										this.dateTo.value = target.value
										this.updateSelectedDateRange()
									}}"
								></schmancy-input>
							</div>
						</div>
						
						<!-- Apply Button - Now at the bottom for logical flow -->
						<div class="flex justify-end mt-2">
							<schmancy-button 
								variant="filled" 
								@click="${(e: Event) => this.applyManualDateSelection(e)}"
								?disabled="${!this.dateFrom.value || !this.dateTo.value}"
							>
								Apply
							</schmancy-button>
						</div>
					</div>
				</schmancy-surface>

				<!-- Presets Section -->
				<div class="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
					<div class="grid grid-cols-2 md:grid-cols-5 gap-6">
						${this.presetCategories.map(
							category => html`
								<div class="space-y-3">
									<schmancy-typography type="title" token="md" class="text-surface-onVariant font-medium">
										${category.name}
									</schmancy-typography>
									<div class="space-y-1">
										${category.presets.map(
											preset => html`
												<schmancy-button
													variant="${this.activePreset === preset.label ? 'filled' : 'text'}"
													class="w-full justify-start text-left"
													@click="${(e: Event) => this.handlePresetSelection(preset, e)}"
													aria-pressed="${this.activePreset === preset.label}"
													aria-label="${preset.label}: ${preset.range.dateFrom} to ${preset.range.dateTo}"
													title="${preset.range.dateFrom} to ${preset.range.dateTo}"
												>
													<span class="truncate">${preset.label}</span>
												</schmancy-button>
											`,
										)}
									</div>
								</div>
							`,
						)}
					</div>
				</div>
			</div>
		`
	}

	/**
	 * Announce messages to screen readers
	 */
	private announceToScreenReader(message: string) {
		this.announceMessage = message
		// Clear the message after announcement
		timer(100)
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => {
				this.announceMessage = ''
			})
	}


	render() {
		return html`
			<div class="relative ${this.disabled ? 'opacity-60 pointer-events-none' : ''}">
				<!-- Screen reader announcements -->
				<div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
					${this.announceMessage}
				</div>

				<!-- Trigger using the preferred schmancy-grid pattern -->
				<div class="trigger-container">
					<section @click=${(event: Event) => event.stopPropagation()} class="flex" >
						<schmancy-icon-button
							type="button"
							aria-label="Previous ${this.activePreset ? this.activePreset.toLowerCase() : 'date range'}"
							@click=${(e: Event) => this.shiftDateRange(-1, e)}
							?disabled=${this.disabled || !this.dateFrom.value || !this.dateTo.value}
						>
							arrow_left
						</schmancy-icon-button>

						<schmancy-button
							class="w-max"
							variant="outlined"
							type="button"
							aria-haspopup="menu"
							aria-expanded=${this.isOpen}
							aria-label="Select date range. Current: ${this.selectedDateRange || 'No date selected'}"
							@click=${(e: Event) => this.toggleDropdown(e)}
						>
							${this.selectedDateRange || this.placeholder}
						</schmancy-button>

						<schmancy-icon-button
							type="button"
							aria-label="Next ${this.activePreset ? this.activePreset.toLowerCase() : 'date range'}"
							@click=${(e: Event) => this.shiftDateRange(1, e)}
							?disabled=${this.disabled || !this.dateFrom.value || !this.dateTo.value}
						>
							arrow_right
						</schmancy-icon-button>
					</section>
				</div>
			</div>
		`
	}
}
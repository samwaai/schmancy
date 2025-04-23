import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import { $LitElement } from '@mixins/index'
import dayjs from 'dayjs'
import { html, PropertyValues } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { fromEvent, takeUntil } from 'rxjs'
import { validateInitialDateRange } from './date-utils'

export type SchmancyDateRangeChangeEvent = CustomEvent<{
	dateFrom: string
	dateTo: string
}>

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

	// Default presets
	private presetRanges: Array<{
		label: string
		range: { dateFrom: string; dateTo: string }
		step: dayjs.OpUnitType
	}> = []

	// DOM references
	@query('.trigger-container') private triggerRef!: HTMLElement
	@query('.dropdown') private dropdownRef!: HTMLElement

	// Positioning cleanup
	private cleanupPositioner?: () => void

	connectedCallback(): void {
		super.connectedCallback()
		this.initPresetRanges()

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
		// Close dropdown when clicking outside
		fromEvent<MouseEvent>(document, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				if (
					this.isOpen &&
					event.target instanceof Node &&
					!this.contains(event.target) &&
					(!this.dropdownRef || !this.dropdownRef.contains(event.target as Node))
				) {
					this.closeDropdown()
				}
			})

		// Handle keyboard navigation
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				if (!this.isOpen) return

				if (event.key === 'Escape') {
					this.closeDropdown()
					event.preventDefault()
				}
			})
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		this.cleanupPositioner?.()
	}

	updated(changedProps: PropertyValues) {
		super.updated(changedProps)

		if (
			(changedProps.has('dateFrom') || changedProps.has('dateTo')) &&
			(this.dateFrom?.value !== undefined || this.dateTo?.value !== undefined)
		) {
			this.updateSelectedDateRange()
		}

		if (changedProps.has('isOpen')) {
			if (this.isOpen) {
				requestAnimationFrame(() => {
					this.setupDropdownPosition()
				})
			} else {
				this.cleanupPositioner?.()
			}
		}
	}

	private setupDropdownPosition() {
		if (!this.triggerRef || !this.dropdownRef) return

		this.cleanupPositioner = autoUpdate(this.triggerRef, this.dropdownRef, () => {
			computePosition(this.triggerRef, this.dropdownRef, {
				placement: 'bottom-start',
				middleware: [offset(8), flip(), shift({ padding: 16 })],
			}).then(({ x, y }) => {
				Object.assign(this.dropdownRef.style, {
					left: `${x}px`,
					top: `${y}px`,
				})
			})
		})
	}

	private initPresetRanges() {
		const format = this.getDateFormat()
		this.presetRanges = [
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
		]

		// Add custom presets if provided
		if (this.customPresets && this.customPresets.length > 0) {
			this.presetRanges.push(
				...this.customPresets.map(preset => ({
					label: preset.label,
					range: {
						dateFrom: preset.dateFrom,
						dateTo: preset.dateTo,
					},
					step: 'day' as dayjs.OpUnitType, // Default step
				})),
			)
		}
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

		this.dispatchEvent(
			new CustomEvent<{ dateFrom: string; dateTo: string }>('change', {
				detail: { dateFrom, dateTo },
				bubbles: true,
				composed: true,
			}),
		)

		// Debug log to help with development
		// console.log('Date range set:', {
		//   dateFrom,
		//   dateTo,
		//   preset: this.activePreset,
		//   display: this.selectedDateRange
		// })
	}

	private handlePresetSelection(preset: { label: string; range: { dateFrom: string; dateTo: string } }, e: Event) {
		e.stopPropagation()
		this.activePreset = preset.label
		this.setDateRange(preset.range.dateFrom, preset.range.dateTo)
		this.closeDropdown()
	}

	private handleClearSelection(e: Event) {
		e.stopPropagation()
		const emptyDate = ''
		this.setDateRange(emptyDate, emptyDate)
		this.activePreset = null
		this.selectedDateRange = this.placeholder
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
	}

	private closeDropdown() {
		this.isOpen = false
	}

	/**
	 * Shifts the date range based on its type (preset or custom)
	 * Improved to respect the unit (day, week, month) of presets
	 * For custom ranges, it shifts by the exact range duration
	 */
	private shiftDateRange(direction: number, e: Event) {
		e.stopPropagation()

		if (!this.dateFrom.value || !this.dateTo.value) return

		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) return

		const format = this.getDateFormat()
		let unit: dayjs.ManipulateType = 'day'
		let amount = 1

		// For preset ranges, use their specific step unit
		const activePreset = this.presetRanges.find(p => p.label === this.activePreset)

		// Detect if the date range represents a full month or full week
		const isFullMonth = fromDate.date() === 1 && toDate.isSame(fromDate.endOf('month'), 'day')
		const isFullWeek = fromDate.day() === 0 && toDate.day() === 6 && toDate.diff(fromDate, 'days') === 6

		if (activePreset) {
			// Use the preset's specific unit (day, week, month)
			unit = activePreset.step as dayjs.ManipulateType
			amount = 1 // For presets, we shift by one unit (e.g. one month, one week)
		} else {
			// For custom ranges, calculate the exact range duration in days
			const rangeDurationInDays = toDate.diff(fromDate, 'day')

			// For longer ranges (>30 days), use months
			if (rangeDurationInDays >= 30) {
				unit = 'month'
				amount = Math.round(rangeDurationInDays / 30)
			}
			// For medium ranges (>7 days), use weeks
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

		// Calculate new dates based on unit type
		let newFromDate, newToDate

		if (unit === 'month' || isFullMonth) {
			// For month-based shifting, always work with full months
			if (direction > 0) {
				newFromDate = fromDate.add(amount, 'month').startOf('month')
				newToDate = newFromDate.endOf('month')
			} else {
				newFromDate = fromDate.subtract(amount, 'month').startOf('month')
				newToDate = newFromDate.endOf('month')
			}
		} else if (unit === 'week' || isFullWeek) {
			// For week-based shifting, always work with full weeks
			if (direction > 0) {
				newFromDate = fromDate.add(amount, 'week').startOf('week')
				newToDate = newFromDate.endOf('week')
			} else {
				newFromDate = fromDate.subtract(amount, 'week').startOf('week')
				newToDate = newFromDate.endOf('week')
			}
		} else {
			// For day-based shifting
			if (direction > 0) {
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
			return
		}

		// Ensure from date is before to date
		if (fromDate.isAfter(toDate)) {
			this.setDateRange(toDate.format(this.getDateFormat()), fromDate.format(this.getDateFormat()))
		} else {
			this.setDateRange(this.dateFrom.value, this.dateTo.value)
		}

		this.closeDropdown()
	}

	render() {
		return html`
			<div class="relative ${this.disabled ? 'opacity-60 pointer-events-none' : ''}">
				<!-- Trigger using the preferred schmancy-grid pattern -->
				<div class="trigger-container">
					<schmancy-grid @click=${(event: Event) => event.stopPropagation()} align="center" cols="auto 1fr auto">
						<schmancy-icon-button
							type="button"
							aria-label="Shift date range backward"
							@click=${(e: Event) => this.shiftDateRange(-1, e)}
						>
							arrow_left
						</schmancy-icon-button>

						<schmancy-button
							class="w-max"
							variant="outlined"
							type="button"
							aria-haspopup="menu"
							aria-expanded=${this.isOpen}
							@click=${(e: Event) => this.toggleDropdown(e)}
						>
							${this.selectedDateRange || this.placeholder}
						</schmancy-button>

						<schmancy-icon-button
							type="button"
							aria-label="Shift date range forward"
							@click=${(e: Event) => this.shiftDateRange(1, e)}
						>
							arrow_right
						</schmancy-icon-button>
					</schmancy-grid>
				</div>

				<!-- Dropdown -->
				${this.isOpen
					? html`
							<schmancy-surface
								class="dropdown absolute z-50 mt-1 min-w-64 max-w-96"
								rounded="all"
								elevation="3"
								type="containerHigh"
								@click="${(e: Event) => e.stopPropagation()}"
								role="dialog"
								aria-label="Date range picker"
							>
								<!-- Presets view -->
								<div class="p-4">
									<schmancy-grid gap="sm" class="mb-4">
										${this.presetRanges.map(
											preset => html`
												<schmancy-button
													variant="${this.activePreset === preset.label ? 'filled tonal' : 'text'}"
													width="full"
													class="text-left justify-start"
													@click="${(e: Event) => this.handlePresetSelection(preset, e)}"
												>
													<schmancy-typography type="body" token="md"> ${preset.label} </schmancy-typography>
												</schmancy-button>
											`,
										)}
									</schmancy-grid>

									<!-- Manual date inputs -->
									<schmancy-grid gap="md" cols="1fr 1fr" class="mb-4">
										<schmancy-input
											type="${this.type}"
											label="${this.dateFrom.label || 'From'}"
											.value="${this.dateFrom.value}"
											min="${ifDefined(this.minDate)}"
											max="${ifDefined(this.maxDate)}"
											@change="${(e: CustomEvent) => {
												e.stopPropagation()
												this.dateFrom.value = e.detail.value
												this.updateSelectedDateRange()
											}}"
										></schmancy-input>

										<schmancy-input
											type="${this.type}"
											label="${this.dateTo.label || 'To'}"
											.value="${this.dateTo.value}"
											min="${ifDefined(this.dateFrom.value)}"
											max="${ifDefined(this.maxDate)}"
											@change="${(e: CustomEvent) => {
												e.stopPropagation()
												this.dateTo.value = e.detail.value
												this.updateSelectedDateRange()
											}}"
										></schmancy-input>
									</schmancy-grid>

									<!-- Action buttons -->
									<div class="flex justify-between">
										${this.clearable
											? html`
													<schmancy-button variant="text" @click="${(e: Event) => this.handleClearSelection(e)}">
														Clear
													</schmancy-button>
												`
											: html`<div></div>`}

										<div class="flex space-x-2">
											<schmancy-button
												variant="text"
												@click="${(e: Event) => {
													e.stopPropagation()
													this.closeDropdown()
												}}"
											>
												Cancel
											</schmancy-button>

											<schmancy-button variant="filled" @click="${(e: Event) => this.applyManualDateSelection(e)}">
												Apply
											</schmancy-button>
										</div>
									</div>
								</div>
							</schmancy-surface>
						`
					: ''}
			</div>
		`
	}
}

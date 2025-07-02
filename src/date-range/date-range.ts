import { $LitElement } from '@mixins/index'
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { html, PropertyValues, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { debounceTime, fromEvent, takeUntil, timer } from 'rxjs'
import { $dialog } from '../dialog/dialog-service'
import { validateInitialDateRange } from './date-utils'
import { DateRangePreset, PresetCategory, generatePresetCategories } from './date-range-presets'
import { formatDateRange, detectDateRangeType, calculateShiftParams, adjustQuarter } from './date-range-helpers'

// Add quarter plugin to dayjs
dayjs.extend(quarterOfYear)

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
	@state() private announceMessage: string = ''
	@state() private isMobile = false

	// Default presets
	private presetRanges: DateRangePreset[] = []

	// Categorized presets
	private presetCategories: PresetCategory[] = []

	// Memoization cache
	private memoizedPresets = new Map<string, PresetCategory[]>()

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

		// Generate preset categories
		this.presetCategories = generatePresetCategories(format, this.type === 'datetime-local')

		// Flatten presets for other methods that expect a flat list
		this.presetRanges = []
		this.presetCategories.forEach(category => {
			this.presetRanges.push(...category.presets)
		})

		// Add custom presets if provided
		if (this.customPresets && this.customPresets.length > 0) {
			const customCategory: PresetCategory = {
				name: 'Custom',
				presets: this.customPresets.map(preset => ({
					label: preset.label,
					range: {
						dateFrom: preset.dateFrom,
						dateTo: preset.dateTo,
					},
					step: 'day' as const,
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
		this.selectedDateRange = formatDateRange(this.dateFrom.value, this.dateTo.value, this.type, this.placeholder)
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

	private handlePresetSelection(preset: DateRangePreset, e: Event) {
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
	 * Shifts the date range based on its type (preset or custom)
	 */
	private shiftDateRange(direction: number, e: Event) {
		e.stopPropagation()

		if (!this.dateFrom.value || !this.dateTo.value) return

		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) return

		const format = this.getDateFormat()
		const dir = direction > 0 ? 1 : -1

		// Get active preset and calculate shift parameters
		const activePreset = this.presetRanges.find(p => p.label === this.activePreset)
		const { unit, amount } = calculateShiftParams(fromDate, toDate, activePreset?.step)

		// Detect date range type
		const rangeType = detectDateRangeType(fromDate, toDate)

		let newFromDate: dayjs.Dayjs
		let newToDate: dayjs.Dayjs

		// Handle shifting based on unit
		if (unit === 'quarter') {
			newFromDate = adjustQuarter(fromDate, amount, dir)
			newToDate = adjustQuarter(toDate, amount, dir)
			
			if (rangeType.isFullQuarter) {
				newFromDate = newFromDate.startOf('quarter')
				newToDate = newFromDate.endOf('quarter')
			}
		} else if (unit === 'hour') {
			const rangeDurationInHours = toDate.diff(fromDate, 'hour')
			newFromDate = dir > 0 ? fromDate.add(rangeDurationInHours, 'hour') : fromDate.subtract(rangeDurationInHours, 'hour')
			newToDate = dir > 0 ? toDate.add(rangeDurationInHours, 'hour') : toDate.subtract(rangeDurationInHours, 'hour')
		} else {
			// Handle all other units (day, week, month, year)
			if (dir > 0) {
				newFromDate = fromDate.add(amount, unit as dayjs.ManipulateType)
				newToDate = toDate.add(amount, unit as dayjs.ManipulateType)
			} else {
				newFromDate = fromDate.subtract(amount, unit as dayjs.ManipulateType)
				newToDate = toDate.subtract(amount, unit as dayjs.ManipulateType)
			}

			// Preserve full period ranges
			if (unit === 'year' && rangeType.isFullYear) {
				newFromDate = newFromDate.startOf('year')
				newToDate = newFromDate.endOf('year')
			} else if (unit === 'month' && rangeType.isFullMonth) {
				newFromDate = newFromDate.startOf('month')
				newToDate = newFromDate.endOf('month')
			} else if (unit === 'week' && rangeType.isFullWeek) {
				newFromDate = newFromDate.startOf('week')
				newToDate = newFromDate.endOf('week')
			}
		}

		// Update the date range
		this.setDateRange(newFromDate.format(format), newToDate.format(format))
		this.checkAndUpdateActivePreset(newFromDate.format(format), newToDate.format(format))
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



	private handleFromDateChange(e: Event) {
		const input = e.target as HTMLInputElement
		this.dateFrom.value = input.value
		this.updateSelectedDateRange()
	}

	private handleToDateChange(e: Event) {
		const input = e.target as HTMLInputElement
		this.dateTo.value = input.value
		this.updateSelectedDateRange()
	}

	/**
	 * Create dialog content
	 */
	private createDialogContent(): TemplateResult {
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
									@change="${this.handleFromDateChange.bind(this)}"
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
									@change="${this.handleToDateChange.bind(this)}"
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
		`
	}
}
import dayjs from 'dayjs'
import quarterOfYear from 'dayjs/plugin/quarterOfYear'
import { html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { fromEvent, Subscription, takeUntil, timer } from 'rxjs'
import { SchmancyFormField } from '@mixins/index'
import { show } from '../overlay/overlay.service'
import { detectDateRangeType, formatDateRange } from './date-range-helpers'
import { DateRangePreset, generatePresetCategories, PresetCategory } from './date-range-presets'
import { validateInitialDateRange } from './date-utils'
import './date-range-dialog'

// Add quarter plugin to dayjs
dayjs.extend(quarterOfYear)

// Bridge the inner-content events used inside the overlay template down to a
// `close` event on the same element. `show()` translates a bubbling 'close'
// event into observable completion + an emission of `event.detail`.
const dispatchClose = (target: EventTarget | null): void => {
	target?.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
}

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
export class SchmancyDateRange extends SchmancyFormField() {
	// `name`, `disabled`, `required`, `error`, `validationMessage`, `id`,
	// `validateOn`, `touched`, `submitted`, `markTouched`, `markSubmitted`,
	// FACE wiring, FIELD_CONNECT_EVENT dispatch — all from the mixin.

	@property({ type: String }) type: 'date' | 'datetime-local' = 'date'
	@property({ type: Object }) dateFrom: { label: string; value: string } = { label: 'From', value: '' }
	@property({ type: Object }) dateTo: { label: string; value: string } = { label: 'To', value: '' }
	@property({ type: String }) minDate?: string
	@property({ type: String }) maxDate?: string

	@property({ type: Array }) customPresets: Array<{
		label: string
		dateFrom: string
		dateTo: string
	}> = []
	@property({ type: String }) format?: string
	@property({ type: String }) placeholder = 'Select date range'
	@property({ type: Boolean }) clearable = true
	@property() step?: 'day' | 'week' | 'month' | 'year' | number
	/** When true, collapses to just an icon button on mobile screens */
	@property({ type: Boolean }) collapse = false

	// Internal states
	@state() private isOpen = false
	@state() private selectedDateRange: string = ''
	@state() private activePreset: string | null = null
	@state() private announceMessage: string = ''

	// Default presets
	private presetRanges: DateRangePreset[] = []

	// Categorized presets
	private presetCategories: PresetCategory[] = []

	// Memoization cache
	private memoizedPresets = new Map<string, PresetCategory[]>()

	disconnectedCallback(): void {
		super.disconnectedCallback()
		// Reset open state when element is moved/removed to prevent stale state
		this.isOpen = false
	}

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
		// Handle keyboard navigation
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(event => {
				this.handleKeyboardNavigation(event)
			})
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

	override willUpdate(changed: PropertyValues): void {
		super.willUpdate(changed)
		if (changed.has('dateFrom') || changed.has('dateTo') || changed.has('name')) {
			// Multi-entry FACE submission: setFormValue accepts a FormData
			// object whose entries are appended to the owning form's FormData.
			// native `new FormData(form)` then sees both `${name}From` and
			// `${name}To` without any consumer-side parsing.
			if (this.name && !this.disabled) {
				const fd = new FormData()
				if (this.dateFrom?.value) fd.append(`${this.name}From`, this.dateFrom.value)
				if (this.dateTo?.value) fd.append(`${this.name}To`, this.dateTo.value)
				this.internals?.setFormValue(fd)
			} else {
				this.internals?.setFormValue(null)
			}
			this.checkValidity()
		}
		if (changed.has('required') || changed.has('disabled')) {
			this.checkValidity()
		}
	}

	/**
	 * Date-range validity is `both dates non-empty` when required.
	 * (Order/range constraints are out of scope here — they belong to a
	 * domain-specific schema layer.)
	 */
	override checkValidity(): boolean {
		if (this.disabled) {
			this.internals?.setValidity({})
			return true
		}
		const fromEmpty = !this.dateFrom?.value
		const toEmpty = !this.dateTo?.value
		const isValid = !this.required || (!fromEmpty && !toEmpty)
		const message = isValid ? '' : 'Please select a date range.'

		this.internals?.setValidity(
			isValid ? {} : { valueMissing: true },
			isValid ? undefined : message,
		)

		if (this._shouldShowError()) {
			this.error = !isValid
			this.validationMessage = message
		}
		return isValid
	}

	/**
	 * Override — emit `${name}From` and `${name}To` flat-suffix entries (the
	 * plan's chosen multi-entry encoding; native to JS consumers without
	 * server-side bracket parsing).
	 */
	override toFormEntries(): Array<[string, FormDataEntryValue]> {
		if (!this.name || this.disabled) return []
		const entries: Array<[string, FormDataEntryValue]> = []
		if (this.dateFrom?.value) entries.push([`${this.name}From`, this.dateFrom.value])
		if (this.dateTo?.value) entries.push([`${this.name}To`, this.dateTo.value])
		return entries
	}

	/** `dirty` tracks the underlying date strings, not the wide-union value. */
	private _dateFromDefault: string = ''
	private _dateToDefault: string = ''
	override firstUpdated(changed: PropertyValues): void {
		super.firstUpdated(changed)
		this._dateFromDefault = this.dateFrom?.value ?? ''
		this._dateToDefault = this.dateTo?.value ?? ''
	}
	override get dirty(): boolean {
		return (
			(this.dateFrom?.value ?? '') !== this._dateFromDefault ||
			(this.dateTo?.value ?? '') !== this._dateToDefault
		)
	}

	override resetForm(): void {
		this.dateFrom = { ...this.dateFrom, value: this._dateFromDefault }
		this.dateTo = { ...this.dateTo, value: this._dateToDefault }
		super.resetForm()
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

	private toggleDropdown(e: MouseEvent) {
		e.stopPropagation()
		if (this.disabled || this.step !== undefined) return

		if (this.isOpen) {
			this.closeDropdown()
		} else {
			this.openDropdown(e)
		}
	}

	private _overlaySubscription: Subscription | null = null

	private openDropdown(e?: MouseEvent) {
		if (this.disabled || this.step !== undefined) return

		this.dispatchEvent(new CustomEvent('beforeopen', { bubbles: true, composed: true }))
		this.isOpen = true

		// Inline-template overlay. Inner handlers dispatch a 'close' event
		// from the dialog itself (via the module-scoped `dispatchClose`),
		// which `show()` translates into observable completion + an emission.
		// Layout (centered vs sheet) is chosen by the overlay system based on
		// viewport / anchor presence.
		const dialogContent = html`
			<schmancy-date-range-dialog
				.type="${this.type}"
				.dateFrom="${this.dateFrom}"
				.dateTo="${this.dateTo}"
				.minDate="${this.minDate}"
				.maxDate="${this.maxDate}"
				.activePreset="${this.activePreset}"
				.presetCategories="${this.presetCategories}"
				@preset-select="${(ev: CustomEvent) => {
					this.activePreset = ev.detail.preset.label
					this.setDateRange(ev.detail.preset.range.dateFrom, ev.detail.preset.range.dateTo)
					dispatchClose(ev.currentTarget)
				}}"
				@date-change="${() => this.updateSelectedDateRange()}"
				@apply-dates="${(ev: CustomEvent) => {
					const { dateFrom, dateTo, swapIfNeeded } = ev.detail
					if (swapIfNeeded) {
						this.setDateRange(dateTo, dateFrom)
					} else {
						this.setDateRange(dateFrom, dateTo)
					}
					dispatchClose(ev.currentTarget)
				}}"
				@announce="${(ev: CustomEvent) => this.announceToScreenReader(ev.detail.message)}"
			></schmancy-date-range-dialog>
		`

		this._overlaySubscription?.unsubscribe()
		this._overlaySubscription = show(dialogContent, { anchor: e })
			.pipe(takeUntil(this.disconnecting))
			.subscribe({
				complete: () => {
					this.isOpen = false
					this._overlaySubscription = null
				},
			})
	}

	private closeDropdown() {
		this._overlaySubscription?.unsubscribe()
		this._overlaySubscription = null
		this.isOpen = false
	}

	/**
	 * Shifts the date range based on the step property
	 */
	private shiftDateRange(direction: number, e: Event) {
		e.stopPropagation()

		if (!this.dateFrom.value || !this.dateTo.value) return

		const fromDate = dayjs(this.dateFrom.value)
		const toDate = dayjs(this.dateTo.value)

		if (!fromDate.isValid() || !toDate.isValid()) return

		const format = this.getDateFormat()
		const dir = direction > 0 ? 1 : -1
		const daysDiff = toDate.diff(fromDate, 'day') + 1

		// Determine shift amount and unit
		let amount: number
		let unit: dayjs.ManipulateType

		if (this.step !== undefined) {
			if (typeof this.step === 'number') {
				amount = dir * this.step
				unit = 'day'
			} else if (this.step === 'day') {
				amount = dir * daysDiff
				unit = 'day'
			} else {
				amount = dir
				unit = this.step
			}
		} else {
			// Auto-detect based on date range
			const rangeType = detectDateRangeType(fromDate, toDate)
			if (rangeType.isFullYear) {
				amount = dir
				unit = 'year'
			} else if (rangeType.isFullMonth) {
				amount = dir
				unit = 'month'
			} else if (rangeType.isFullWeek) {
				amount = dir
				unit = 'week'
			} else {
				amount = dir * daysDiff
				unit = 'day'
			}
		}

		const newFromDate = fromDate.add(amount, unit)
		const newToDate = toDate.add(amount, unit)

		// Validate against min/max dates
		if (this.minDate && newFromDate.isBefore(dayjs(this.minDate))) return
		if (this.maxDate && newToDate.isAfter(dayjs(this.maxDate))) return

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

	/**
	 * Check if we can navigate backward
	 */
	private canNavigateBackward(): boolean {
		if (!this.dateFrom.value || !this.minDate) return true
		
		const fromDate = dayjs(this.dateFrom.value)
		const minDate = dayjs(this.minDate)
		
		// If current start date is already at or before min date, can't go back
		return fromDate.isAfter(minDate)
	}

	/**
	 * Check if we can navigate forward
	 */
	private canNavigateForward(): boolean {
		if (!this.dateTo.value || !this.maxDate) return true
		
		const toDate = dayjs(this.dateTo.value)
		const maxDate = dayjs(this.maxDate)
		
		// If current end date is already at or after max date, can't go forward
		return toDate.isBefore(maxDate)
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

				<!-- Collapsed: icon-only on mobile when collapse=true -->
				<schmancy-icon-button
					class="${this.collapse ? 'lg:hidden' : 'hidden'}"
					variant="outlined"
					type="button"
					aria-label="Select date range. Current: ${this.selectedDateRange || 'No date selected'}"
					@click=${(e: MouseEvent) => this.toggleDropdown(e)}
					?disabled=${this.disabled}
				>
					date_range
				</schmancy-icon-button>

				<!-- Full UI: always visible when collapse=false, or lg+ when collapse=true -->
				<section @click=${(event: Event) => event.stopPropagation()} class="${this.collapse ? 'hidden lg:flex' : 'flex'}">
						<schmancy-icon-button
							type="button"
							aria-label="Previous ${this.activePreset ? this.activePreset.toLowerCase() : 'date range'}"
							@click=${(e: Event) => this.shiftDateRange(-1, e)}
							?disabled=${this.disabled || !this.dateFrom.value || !this.dateTo.value || !this.canNavigateBackward()}
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
							aria-readonly="${this.step !== undefined}"
							@click=${(e: MouseEvent) => this.toggleDropdown(e)}
							?disabled=${this.disabled}
							style="${this.step !== undefined ? 'cursor: default;' : ''}"
						>
							${this.selectedDateRange || this.placeholder}
						</schmancy-button>

						<schmancy-icon-button
							type="button"
							aria-label="Next ${this.activePreset ? this.activePreset.toLowerCase() : 'date range'}"
							@click=${(e: Event) => this.shiftDateRange(1, e)}
							?disabled=${this.disabled || !this.dateFrom.value || !this.dateTo.value || !this.canNavigateForward()}
						>
							arrow_right
						</schmancy-icon-button>
				</section>
			</div>
		`
	}
}
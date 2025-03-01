import { $LitElement } from '@mixins/index'
import { SchmancyInputChangeEvent } from '@schmancy/input'
import SchmancyMenu from '@schmancy/menu/menu'
import { html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import dayjs from 'dayjs'
import { validateInitialDateRange } from './date-utils' // Import the utility

type DateFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm'

/**
 * A date range selector that supports presets and manual date input.
 */
@customElement('schmancy-date-range')
export default class SchmancyDateRange extends $LitElement() {
	// Either "date" or "datetime-local"
	@property({ type: String }) type: 'date' | 'datetime-local' = 'date'

	@property({ type: Object }) dateFrom!: { label: string; value: string }
	@property({ type: Object }) dateTo!: { label: string; value: string }

	// Optional min/max constraints
	@property({ type: String }) minDate?: string
	@property({ type: String }) maxDate?: string

	@query('#checkin') checkInInput!: HTMLInputElement
	@query('#checkout') checkOutInput!: HTMLInputElement

	// The <schmancy-menu> that displays presets + manual date inputs
	@query('schmancy-menu') schmancyMenu!: SchmancyMenu

	// Display text in the trigger button
	@state() selectedDateRange: string = 'Today'

	// Preset date range definitions
	presetRanges!: Array<{
		label: string
		range: { dateFrom: string; dateTo: string }
		step: moment.unitOfTime.DurationConstructor
	}>

	connectedCallback(): void {
		super.connectedCallback()
		this.initPresetRanges()

		// Validate and format initial date range
		const dateFormat = this.getDateFormat() as DateFormat
		const validatedRange = validateInitialDateRange(this.dateFrom.value, this.dateTo.value, dateFormat)

		if (validatedRange.isValid) {
			this.dateFrom.value = validatedRange.dateFrom!
			this.dateTo.value = validatedRange.dateTo!
			this.updateSelectedDateRange()
		} else {
			console.error('Invalid initial date range.  Falling back to default.')
			// Handle invalid initial dates (e.g., set to default values, display an error)
			const now = dayjs().format(dateFormat)
			this.dateFrom.value = now
			this.dateTo.value = now
		}
	}
	/**
	 * Update the internal date range and fire a 'change' event to notify external code.
	 */
	private setDateRange(fromDate: string, toDate: string) {
		this.dateFrom.value = fromDate
		this.dateTo.value = toDate

		this.dispatchEvent(
			new CustomEvent<TSchmancDateRangePayload>('change', {
				detail: { dateFrom: fromDate, dateTo: toDate },
				bubbles: true,
				composed: true, // If you want it to pass shadow boundaries
			}),
		)
		this.requestUpdate()
	}
	updated(changedProps: Map<string, unknown>) {
		if (changedProps.has('type')) {
			// Re-init presets if "type" changes from date -> datetime
			this.initPresetRanges()
			this.updateSelectedDateRange()
		}
	}

	/**
	 * Format strings for the internal <input> and for display text.
	 */
	private getDateFormat(): string {
		return this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'
	}
	private getDisplayFormat(): string {
		return this.type === 'date' ? 'MMM DD, YYYY' : 'MMM DD, YYYY hh:mm A'
	}

	/**
	 * Build up a list of preset ranges (yesterday, today, etc.).
	 */
	private initPresetRanges() {
		const format = this.getDateFormat()
		this.presetRanges = [
			{
				label: 'Yesterday',
				range: {
					dateFrom: dayjs().subtract(1, 'days').startOf('day').format(format),
					dateTo: dayjs().subtract(1, 'days').endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'Today',
				range: {
					dateFrom: dayjs().startOf('day').format(format),
					dateTo: dayjs().endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'Tomorrow',
				range: {
					dateFrom: dayjs().add(1, 'days').startOf('day').format(format),
					dateTo: dayjs().add(1, 'days').endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'This Week',
				range: {
					dateFrom: dayjs().startOf('isoWeek').format(format),
					dateTo: dayjs().endOf('isoWeek').format(format),
				},
				step: 'week',
			},
			{
				label: 'Last Week',
				range: {
					dateFrom: dayjs().subtract(1, 'weeks').startOf('isoWeek').format(format),
					dateTo: dayjs().subtract(1, 'weeks').endOf('isoWeek').format(format),
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
			// Add more if desired (e.g. "Last Month," "Custom," etc.)
		]
	}

	/**
	 * Based on the current dateFrom/dateTo, see if it matches a preset.
	 * Otherwise display a "Custom" range: "Jan 01, 2023 - Jan 07, 2023".
	 */
	private updateSelectedDateRange() {
		const preset = this.presetRanges.find(
			p => p.range.dateFrom === this.dateFrom.value && p.range.dateTo === this.dateTo.value,
		)
		if (preset) {
			this.selectedDateRange = preset.label
		} else {
			// Construct a custom label
			const fromMoment = dayjs(this.dateFrom.value)
			const toMoment = dayjs(this.dateTo.value)
			console.log(fromMoment.format('HH:mm'), toMoment.format('HH:mm'), fromMoment.format('HH:mm'))
			if (fromMoment.isSame(toMoment, 'day')) {
				this.selectedDateRange = fromMoment.format('MMM DD, YYYY')
				// append the time if fromMoment is not the start of the day and  toMoment is not the end of the day
				if (fromMoment.format('HH:mm') !== '00:00' || toMoment.format('HH:mm') !== '23:59') {
					this.selectedDateRange += ` ${fromMoment.format('HH:mm')}:${toMoment.format('HH:mm')}`
				}
			} else {
				const fromStr = fromMoment.format(this.getDisplayFormat())
				const toStr = toMoment.format(this.getDisplayFormat())
				this.selectedDateRange = `${fromStr} - ${toStr}`
			}
		}
	}
	private handlePresetChange(label: string) {
		const preset = this.presetRanges.find(range => range.label === label)
		if (!preset) return
		const { dateFrom, dateTo } = preset.range
		this.setDateRange(dateFrom, dateTo)
		this.selectedDateRange = label
	}

	/**
	 * Shift the current date range forward or backward by the same number of days.
	 * If the range is 7 days wide, shift 7 days, etc.
	 */
	private shiftDateRange(factor: number, event: Event) {
		event.stopPropagation() // Prevent click from bubbling to the schmancy-button

		const format = this.getDateFormat()
		const currentDiff = dayjs(this.dateTo.value).diff(dayjs(this.dateFrom.value), 'days') || 1
		const newDateFrom = dayjs(this.dateFrom.value)
			.add(factor * currentDiff, 'days')
			.format(format)
		const newDateTo = dayjs(this.dateTo.value)
			.add(factor * currentDiff, 'days')
			.format(format)

		this.setDateRange(newDateFrom, newDateTo)
		this.updateSelectedDateRange()
	}

	/**
	 * Applies the date range from the inputs.
	 * Closes the menu when done.
	 */
	private handleDateRangeChange(event: Event) {
		event.stopPropagation() // Prevent click from bubbling to the schmancy-button
		this.setDateRange(this.dateFrom.value, this.dateTo.value)
		this.updateSelectedDateRange()
	}

	render() {
		return html`
			<!-- schmancy-menu typically provides a slot="button" for the trigger,
             and then projects the menu items inside. -->
			<schmancy-menu class="z-100 w-max" role="menu" aria-label="Date range presets and custom input">
				<!-- The toggle/trigger slot -->
				<schmancy-grid slot="button" align="center" cols="auto 1fr auto">
					<schmancy-icon-button
						type="button"
						aria-label="Shift date range backward"
						@click=${(e: Event) => {
							this.shiftDateRange(-1, e) // Pass the event
						}}
					>
						arrow_left
					</schmancy-icon-button>

					<schmancy-button
						class="w-max"
						variant="outlined"
						type="button"
						aria-haspopup="menu"
						.ariaExpanded=${String(false)}
					>
						${this.selectedDateRange || 'Date range'}
					</schmancy-button>

					<schmancy-icon-button
						type="button"
						aria-label="Shift date range forward"
						@click=${(e: Event) => {
							this.shiftDateRange(1, e) // Pass the event
						}}
					>
						arrow_right
					</schmancy-icon-button>
				</schmancy-grid>

				<!-- The menu surface: presets + manual date selection -->
				${this.presetRanges.map(
					preset => html`
						<schmancy-menu-item role="menuitem" class="w-full" @click=${() => this.handlePresetChange(preset.label)}>
							<schmancy-grid class="w-full" align="center" cols="auto 1fr auto"> ${preset.label} </schmancy-grid>
						</schmancy-menu-item>
					`,
				)}

				<!-- Manual date range inputs + "Apply" button -->
				<schmancy-grid gap="sm" flow="row" class="p-4">
					<schmancy-input
						id="checkin"
						.type=${this.type}
						.label=${this.dateFrom.label}
						.value=${this.dateFrom.value}
						min=${ifDefined(this.minDate)}
						@change=${(event: SchmancyInputChangeEvent) => {
							event.preventDefault()
							event.stopPropagation()
							const fmt = this.getDateFormat()
							const selectedDate = dayjs(event.detail.value, fmt).format(fmt)
							this.dateFrom.value = selectedDate
							// Update the checkout input's min attribute:
							this.checkOutInput.setAttribute('min', selectedDate)
						}}
					></schmancy-input>

					<schmancy-input
						id="checkout"
						.type=${this.type}
						.label=${this.dateTo.label}
						.value=${this.dateTo.value}
						min=${ifDefined(this.dateFrom.value)}
						max=${ifDefined(this.maxDate)}
						@change=${(event: SchmancyInputChangeEvent) => {
							event.preventDefault()
							event.stopPropagation()
							const fmt = this.getDateFormat()
							const selectedDate = dayjs(event.detail.value, fmt).format(fmt)
							this.dateTo.value = selectedDate
						}}
					></schmancy-input>

					<schmancy-button
						type="button"
						variant="outlined"
						@click=${(e: Event) => {
							this.handleDateRangeChange(e)
						}}
					>
						Apply
					</schmancy-button>
				</schmancy-grid>
			</schmancy-menu>
		`
	}
}

/**
 * The payload for a date range change event.
 */
export type TSchmancDateRangePayload = {
	dateFrom?: string
	dateTo?: string
}

/**
 * A custom event fired when the date range is updated.
 */
export type SchmancyDateRangeChangeEvent = CustomEvent<TSchmancDateRangePayload>

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-date-range': SchmancyDateRange
	}
}

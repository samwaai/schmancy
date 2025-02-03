import { $LitElement } from '@mixins/index'
import { SchmancyInputChangeEvent } from '@schmancy/input'
import SchmancyMenu from '@schmancy/menu/menu'
import { html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import moment from 'moment'

/**
 * A date range selector that supports presets and manual date input.
 */
@customElement('schmancy-date-range')
export default class SchmancyDateRange extends $LitElement() {
	// The input type – either "date" or "datetime-local".
	@property({ type: String }) type: 'date' | 'datetime-local' = 'date'

	// The date range properties.
	@property({ type: Object }) dateFrom!: { label: string; value: string }
	@property({ type: Object }) dateTo!: { label: string; value: string }

	// Optional minimum and maximum dates.
	@property({ type: String }) minDate?: string
	@property({ type: String }) maxDate?: string

	// Query elements from the rendered template.
	@query('#checkin') checkInInput!: HTMLInputElement
	@query('#checkout') checkOutInput!: HTMLInputElement
	@query('schmancy-menu') schmancyMenu!: SchmancyMenu

	// The currently selected preset or custom date range display text.
	@state() selectedDateRange: string = 'Today'

	// Array of preset date ranges.
	presetRanges!: Array<{
		label: string
		range: { dateFrom: string; dateTo: string }
		step: moment.unitOfTime.DurationConstructor
		selected?: boolean
	}>

	connectedCallback(): void {
		super.connectedCallback()
		this.initPresetRanges()
		this.updateSelectedDateRange()
	}

	updated(changedProps: Map<string, unknown>) {
		if (changedProps.has('type')) {
			// Reinitialize presets if the date input type changes.
			this.initPresetRanges()
			this.updateSelectedDateRange()
		}
	}

	/**
	 * Returns the date format string based on the current type.
	 */
	private getDateFormat(): string {
		return this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'
	}

	/**
	 * Returns the display format for showing dates.
	 */
	private getDisplayFormat(): string {
		return this.type === 'date' ? 'MMM DD, YYYY' : 'MMM DD, YYYY hh:mm A'
	}

	/**
	 * Initializes the preset date ranges.
	 */
	private initPresetRanges() {
		const format = this.getDateFormat()
		this.presetRanges = [
			{
				label: 'Yesterday',
				range: {
					dateFrom: moment().subtract(1, 'days').startOf('day').format(format),
					dateTo: moment().subtract(1, 'days').endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'Today',
				range: {
					dateFrom: moment().startOf('day').format(format),
					dateTo: moment().endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'Tomorrow',
				range: {
					dateFrom: moment().add(1, 'days').startOf('day').format(format),
					dateTo: moment().add(1, 'days').endOf('day').format(format),
				},
				step: 'day',
			},
			{
				label: 'This Week',
				// Use ISO week boundaries for consistency.
				range: {
					dateFrom: moment().startOf('isoWeek').format(format),
					dateTo: moment().endOf('isoWeek').format(format),
				},
				step: 'week',
			},
			{
				label: 'Last Week',
				range: {
					dateFrom: moment().subtract(1, 'weeks').startOf('isoWeek').format(format),
					dateTo: moment().subtract(1, 'weeks').endOf('isoWeek').format(format),
				},
				step: 'week',
			},
			{
				label: 'This Month',
				range: {
					dateFrom: moment().startOf('month').format(format),
					dateTo: moment().endOf('month').format(format),
				},
				step: 'month',
			},
			// You can add a "Custom" option here if needed.
		]
	}

	/**
	 * Updates the selectedDateRange state based on the current dateFrom and dateTo values.
	 */
	private updateSelectedDateRange() {
		const preset = this.presetRanges.find(
			range => range.range.dateFrom === this.dateFrom.value && range.range.dateTo === this.dateTo.value,
		)
		if (preset) {
			this.selectedDateRange = preset.label
		} else {
			this.selectedDateRange = `${moment(this.dateFrom.value).format(
				this.getDisplayFormat(),
			)} - ${moment(this.dateTo.value).format(this.getDisplayFormat())}`
		}
	}

	/**
	 * Updates the internal date range state and dispatches a change event.
	 */
	setDateRange(fromDate: string, toDate: string) {
		this.dateFrom.value = fromDate
		this.dateTo.value = toDate
		this.dispatchEvent(
			new CustomEvent<TSchmancDateRangePayload>('change', {
				detail: { dateFrom: fromDate, dateTo: toDate },
			}),
		)
		this.requestUpdate()
	}

	/**
	 * Called when a preset is selected. Updates the date range and closes the menu.
	 */
	handlePresetChange(presetLabel: string) {
		const preset = this.presetRanges.find(range => range.label === presetLabel)
		if (preset) {
			const { dateFrom, dateTo } = preset.range
			this.setDateRange(dateFrom, dateTo)
			this.selectedDateRange = presetLabel
			// Close the menu after a preset selection.
			this.schmancyMenu.open = false
		}
	}

	/**
	 * Called when the user applies a manual date change.
	 */
	handleDateRangeChange() {
		this.setDateRange(this.dateFrom.value, this.dateTo.value)
		this.updateSelectedDateRange()
		// Close the menu after applying manual changes.
		this.schmancyMenu.open = false
	}

	/**
	 * Shifts the current date range by multiplying the range length with the given factor.
	 * Use a negative factor to shift backward.
	 */
	private shiftDateRange(factor: number) {
		const format = this.getDateFormat()
		const currentDiff = moment(this.dateTo.value).diff(moment(this.dateFrom.value), 'days') || 1
		const newDateFrom = moment(this.dateFrom.value)
			.add(factor * currentDiff, 'days')
			.format(format)
		const newDateTo = moment(this.dateTo.value)
			.add(factor * currentDiff, 'days')
			.format(format)
		this.setDateRange(newDateFrom, newDateTo)
		this.updateSelectedDateRange()
	}

	render() {
		return html`
			<div class="date-range-selector relative">
				<schmancy-menu class="z-100 w-max">
					<!-- The button slot: left/right arrows and the display text -->
					<schmancy-grid slot="button" align="center" cols="auto 1fr auto">
						<schmancy-icon-button
							@click=${(e: Event) => {
								e.preventDefault()
								e.stopPropagation()
								this.shiftDateRange(-1)
							}}
						>
							arrow_left
						</schmancy-icon-button>
						<schmancy-button class="w-max" variant="outlined" type="button">
							${this.selectedDateRange || 'Date range'}
						</schmancy-button>
						<schmancy-icon-button
							@click=${(e: Event) => {
								e.preventDefault()
								e.stopPropagation()
								this.shiftDateRange(1)
							}}
						>
							arrow_right
						</schmancy-icon-button>
					</schmancy-grid>

					<!-- The menu surface -->
					<schmancy-surface elevation="2">
						${this.presetRanges.map(
							preset => html`
								<schmancy-menu-item class="w-full" @click=${() => this.handlePresetChange(preset.label)}>
									<schmancy-grid class="w-full" align="center" cols="auto 1fr auto"> ${preset.label} </schmancy-grid>
								</schmancy-menu-item>
							`,
						)}
						<schmancy-grid gap="sm" flow="row" class="p-4">
							<schmancy-input
								id="checkin"
								min=${ifDefined(this.minDate)}
								.type=${this.type}
								label="${this.dateFrom.label}"
								.value=${this.dateFrom.value}
								@change=${(event: SchmancyInputChangeEvent) => {
									event.preventDefault()
									event.stopPropagation()
									const format = this.getDateFormat()
									const selectedDate = moment(event.detail.value, format).format(format)
									this.dateFrom.value = selectedDate
									// Update the checkout input's minimum date.
									this.checkOutInput.setAttribute('min', selectedDate)
								}}
							></schmancy-input>
							<schmancy-input
								id="checkout"
								min=${ifDefined(this.dateFrom.value)}
								max=${ifDefined(this.maxDate)}
								.type=${this.type}
								label="${this.dateTo.label}"
								.value=${this.dateTo.value}
								@change=${(event: SchmancyInputChangeEvent) => {
									event.preventDefault()
									event.stopPropagation()
									const format = this.getDateFormat()
									const selectedDate = moment(event.detail.value, format).format(format)
									this.dateTo.value = selectedDate
								}}
							></schmancy-input>

							<schmancy-button
								variant="outlined"
								@click=${(e: Event) => {
									e.preventDefault()
									e.stopPropagation()
									this.handleDateRangeChange()
								}}
							>
								Apply
							</schmancy-button>
						</schmancy-grid>
					</schmancy-surface>
				</schmancy-menu>
			</div>
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

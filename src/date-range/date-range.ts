import { $LitElement } from '@mixins/index'
import { SchmancyInputChangeEvent } from '@schmancy/input'
import SchmancyMenu from '@schmancy/menu/menu'
import { html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import moment from 'moment'

@customElement('schmancy-date-range')
export default class SwiftHRAdminDateRange extends $LitElement() {
	@property({ type: String }) type: 'date' | 'datetime-local' = 'date'
	@property({ type: Object }) dateFrom!: {
		label: string
		value: string
	}
	@property({ type: Object }) dateTo!: {
		label: string
		value: string
	}

	@query('#checkin') checkInInput!: HTMLInputElement
	@query('#checkout') checkOutInput!: HTMLInputElement

	@property({ type: String }) minDate: string | undefined
	@property({ type: String }) maxDate!: string | undefined
	@query('schmancy-menu') schmancyMenu!: SchmancyMenu

	@state() selectedDateRange: string = 'Today'

	presetRanges!: Array<{
		label: string
		range: {
			dateFrom: string
			dateTo: string
		}
		step: moment.unitOfTime.DurationConstructor | moment.unitOfTime._isoWeek
		selected?: boolean
	}>

	connectedCallback(): void {
		super.connectedCallback()
		this.presetRanges = [
			{
				label: 'Yesterday',
				range: {
					dateFrom: moment()
						.subtract(1, 'days')
						.startOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.subtract(1, 'days')
						.endOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
				step: 'day',
			},
			{
				label: 'Today',
				range: {
					dateFrom: moment()
						.startOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.endOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
				step: 'day',
			},
			// tomorrow
			{
				label: 'Tomorrow',
				range: {
					dateFrom: moment()
						.add(1, 'days')
						.startOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.add(1, 'days')
						.endOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
				step: 'day',
			},
			{
				label: 'This Week',
				range: {
					dateFrom: moment()
						.startOf('week')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.endOf('week')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
				step: 'weeks',
			},
			// last week
			{
				label: 'Last Week',
				range: {
					dateFrom: moment()
						.subtract(1, 'weeks')
						.startOf('isoWeek')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.subtract(1, 'weeks')
						.endOf('isoWeek')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
				step: 'weeks',
			},
			{
				label: 'This Month',
				range: {
					dateFrom: moment()
						.startOf('month')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.endOf('month')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
				step: 'month',
			},
			// { label: "Custom", range: () => this.setCustomRange() },
		]
		// set the state selectedDateRange based on the dateFrom and dateTo values
		const preset = this.presetRanges.find(
			range => range.range.dateFrom === this.dateFrom.value && range.range.dateTo === this.dateTo.value,
		)
		if (preset) {
			this.selectedDateRange = preset.label
		} else {
			this.selectedDateRange = moment(this.dateFrom.value)
				.format('MMM DD, YYYY')
				.concat(' To ', moment(this.dateTo.value).format('MMM DD, YYYY'))
		}
	}

	setDateRange(fromDate: string, toDate: string) {
		this.dateFrom.value = fromDate
		this.dateTo.value = toDate
		this.dispatchEvent(
			new CustomEvent<TSchmancDateRangePayload>('change', {
				detail: {
					dateFrom: this.dateFrom.value,
					dateTo: this.dateTo.value,
				},
			}),
		)
		this.requestUpdate()
	}

	handlePresetChange(presetLabel: string) {
		const preset = this.presetRanges.find(range => range.label === presetLabel)
		if (preset) {
			const { dateFrom, dateTo } = preset.range
			this.setDateRange(dateFrom, dateTo)
			this.selectedDateRange = presetLabel
		}
	}

	render() {
		return html`
			<div class="date-range-selector relative">
				<schmancy-menu class="z-100 w-max">
					<schmancy-grid slot="button" align="center" cols="auto 1fr auto">
						<schmancy-icon-button
							@click=${(e: Event) => {
								e.preventDefault()
								e.stopPropagation()
								// Calculate the difference between dateFrom and dateTo in days
								const dateDiff = moment(this.dateTo.value).diff(moment(this.dateFrom.value), 'days') || 1

								// Subtract the date difference from both dateFrom and dateTo
								this.dateFrom.value = moment(this.dateFrom.value)
									.subtract(dateDiff, 'days')
									.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')

								this.dateTo.value = moment(this.dateTo.value)
									.subtract(dateDiff, 'days')
									.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')

								// Call the function to handle the date range change
								this.handleDateRangeChange()
							}}
						>
							arrow_left
						</schmancy-icon-button>
						<schmancy-button class="w-max" variant="outlined" type="button"
							>${this.selectedDateRange || 'Date range'}
						</schmancy-button>
						<schmancy-icon-button
							@click=${(e: Event) => {
								e.preventDefault()
								e.stopPropagation()
								// Calculate the difference between dateFrom and dateTo in days
								const dateDiff = moment(this.dateTo.value).diff(moment(this.dateFrom.value), 'days') || 1

								// Add the date difference to both dateFrom and dateTo
								this.dateFrom.value = moment(this.dateFrom.value)
									.add(dateDiff, 'days')
									.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')

								this.dateTo.value = moment(this.dateTo.value)
									.add(dateDiff, 'days')
									.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')

								// Call the function to handle the date range change
								this.handleDateRangeChange()
							}}
							>arrow_right</schmancy-icon-button
						>
					</schmancy-grid>

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
								.label="${this.dateFrom.label}"
								.value=${this.dateFrom.value}
								@change=${(event: SchmancyInputChangeEvent) => {
									event.preventDefault()
									event.stopPropagation()
									const selectedDate = moment(
										event.detail.value,
										this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm',
									).format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')
									this.dateFrom.value = selectedDate
									const minDateStr = selectedDate
									this.checkOutInput.setAttribute('min', minDateStr)
								}}
							></schmancy-input>
							<schmancy-input
								id="checkout"
								.type=${this.type}
								label="${this.dateTo.label}"
								.value=${this.dateTo.value}
								@change=${(event: SchmancyInputChangeEvent) => {
									event.preventDefault()
									event.stopPropagation()
									this.dateTo.value = moment(
										event.detail.value,
										this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm',
									).format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm')
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

	handleDateRangeChange() {
		this.setDateRange(this.dateFrom.value, this.dateTo.value)
		// check if the selected date range is a preset
		const preset = this.presetRanges.find(
			range => range.range.dateFrom === this.dateFrom.value && range.range.dateTo === this.dateTo.value,
		)
		if (preset) {
			this.selectedDateRange = preset.label
		} else {
			this.selectedDateRange = moment(this.dateFrom.value)
				.format(this.type === 'date' ? 'MMM DD, YYYY' : 'MMM DD, YYYY hh:mm A')
				.concat(' - ', moment(this.dateTo.value).format(this.type === 'date' ? 'MMM DD, YYYY' : 'MMM DD, YYYY hh:mm A'))
			this.schmancyMenu.open = false
		}
	}
}

export type SchmancyDateRangeChangeEvent = CustomEvent<TSchmancDateRangePayload>
type TSchmancDateRangePayload = {
	dateFrom?: string
	dateTo?: string
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-date-range': SwiftHRAdminDateRange
	}
}

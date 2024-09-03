import { $LitElement } from '@mhmo91/lit-mixins/src'
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
		range: { dateFrom: string; dateTo: string }
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
			},
			{
				label: 'This Week',
				range: {
					dateFrom: moment()
						.startOf('week')
						.startOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.endOf('week')
						.endOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
			},
			// last week
			{
				label: 'Last Week',
				range: {
					dateFrom: moment()
						.subtract(1, 'weeks')
						.startOf('week')
						.startOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.subtract(1, 'weeks')
						.endOf('week')
						.endOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
			},
			{
				label: 'This Month',
				range: {
					dateFrom: moment()
						.startOf('month')
						.startOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
					dateTo: moment()
						.endOf('month')
						.endOf('day')
						.format(this.type === 'date' ? 'YYYY-MM-DD' : 'YYYY-MM-DDTHH:mm'),
				},
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
			this.selectedDateRange = this.dateFrom.value.concat(' - ', this.dateTo.value)
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
				<schmancy-menu class="z-100">
					<schmancy-button variant="outlined" slot="button" type="button"
						>${this.selectedDateRange || 'Date range'}
					</schmancy-button>

					${this.presetRanges.map(
						preset => html`
							<schmancy-menu-item @click=${() => this.handlePresetChange(preset.label)}>
								${preset.label}
							</schmancy-menu-item>
						`,
					)}
					<schmancy-surface elevation="2">
						<schmancy-grid gap="sm" flow="row" class="p-4">
							<schmancy-input
								id="checkin"
								min=${ifDefined(this.minDate)}
								type=${this.type}
								label="${this.dateFrom.label}"
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
								type=${this.type}
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
									this.setDateRange(this.dateFrom.value, this.dateTo.value)
									this.selectedDateRange = this.dateFrom.value.concat(' - ', this.dateTo.value)
									this.schmancyMenu.open = false
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

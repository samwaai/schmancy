import { $LitElement } from '@mhmo91/lit-mixins/src'
import { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete'
import { SchmancyChipsChangeEvent } from '@schmancy/chips'
import { PropertyValueMap, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import countries from './data/countries'

@customElement('demo-input')
export class DemoInput extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() country?: string
	@state() chip = 'chip2'
	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties)
		this.country = 'US'
	}

	connectedCallback(): void {
		super.connectedCallback()
	}
	render() {
		const options = [
			{
				value: 'option1',
				label: 'Option 1',
			},
			{
				value: 'option2',
				label: 'Option 2',
			},
			{
				value: 'option3',
				label: 'Option 3',
			},
		]
		const v = undefined
		return html`
			<schmancy-grid flow="row" justify="start" gap="md">
				<!-- Single-select example -->
				<schmancy-select .value=${v ?? ''} label="Choose an option">
					${repeat(
						options,
						o => o.value,
						option =>
							html` <schmancy-option value=${option.value} label=${option.label}> ${option.label} </schmancy-option>`,
					)}
				</schmancy-select>
				<!-- date range -->
				<!-- input number -->
				<schmancy-input step="0.01" type="number" label="Input number" placeholder="placeholder"></schmancy-input>

				<schmancy-date-range
					.dateFrom=${{
						label: 'Check-in',
						value: '2021-01-01',
					}}
					.dateTo=${{
						label: 'Check-out',
						value: '2021-01-02',
					}}
					@change=${(e: CustomEvent) => {
						console.log('e.detail', e.detail)
					}}
				></schmancy-date-range>

				<schmancy-grid justify="end">
					<schmancy-menu>
						<schmancy-menu-item>Item 1 with very long text </schmancy-menu-item>
						<schmancy-menu-item>Item 2</schmancy-menu-item>
						<schmancy-menu-item>Item 3</schmancy-menu-item>
					</schmancy-menu>
				</schmancy-grid>

				<schmancy-autocomplete
					@change=${(e: SchmancyAutocompleteChangeEvent) => {
						this.country = e.detail.value as string
						console.log('this.country', this.country)
					}}
					label="Country"
					.value=${this.country ?? ''}
				>
					${repeat(
						countries ?? [],
						c => c.code,
						category =>
							html` <schmancy-option label=${category.name ?? ''} value=${category.code ?? 0}>
								${category.name}
							</schmancy-option>`,
					)}
				</schmancy-autocomplete>

				<!-- <schmancy-chips
					.values=${['chip1']}
					multi
					@change=${(e: CustomEvent<SchmancyChipsChangeEvent>) => {
					console.log('e.detail', e.detail)
				}}
				>
					<schmancy-chip label="Chip 1" value="chip1"></schmancy-chip>
					<schmancy-chip label="Chip 2" value="chip2"></schmancy-chip>
					<schmancy-chip label="Chip 3" value="chip3"></schmancy-chip>
				</schmancy-chips> -->

				<!-- single -->
				<schmancy-button
					@click=${() => {
						this.chip = undefined
					}}
					>reset Chips</schmancy-button
				>
				<schmancy-chips
					.value=${this.chip}
					@change=${(e: CustomEvent<SchmancyChipsChangeEvent>) => {
						console.log('e.detail', e.detail)
					}}
				>
					<schmancy-chip label="Chip 1" value="chip1"></schmancy-chip>
					<schmancy-chip label="Chip 2" value="chip2"></schmancy-chip>
					<schmancy-chip label="Chip 3" value="chip3"></schmancy-chip>
				</schmancy-chips>
				<schmancy-textarea label="Textarea" placeholder="placeholder"></schmancy-textarea>

				<schmancy-autocomplete
					multi
					placeholder="Search for options"
					label="Select options"
					value="option1,option2"
					multi
					@change="${e => console.log('Selected values:', e.detail.value)}"
				>
					<schmancy-option value="option1" label="Option 1">
						Option 1
						<schmancy-icon-button
							@click=${e => {
								e.stopPropagation()
								e.preventDefault()
								console.log('edit')
							}}
							slot="support"
							>edit</schmancy-icon-button
						>
					</schmancy-option>
					<schmancy-option value="option2" label="Option 2">Option 2</schmancy-option>
					<schmancy-option value="option3" label="Option 3">Option 3</schmancy-option>
					<schmancy-option value="option4" label="Option 4">Option 4</schmancy-option>
				</schmancy-autocomplete>
				<schmancy-input
					type="date"
					label="Input"
					placeholder="placeholder"
					@change=${(e: Event) => {
						console.log('change', e)
					}}
				></schmancy-input>
				<!-- Single-select example -->
				<schmancy-select label="Choose an option" placeholder="Select an option">
					<schmancy-option value="option1" label="Option 1"> Option 1 </schmancy-option>
					<schmancy-option value="option2" label="Option 2"> Option 2 </schmancy-option>
					<schmancy-option value="option3" label="Option 3"> Option 3 </schmancy-option>
				</schmancy-select>

				<br />

				<!-- Multi-select example -->
				<schmancy-select label="Choose multiple options" placeholder="Select options" multi>
					<schmancy-option value="option1" label="Option 1"> Option 1</schmancy-option>
					<schmancy-option value="option2" label="Option 2"> Option 2</schmancy-option>
					<schmancy-option value="option3" label="Option 3">Option 3</schmancy-option>
					<schmancy-option value="option4" label="Option 4">Option 4</schmancy-option>
				</schmancy-select>
				<schmancy-form
					@submit=${() => {
						// e.preventDefault()
						console.log('submit')
					}}
				>
					<schmancy-payment-card-form
						@change=${e => {
							console.log(e.detail)
						}}
					></schmancy-payment-card-form>
					<!-- <schmancy-button type="submit">Submit</schmancy-button> -->
				</schmancy-form>
				<schmancy-input
					.error=${true}
					hint="another day another moment"
					label="Input"
					placeholder="placeholder"
				></schmancy-input>
				<schmancy-input label="disabled Input" placeholder="placeholder" disabled></schmancy-input>

				<schmancy-autocomplete
					@change=${(e: SchmancyAutocompleteChangeEvent) => {
						console.log('e.detail', e.detail)
					}}
					@reset=${() => {}}
					label="Status"
					value="All"
				>
					${[
						'All',
						'New',
						'Paid CC',
						'Approved',
						'Modified',
						'Checked-In',
						'Checked-Out',
						'No show',
						'Cancelled',
						'Invalid CC',
						'Debtor',
						'Problematic',
						'Prepaid',
						'Paid',
						'Paid bank',
						'Completed',
					].map(o => html` <schmancy-option .value="${o}" .label=${o}> ${o}</schmancy-option>`)}
				</schmancy-autocomplete>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-input': DemoInput
	}
}

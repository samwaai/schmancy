import { $LitElement } from '@mhmo91/lit-mixins/src'
import { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete'
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

	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties)
	
		this.country = 'US'
	}
	render() {
		return html`
			<schmancy-grid gap="md">
				<schmancy-surface type="containerLow" rounded="all">
					<schmancy-form
						class="p-4"
						@submit=${(e: SubmitEvent) => {
							// e.preventDefault()
							console.log('submit')
						}}
					>
						<schmancy-payment-card-form
							@change=${e => {
								console.log(e.detail)
							}}
						></schmancy-payment-card-form>
						<schmancy-button type="submit">Submit</schmancy-button>
					</schmancy-form>
				</schmancy-surface>
				<schmancy-input
					.error=${true}
					hint="another day another moment"
					label="Input"
					placeholder="placeholder"
				></schmancy-input>
				<schmancy-input label="disabled Input" placeholder="placeholder" disabled></schmancy-input>

				<schmancy-autocomplete label="Status" value="All">
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

				<schmancy-autocomplete
					@change=${(e: SchmancyAutocompleteChangeEvent) => {
						this.country = e.detail.value
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
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-input': DemoInput
	}
}

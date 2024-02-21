import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-input')
export class DemoInput extends $LitElement(css`
	:host {
		display: block;
	}
`) {
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
				<schmancy-input hint="another day another moment" label="Input" placeholder="placeholder"></schmancy-input>
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
					].map(o => html` <schmancy-option .value="${o}"> ${o}</schmancy-option>`)}
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

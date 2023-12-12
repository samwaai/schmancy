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

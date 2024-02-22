import { fullHeight } from './../../../src/directives/height'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { customElement } from 'lit/decorators.js'
import { css, html } from 'lit'

@customElement('demo-busy')
export class DemoBusy extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`
			<schmancy-grid ${fullHeight()} gap="md">
				<schmancy-busy>
					<schmancy-spinner size="48px"></schmancy-spinner>
				</schmancy-busy>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-busy': DemoBusy
	}
}

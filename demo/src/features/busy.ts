import { fullHeight } from './../../../src/directives/height'
import { $LitElement } from '@mixins/lit'
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
				<!-- <schmancy-busy>
				</schmancy-busy> -->
				<schmancy-spinner size="24px"></schmancy-spinner>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-busy': DemoBusy
	}
}

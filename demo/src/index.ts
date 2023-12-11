import { $LitElement } from '@mhmo91/lit-mixins/src'
import '@schmancy/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import './features/index'
@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	connectedCallback(): void {
		super.connectedCallback()
	}
	render() {
		return html`
			<schmancy-flex class="w-full mx-4 my-6" gap="md" flow="row" align="center">
				<schmancy-typography type="display">Schmancy Demo</schmancy-typography>
				<schmancy-tab-group>
					<schmancy-tab label="Typography">
						<demo-typography class="py-4"></demo-typography>
					</schmancy-tab>
					<schmancy-tab active label="Buttons">
						<demo-button class="py-4"></demo-button>
					</schmancy-tab>
				</schmancy-tab-group>
			</schmancy-flex>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}

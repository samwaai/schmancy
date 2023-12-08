import { $LitElement } from '@mhmo91/lit-mixins/src'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@schmancy/index'
import './features/index'
@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	render() {
		return html`
			<schmancy-flex class="w-full mx-4 my-6" gap="md" flow="row" align="center">
				<schmancy-typography type="display">Schmancy Demo</schmancy-typography>
				<schmancy-tab-group>
					<schmancy-tab active label="Typography"> <demo-typography class="py-4"></demo-typography> </schmancy-tab>
					<schmancy-tab label="Tab 2"> Tab 2 content </schmancy-tab>
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

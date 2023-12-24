import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('demo-tabs')
export class DemoTabs extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	render() {
		return html`<schmancy-tab-group>
			<schmancy-tab label="Card">
				<demo-card class="py-4"></demo-card>
			</schmancy-tab>
			<schmancy-tab label="Inputs">
				<demo-input class="py-4"></demo-input>
			</schmancy-tab>
			<schmancy-tab label="Typography">
				<demo-typography class="py-4"></demo-typography>
			</schmancy-tab>

			<schmancy-tab label="Sheet">
				<demo-sheet class="py-4"></demo-sheet>
			</schmancy-tab>

			<schmancy-tab active label="Content Drawer">
				<demo-content-drawer class="py-4"></demo-content-drawer>
			</schmancy-tab>
		</schmancy-tab-group>`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'demo-tabs': DemoTabs
	}
}

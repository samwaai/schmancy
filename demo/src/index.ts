import { $LitElement } from '@mhmo91/lit-mixins/src'
import '@schmancy/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import './features/index'

@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	render() {
		return html`
			<schmancy-container>
				<schmancy-flex class="w-full px-4 py-6" gap="md" flow="row" align="center">
					<schmancy-typography type="display">Schmancy Demo</schmancy-typography>
					<schmancy-tab-group>
						<schmancy-tab active label="Layout">
							<demo-layout class="py-4"></demo-layout>
						</schmancy-tab>
						<schmancy-tab label="Inputs">
							<demo-input class="py-4"></demo-input>
						</schmancy-tab>
						<schmancy-tab label="Typography">
							<demo-typography class="py-4"></demo-typography>
						</schmancy-tab>
						<schmancy-tab label="Buttons">
							<demo-button class="py-4"></demo-button>
						</schmancy-tab>
						<schmancy-tab label="Lists">
							<demo-list class="py-4"></demo-list>
						</schmancy-tab>
						<schmancy-tab label="Sheet">
							<demo-sheet class="py-4"></demo-sheet>
						</schmancy-tab>
						<schmancy-tab label="Root">
							<demo-tree class="py-4"></demo-tree>
						</schmancy-tab>
					</schmancy-tab-group>
				</schmancy-flex>
			</schmancy-container>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}

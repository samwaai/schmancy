import { $LitElement } from '@mhmo91/lit-mixins/src'
import '@schmancy/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import './features/index'
import { DemoButton } from './features/index'
import { fullHeight } from '../../src/directives/height'

@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	connectedCallback(): void {
		super.connectedCallback()
	}

	render() {
		return html`
			<schmancy-surface ${fullHeight()} type="container">
				<schmancy-nav-drawer>
					<schmancy-nav-drawer-navbar width="220px">
						<demo-nav> </demo-nav>
					</schmancy-nav-drawer-navbar>
					<schmancy-nav-drawer-content class="pl-2">
						<schmancy-nav-drawer-appbar class="py-2">
							<!-- <schmancy-typography type="display">Schmancy Demo</schmancy-typography> -->
						</schmancy-nav-drawer-appbar>
						<schmancy-surface type="surface" rounded="left">
							<schmancy-area class="p-4" name="main" .default=${DemoButton}></schmancy-area>
						</schmancy-surface>
					</schmancy-nav-drawer-content>
				</schmancy-nav-drawer>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}

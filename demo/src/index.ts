import { $LitElement } from '@mhmo91/lit-mixins/src'
import '@schmancy/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { $newSchmancyTheme } from '@schmancy/index'
import './features/index'
import { DemoButton } from './features/index'

@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	connectedCallback(): void {
		super.connectedCallback()
		$newSchmancyTheme.next('#f5f5f5')
	}
	render() {
		return html`
			<schmancy-surface type="container">
				<schmancy-nav-drawer>
					<schmancy-nav-drawer-navbar>
						<demo-nav> </demo-nav>
					</schmancy-nav-drawer-navbar>
					<schmancy-nav-drawer-content class="pl-4">
						<schmancy-nav-drawer-appbar class="py-4">
							<schmancy-typography type="display">Schmancy Demo</schmancy-typography>
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

import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import '@schmancy/nav-drawer'

// Import all individual core demo components to ensure they're registered
import './buttons'
import './typography'
import './surfaces'
import './icons'
import './cards'

// Main Core Demos Component
@customElement('demo-core-demos')
export class DemoCoreDemo extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() private activeDemo = 'buttons'

	connectedCallback() {
		super.connectedCallback()

		// Subscribe to area changes to update active demo
		area.on('core').subscribe(route => {
			if (!route?.component) return

			// Map component names to demo names
			const componentToDemoMap: Record<string, string> = {
				'demo-core-buttons': 'buttons',
				'demo-core-typography': 'typography',
				'demo-core-surfaces': 'surfaces',
				'demo-core-icons': 'icons',
				'demo-core-cards': 'cards',
			}

			const demoName = componentToDemoMap[route.component]
			if (demoName) {
				this.activeDemo = demoName
			}
		})
	}

	render() {
		return html`
			<schmancy-nav-drawer>
				<schmancy-nav-drawer-navbar width="220px">
					<schmancy-list>
						<schmancy-list-item
							.selected=${this.activeDemo === 'buttons'}
							@click=${() => {
								this.activeDemo = 'buttons'
								area.push({ component: 'demo-core-buttons', area: 'core' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">smart_button</schmancy-icon>
								<span>Buttons</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'typography'}
							@click=${() => {
								this.activeDemo = 'typography'
								area.push({ component: 'demo-core-typography', area: 'core' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">text_fields</schmancy-icon>
								<span>Typography</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'surfaces'}
							@click=${() => {
								this.activeDemo = 'surfaces'
								area.push({ component: 'demo-core-surfaces', area: 'core' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">layers</schmancy-icon>
								<span>Surfaces</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'icons'}
							@click=${() => {
								this.activeDemo = 'icons'
								area.push({ component: 'demo-core-icons', area: 'core' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">palette</schmancy-icon>
								<span>Icons</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'cards'}
							@click=${() => {
								this.activeDemo = 'cards'
								area.push({ component: 'demo-core-cards', area: 'core' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">dashboard</schmancy-icon>
								<span>Cards</span>
							</sch-flex>
						</schmancy-list-item>
					</schmancy-list>
				</schmancy-nav-drawer-navbar>
				<schmancy-nav-drawer-content class="pl-2">
					<schmancy-scroll>
						<schmancy-area name="core" .default=${'demo-core-buttons'}>
							<schmancy-route when="buttons" .component=${'demo-core-buttons'}></schmancy-route>
							<schmancy-route when="typography" .component=${'demo-core-typography'}></schmancy-route>
							<schmancy-route when="surfaces" .component=${'demo-core-surfaces'}></schmancy-route>
							<schmancy-route when="icons" .component=${'demo-core-icons'}></schmancy-route>
							<schmancy-route when="cards" .component=${'demo-core-cards'}></schmancy-route>
						</schmancy-area>
					</schmancy-scroll>
				</schmancy-nav-drawer-content>
			</schmancy-nav-drawer>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-core-demos': DemoCoreDemo
	}
}

// Default export for lazy loading
export default DemoCoreDemo
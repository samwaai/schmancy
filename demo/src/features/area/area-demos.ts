import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import '@schmancy/nav-drawer'

// Import all individual area demo components to ensure they're registered
import './overview'
import './basic'
import './params'
import './state'
import './default'
import './history'
import './multi'
// import './routing' - removed as file was deleted
import './guard-demo'
import './lazy-demo'

// Main Demo Area Component
@customElement('demo-area-demos')
export class DemoAreaDemos extends $LitElement() {
	@state() private activeDemo = 'overview'

	connectedCallback() {
		super.connectedCallback()

		// Subscribe to area changes to update active demo
		area.on('area').subscribe(route => {
			if (!route?.component) return

			// Map component names to demo names
			const componentToDemoMap: Record<string, string> = {
				'demo-area': 'overview',
				'demo-area-basic': 'basic',
				'demo-area-params': 'params',
				'demo-area-state': 'state',
				'demo-area-default': 'default',
				'demo-area-history': 'history',
				'demo-area-multi': 'multi',
				// 'demo-area-routing': 'routing', - removed
				'demo-area-guards': 'guards',
				'demo-area-lazy': 'lazy',
			}

			const demoName = componentToDemoMap[route.component]
			if (demoName) {
				this.activeDemo = demoName
			}
		})

		// // Push default component only if area is empty on initial load
		// if (!area.current.get('area')?.component) {
		//   area.push({
		//     area: 'area',
		//     component: DemoArea
		//   });
		// }
	}

	render() {
		return html`
			<schmancy-nav-drawer>
				<schmancy-nav-drawer-navbar width="220px">
					<schmancy-list>
						<schmancy-list-item
							.selected=${this.activeDemo === 'overview'}
							@click=${() => {
								this.activeDemo = 'overview'
								area.push({ component: 'demo-area', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">dashboard</schmancy-icon>
								<span>Overview</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'basic'}
							@click=${() => {
								this.activeDemo = 'basic'
								area.push({ component: 'demo-area-basic', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">navigation</schmancy-icon>
								<span>Basic</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'params'}
							@click=${() => {
								this.activeDemo = 'params'
								area.push({ component: 'demo-area-params', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">tag</schmancy-icon>
								<span>Params</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'state'}
							@click=${() => {
								this.activeDemo = 'state'
								area.push({ component: 'demo-area-state', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">storage</schmancy-icon>
								<span>State</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'default'}
							@click=${() => {
								this.activeDemo = 'default'
								area.push({ component: 'demo-area-default', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">home</schmancy-icon>
								<span>Default</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'history'}
							@click=${() => {
								this.activeDemo = 'history'
								area.push({ component: 'demo-area-history', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">history</schmancy-icon>
								<span>History</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'multi'}
							@click=${() => {
								this.activeDemo = 'multi'
								area.push({ component: 'demo-area-multi', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">view_module</schmancy-icon>
								<span>Multi</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'guards'}
							@click=${() => {
								this.activeDemo = 'guards'
								area.push({ component: 'demo-area-guards', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">security</schmancy-icon>
								<span>Guards</span>
							</sch-flex>
						</schmancy-list-item>

						<!-- Routing demo removed as file was deleted -->

						<schmancy-list-item
							.selected=${this.activeDemo === 'lazy'}
							@click=${() => {
								this.activeDemo = 'lazy'
								area.push({ component: 'demo-area-lazy', area: 'area' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">hourglass_empty</schmancy-icon>
								<span>Lazy Loading</span>
							</sch-flex>
						</schmancy-list-item>
					</schmancy-list>
				</schmancy-nav-drawer-navbar>
				<schmancy-nav-drawer-content class="pl-2">
					<schmancy-scroll>
						<schmancy-area name="area" .default=${'demo-area-basic'}>
							<schmancy-route when="basic" .component=${'demo-area-basic'}></schmancy-route>
							<schmancy-route when="demo-area" .component=${'demo-area'}></schmancy-route>
							<schmancy-route when="guards" .component=${'demo-area-guards'}></schmancy-route>
						</schmancy-area>
					</schmancy-scroll>
				</schmancy-nav-drawer-content>
			</schmancy-nav-drawer>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-demos': DemoAreaDemos
	}
}

import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import '@schmancy/nav-drawer'

// Import all individual feedback demo components to ensure they're registered
import './progress'
import './loading'
import './notifications'

// Main Feedback Demos Component
@customElement('demo-feedback-demos')
export class DemoFeedbackDemos extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() private activeDemo = 'progress'

	connectedCallback() {
		super.connectedCallback()

		// Subscribe to area changes to update active demo
		area.on('feedback').subscribe(route => {
			if (!route?.component) return

			// Map component names to demo names
			const componentToDemoMap: Record<string, string> = {
				'demo-feedback-progress': 'progress',
				'demo-feedback-loading': 'loading',
				'demo-feedback-notifications': 'notifications',
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
							.selected=${this.activeDemo === 'progress'}
							@click=${() => {
								this.activeDemo = 'progress'
								area.push({ component: 'demo-feedback-progress', area: 'feedback' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">percent</schmancy-icon>
								<span>Progress</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'loading'}
							@click=${() => {
								this.activeDemo = 'loading'
								area.push({ component: 'demo-feedback-loading', area: 'feedback' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">hourglass_empty</schmancy-icon>
								<span>Loading</span>
							</sch-flex>
						</schmancy-list-item>

						<schmancy-list-item
							.selected=${this.activeDemo === 'notifications'}
							@click=${() => {
								this.activeDemo = 'notifications'
								area.push({ component: 'demo-feedback-notifications', area: 'feedback' })
							}}
							rounded
							variant="container"
						>
							<sch-flex flow="row" gap="2" align="center">
								<schmancy-icon size="sm">notifications</schmancy-icon>
								<span>Notifications</span>
							</sch-flex>
						</schmancy-list-item>
					</schmancy-list>
				</schmancy-nav-drawer-navbar>
				<schmancy-nav-drawer-content class="pl-2">
					<schmancy-scroll>
						<schmancy-area name="feedback" .default=${'demo-feedback-progress'}>
							<schmancy-route when="progress" .component=${'demo-feedback-progress'}></schmancy-route>
							<schmancy-route when="loading" .component=${'demo-feedback-loading'}></schmancy-route>
							<schmancy-route when="notifications" .component=${'demo-feedback-notifications'}></schmancy-route>
						</schmancy-area>
					</schmancy-scroll>
				</schmancy-nav-drawer-content>
			</schmancy-nav-drawer>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-feedback-demos': DemoFeedbackDemos
	}
}

// Default export for lazy loading
export default DemoFeedbackDemos
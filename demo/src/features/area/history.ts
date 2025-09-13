import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { area } from '@schmancy/area'

// Demo components
@customElement('area-history-page')
class AreaHistoryPage extends $LitElement() {
	@property({ type: Number }) pageNumber = 1

	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Page ${this.pageNumber}</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-4">
					This is page ${this.pageNumber}. Use your browser's back/forward buttons to navigate.
				</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
					URL: ${window.location.href}
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('demo-area-history')
export class DemoAreaHistory extends $LitElement() {
	@state() historyLog: string[] = []
	@state() currentStrategy: 'push' | 'replace' | 'none' = 'push'

	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					History Management Strategies
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Control how area navigation interacts with the browser's history API.
				</schmancy-typography>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Overview</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block">
						The area system supports three history strategies that control how navigation affects the browser's history stack:
					</schmancy-typography>
					<ul class="list-disc ml-6 space-y-2">
						<li><strong>push:</strong> Adds a new entry to the history (default)</li>
						<li><strong>replace:</strong> Replaces the current history entry</li>
						<li><strong>none:</strong> No history modification</li>
					</ul>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Live Examples</schmancy-typography>
					
					<div class="space-y-6">
						<!-- Push Strategy -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">Push Strategy (Default)</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
								Each navigation creates a new history entry. Browser back/forward buttons work as expected.
							</schmancy-typography>
							
							<div class="mb-4 flex gap-4">
								<schmancy-button @click=${() => this.navigateWithPush(1)}>
									Page 1
								</schmancy-button>
								<schmancy-button @click=${() => this.navigateWithPush(2)}>
									Page 2
								</schmancy-button>
								<schmancy-button @click=${() => this.navigateWithPush(3)}>
									Page 3
								</schmancy-button>
							</div>
							
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[150px]">
								<schmancy-area name="history-demo-push"></schmancy-area>
							</schmancy-surface>
						</schmancy-surface>

						<!-- Replace Strategy -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">Replace Strategy</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
								Navigation replaces the current history entry. No history buildup occurs.
							</schmancy-typography>
							
							<div class="mb-4 flex gap-4">
								<schmancy-button @click=${() => this.navigateWithReplace(1)}>
									Page 1
								</schmancy-button>
								<schmancy-button @click=${() => this.navigateWithReplace(2)}>
									Page 2
								</schmancy-button>
								<schmancy-button @click=${() => this.navigateWithReplace(3)}>
									Page 3
								</schmancy-button>
							</div>
							
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[150px]">
								<schmancy-area name="history-demo-replace"></schmancy-area>
							</schmancy-surface>
						</schmancy-surface>

						<!-- None Strategy -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">None Strategy</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
								Navigation doesn't affect browser history at all. URL remains unchanged.
							</schmancy-typography>
							
							<div class="mb-4 flex gap-4">
								<schmancy-button @click=${() => this.navigateWithNone(1)}>
									Page 1
								</schmancy-button>
								<schmancy-button @click=${() => this.navigateWithNone(2)}>
									Page 2
								</schmancy-button>
								<schmancy-button @click=${() => this.navigateWithNone(3)}>
									Page 3
								</schmancy-button>
							</div>
							
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[150px]">
								<schmancy-area name="history-demo-none"></schmancy-area>
							</schmancy-surface>
						</schmancy-surface>

						<!-- History Log -->
						<schmancy-surface type="container" class="rounded-lg p-6">
							<schmancy-typography type="title" token="md" class="mb-4 block">Navigation Log</schmancy-typography>
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto">
								${this.historyLog.length > 0 ? html`
									<div class="space-y-1">
										${this.historyLog.map(log => html`
											<schmancy-typography type="body" token="sm" class="font-mono text-xs">
												${log}
											</schmancy-typography>
										`)}
									</div>
								` : html`
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Navigation events will appear here...
									</schmancy-typography>
								`}
							</schmancy-surface>
						</schmancy-surface>
					</div>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Implementation</schmancy-typography>
					
					<div class="space-y-6">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">1. Push Strategy (Default)</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Creates new history entry
area.push({
  area: 'main',
  component: 'page-component',
  historyStrategy: 'push' // Optional, this is the default
})

// User can navigate back/forward through history`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">2. Replace Strategy</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Replaces current history entry
area.push({
  area: 'main',
  component: 'page-component',
  historyStrategy: 'replace'
})

// Useful for:
// - Form steps where you don't want back button to revisit each step
// - Redirects after login
// - Replacing error states`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">3. None Strategy</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// No history modification
area.push({
  area: 'sidebar',
  component: 'sidebar-content',
  historyStrategy: 'none'
})

// Useful for:
// - Modal/dialog content
// - Sidebar updates
// - Any navigation that shouldn't affect URL`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">4. Handling Browser Navigation</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Listen for browser back/forward
window.addEventListener('popstate', (event) => {
  // Area system automatically handles this
  // Components will update based on URL
})

// Programmatic navigation
history.back()  // Go back
history.forward()  // Go forward
history.go(-2)  // Go back 2 entries`}
							</schmancy-code-preview>
						</div>
					</div>
				</div>

				<div>
					<schmancy-typography type="title" token="lg" class="mb-4 block">When to Use Each Strategy</schmancy-typography>
					<div class="space-y-4">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Push Strategy</schmancy-typography>
							<ul class="list-disc ml-6 space-y-1">
								<li>Main application navigation</li>
								<li>When users expect back button to work</li>
								<li>Deep linking to specific pages</li>
								<li>Standard page-to-page navigation</li>
							</ul>
						</div>
						
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Replace Strategy</schmancy-typography>
							<ul class="list-disc ml-6 space-y-1">
								<li>Form wizard steps</li>
								<li>Post-login redirects</li>
								<li>Error page replacements</li>
								<li>Preventing back button loops</li>
							</ul>
						</div>
						
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">None Strategy</schmancy-typography>
							<ul class="list-disc ml-6 space-y-1">
								<li>Modal/dialog content</li>
								<li>Sidebar updates</li>
								<li>Tab switches within a page</li>
								<li>Any UI that shouldn't affect URL</li>
							</ul>
						</div>
					</div>
				</div>
			</schmancy-surface>
		`
	}

	connectedCallback() {
		super.connectedCallback()
		// Listen for navigation events
		window.addEventListener('popstate', this.handlePopState)
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		window.removeEventListener('popstate', this.handlePopState)
		// Clean up areas
		area.pop('history-demo-push')
		area.pop('history-demo-replace')
		area.pop('history-demo-none')
	}

	private handlePopState = () => {
		this.logNavigation('Browser navigation (back/forward)', window.location.href)
	}

	private logNavigation(action: string, url: string) {
		const timestamp = new Date().toLocaleTimeString()
		this.historyLog = [...this.historyLog, `[${timestamp}] ${action} - ${url}`].slice(-10)
	}

	private navigateWithPush(pageNumber: number) {
		area.push({
			area: 'history-demo-push',
			component: 'area-history-page',
			params: { pageNumber },
			historyStrategy: 'push'
		})
		this.logNavigation(`Push strategy: Page ${pageNumber}`, window.location.href)
	}

	private navigateWithReplace(pageNumber: number) {
		area.push({
			area: 'history-demo-replace',
			component: 'area-history-page',
			params: { pageNumber },
			historyStrategy: 'replace'
		})
		this.logNavigation(`Replace strategy: Page ${pageNumber}`, window.location.href)
	}

	private navigateWithNone(pageNumber: number) {
		area.push({
			area: 'history-demo-none',
			component: 'area-history-page',
			params: { pageNumber },
			historyStrategy:'silent'
		})
		this.logNavigation(`None strategy: Page ${pageNumber}`, 'URL unchanged')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-history': DemoAreaHistory
		'area-history-page': AreaHistoryPage
	}
}
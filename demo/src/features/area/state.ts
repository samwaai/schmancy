import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { area } from '@schmancy/area'

// Simple component that subscribes to state
@customElement('area-state-display')
class AreaStateDisplay extends $LitElement() {
	@state() stateData: any = null

	connectedCallback() {
		super.connectedCallback()
		// Subscribe to state changes
		area.getState('state-demo').subscribe((state: any) => {
			this.stateData = state
		})
	}

	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">State Data</schmancy-typography>
				${this.stateData ? html`
					<pre class="bg-surface-container p-4 rounded overflow-x-auto">
						<code>${JSON.stringify(this.stateData, null, 2)}</code>
					</pre>
				` : html`
					<schmancy-typography type="body" token="lg">No state data</schmancy-typography>
				`}
			</schmancy-surface>
		`
	}
}

@customElement('demo-area-state')
export class DemoAreaState extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Area State Management
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Pass complex state objects to components and subscribe to state changes.
				</schmancy-typography>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Live Example</schmancy-typography>
					
					<schmancy-surface type="container" class="rounded-lg p-6">
						<div class="mb-4 flex gap-4">
							<schmancy-button @click=${() => this.loadStateA()}>
								Load State A
							</schmancy-button>
							<schmancy-button @click=${() => this.loadStateB()}>
								Load State B
							</schmancy-button>
							<schmancy-button @click=${() => this.updateState()}>
								Update State
							</schmancy-button>
							<schmancy-button @click=${() => area.pop('state-demo')} variant="outlined">
								Clear
							</schmancy-button>
						</div>
						
						<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
							<schmancy-area name="state-demo"></schmancy-area>
						</schmancy-surface>
					</schmancy-surface>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Implementation</schmancy-typography>
					
					<div class="space-y-6">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">1. Navigate with state</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`area.push({
  area: 'my-area',
  component: 'my-component',
  state: {
    user: { name: 'John', role: 'admin' },
    settings: { theme: 'dark' }
  }
})`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">2. Subscribe to state in your component</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`connectedCallback() {
  super.connectedCallback()
  // Subscribe to state changes
  area.getState('my-area').subscribe((state) => {
    this.stateData = state
  })
}`}
							</schmancy-code-preview>
						</div>
					</div>
				</div>
			</schmancy-surface>
		`
	}

	private loadStateA() {
		area.push({
			area: 'state-demo',
			component: 'area-state-display',
			state: {
				name: 'State A',
				timestamp: new Date().toISOString(),
				data: {
					value: 42,
					items: ['Item 1', 'Item 2', 'Item 3']
				}
			}
		})
	}

	private loadStateB() {
		area.push({
			area: 'state-demo',
			component: 'area-state-display',
			state: {
				name: 'State B',
				timestamp: new Date().toISOString(),
				data: {
					value: 100,
					items: ['Apple', 'Banana', 'Cherry']
				}
			}
		})
	}

	private updateState() {
		// Get current state
		const currentState = area.getRoute('state-demo')?.state || {}
		
		// Update with new data
		area.push({
			area: 'state-demo',
			component: 'area-state-display',
			state: {
				...currentState,
				timestamp: new Date().toISOString(),
				updated: true
			}
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		area.pop('state-demo')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-state': DemoAreaState
		'area-state-display': AreaStateDisplay
	}
}
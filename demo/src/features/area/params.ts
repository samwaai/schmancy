import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { area } from '@mhmo91/schmancy/area'


// Demo component that receives parameters
@customElement('area-params-display')
class AreaParamsDisplay extends $LitElement() {
	@property() userId?: string
	@property() name?: string
	@property({ type: Number }) age?: number

	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Component with Parameters</schmancy-typography>
				<div class="space-y-2">
					<schmancy-typography type="body" token="lg">
						User ID: <code class="bg-surface-container px-2 py-1 rounded">${this.userId || 'Not provided'}</code>
					</schmancy-typography>
					<schmancy-typography type="body" token="lg">
						Name: <code class="bg-surface-container px-2 py-1 rounded">${this.name || 'Not provided'}</code>
					</schmancy-typography>
					<schmancy-typography type="body" token="lg">
						Age: <code class="bg-surface-container px-2 py-1 rounded">${this.age ?? 'Not provided'}</code>
					</schmancy-typography>
				</div>
			</schmancy-surface>
		`
	}
}

@customElement('demo-area-params')
export class DemoAreaParams extends $LitElement() {
	@state() userIdInput = '12345'
	@state() nameInput = 'John Doe'
	@state() ageInput = '25'

	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Area Navigation with Parameters
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Pass parameters to components when navigating. Parameters become properties on the target component.
				</schmancy-typography>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Overview</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block">
						When navigating to a component, you can pass parameters that will be set as properties on the target component.
						This allows you to create dynamic, data-driven navigation experiences.
					</schmancy-typography>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Live Example</schmancy-typography>
					
					<schmancy-surface type="container" class="rounded-lg p-6">
						<div class="mb-4 grid grid-cols-3 gap-4">
							<schmancy-input
								label="User ID"
								.value=${this.userIdInput}
								@input=${(e: Event) => this.userIdInput = (e.target as HTMLInputElement).value}
							></schmancy-input>
							<schmancy-input
								label="Name"
								.value=${this.nameInput}
								@input=${(e: Event) => this.nameInput = (e.target as HTMLInputElement).value}
							></schmancy-input>
							<schmancy-input
								label="Age"
								type="number"
								.value=${this.ageInput}
								@input=${(e: Event) => this.ageInput = (e.target as HTMLInputElement).value}
							></schmancy-input>
						</div>
						
						<div class="mb-4 flex gap-4">
							<schmancy-button @click=${() => this.loadComponent()}>
								Load Component
							</schmancy-button>
							<schmancy-button @click=${() => area.pop('params-demo')} variant="outlined">
								Clear
							</schmancy-button>
						</div>
						
						<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
							<schmancy-area name="params-demo"></schmancy-area>
						</schmancy-surface>
					</schmancy-surface>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Implementation</schmancy-typography>
					
					<div class="space-y-6">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">1. Create a component with properties</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('user-profile')
class UserProfile extends LitElement {
  @property() userId?: string
  @property() tab?: string

  render() {
    return html\`
      <div>
        <h2>User Profile</h2>
        <p>User ID: \${this.userId}</p>
        <p>Active Tab: \${this.tab}</p>
      </div>
    \`
  }
}`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">2. Navigate with parameters</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`area.push({
  area: 'user-area',
  component: 'user-profile',
  params: {
    userId: '12345',
    tab: 'settings'
  }
})`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">3. Parameters with different types</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// String parameters
area.push({
  area: 'demo-area',
  component: 'my-component',
  params: {
    name: 'John Doe',
    role: 'admin'
  }
})

// Number parameters
area.push({
  area: 'demo-area',
  component: 'product-view',
  params: {
    productId: 'PROD-123',
    quantity: 5,
    price: 99.99
  }
})

// Boolean parameters
area.push({
  area: 'demo-area',
  component: 'settings-panel',
  params: {
    darkMode: true,
    notifications: false
  }
})`}
							</schmancy-code-preview>
						</div>
					</div>
				</div>

				<div>
					<schmancy-typography type="title" token="lg" class="mb-4 block">Best Practices</schmancy-typography>
					<ul class="list-disc ml-6 space-y-2">
						<li>Always declare properties using <code>@property()</code> decorator</li>
						<li>Use TypeScript for type safety with parameters</li>
						<li>Provide default values for optional parameters</li>
						<li>Parameters are passed as-is, so ensure correct types</li>
						<li>Complex objects can be passed through the state mechanism instead</li>
					</ul>
				</div>
			</schmancy-surface>
		`
	}

	private loadComponent() {
		area.push({
			area: 'params-demo',
			component: 'area-params-display',
			params: {
				userId: this.userIdInput,
				name: this.nameInput,
				age: parseInt(this.ageInput, 10)
			}
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up when leaving the demo
		area.pop('params-demo')
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-params': DemoAreaParams
		'area-params-display': AreaParamsDisplay
	}
}
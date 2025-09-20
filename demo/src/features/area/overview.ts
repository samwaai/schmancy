import { $LitElement } from '@mixins/index'
import { area } from '@schmancy/area'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Simple demo components
@customElement('area-demo-home-page')
class AreaDemoHomePage extends $LitElement() {
	render() {
		return html`
			<div class="p-8 text-center">
				<schmancy-icon size="64" class="text-primary mb-4">home</schmancy-icon>
				<schmancy-typography type="headline" token="lg" class="mb-2">Welcome Home</schmancy-typography>
				<schmancy-typography type="body" token="md" class="text-surface-onVariant">
					This is the home page component
				</schmancy-typography>
			</div>
		`
	}
}

@customElement('area-demo-about-page')
class AreaDemoAboutPage extends $LitElement() {
	render() {
		return html`
			<div class="p-8 text-center">
				<schmancy-icon size="64" class="text-secondary mb-4">info</schmancy-icon>
				<schmancy-typography type="headline" token="lg" class="mb-2">About Us</schmancy-typography>
				<schmancy-typography type="body" token="md" class="text-surface-onVariant">
					Learn more about our amazing team
				</schmancy-typography>
			</div>
		`
	}
}

@customElement('area-demo-contact-page')
class AreaDemoContactPage extends $LitElement() {
	render() {
		return html`
			<div class="p-8 text-center">
				<schmancy-icon size="64" class="text-tertiary mb-4">mail</schmancy-icon>
				<schmancy-typography type="headline" token="lg" class="mb-2">Contact Us</schmancy-typography>
				<schmancy-typography type="body" token="md" class="text-surface-onVariant">
					Get in touch with our team
				</schmancy-typography>
			</div>
		`
	}
}

@customElement('area-demo-user-profile')
class AreaDemoUserProfile extends $LitElement() {
	@property({ type: String }) userId?: string
	@property({ type: String }) username?: string

	render() {
		return html`
			<div class="p-8">
				<schmancy-icon size="64" class="text-tertiary mb-4">person</schmancy-icon>
				<schmancy-typography type="headline" token="lg" class="mb-4">User Profile</schmancy-typography>
				<schmancy-surface type="container" class="p-4 rounded-lg">
					<div class="space-y-2">
						<div><strong>User ID:</strong> ${this.userId || 'Not provided'}
						<div><strong>Username:</strong> ${this.username || 'Not provided'}
					</div>
				</schmancy-surface>
			</div>
		`
	}
}

@customElement('area-demo-props-example')
class AreaDemoPropsExample extends $LitElement() {
	@property({ type: String }) heading?: string
	@property({ type: Object }) data?: any
	@property({ attribute: false }) onClick?: () => void

	render() {
		return html`
			<div class="p-8">
				<schmancy-icon size="64" class="text-primary mb-4">widgets</schmancy-icon>
				<schmancy-typography type="headline" token="lg" class="mb-4">
					${this.heading || 'Props Example'}
				</schmancy-typography>
				<schmancy-surface type="container" class="p-4 rounded-lg">
					<div class="space-y-4">
						<div><strong>Title prop:</strong> ${this.heading || 'Not provided'}</div>
						<div><strong>Data prop:</strong> ${this.data ? JSON.stringify(this.data) : 'Not provided'}</div>
						<div><strong>onClick prop:</strong> ${this.onClick ? 'Function provided' : 'Not provided'}</div>
						${this.onClick ? html`
							<schmancy-button 
								variant="filled"
								@click=${() => this.onClick?.()}
							>
								Trigger Callback
							</schmancy-button>
						` : ''}
					</div>
				</schmancy-surface>
			</div>
		`
	}
}

@customElement('demo-area')
export class DemoArea extends $LitElement() {
	// Code examples as string literals to prevent execution
	private readonly codeExamples = {
		import: `import '@mhmo91/schmancy/area'
import { area } from '@mhmo91/schmancy/area'`,

		quickStart: `<!-- 1. Add an area to your HTML -->
<schmancy-area name="main"></schmancy-area>

<script type="module">
  import { area } from '@mhmo91/schmancy/area'
  
  // 2. Navigate to a component
  area.push({
    area: 'main',
    component: 'my-component'
  })
  
  // 3. Clear the area
  area.pop('main')
</script>`,

		basicNavigation: `// Navigate to a component
area.push({
  area: 'main',
  component: 'area-demo-home-page'
})

// Navigate to another component
area.push({
  area: 'main',
  component: 'area-demo-about-page'
})

// Clear the area
area.pop('main')`,

		passingParams: `// Pass parameters to component
area.push({
  area: 'main',
  component: 'area-demo-user-profile',
  params: {
    userId: '123',
    username: 'john_doe'
  }
})

// Parameters become properties on the component
// @property() userId?: string
// @property() username?: string`,

		passingProps: `// Pass props to component (component properties)
area.push({
  area: 'main',
  component: 'my-component',
  props: {
    title: 'Hello World',
    data: { id: 123, name: 'Test' },
  }
})

// Props are set as properties on the component
// @property() title?: string
// @property() data?: any
// @property() onClick?: () => void

// Note: 'params' are for query parameters, 'props' are for component properties`,

		defaultComponent: `<!-- Set a default component -->
<schmancy-area 
  name="main" 
  default="area-demo-home-page"
></schmancy-area>`,

		stateManagement: `// Pass state to components
area.push({
  area: 'main',
  component: 'product-details',
  state: {
    productId: '123',
    category: 'electronics',
    filters: { price: 'low-to-high' }
  }
})

// Subscribe to state changes
area.getState('main').subscribe(state => {
})`,

		multipleAreas: `<!-- Create a layout with multiple areas -->
<div class="app-layout">
  <header>
    <schmancy-area name="header"></schmancy-area>
  </header>
  <aside>
    <schmancy-area name="sidebar"></schmancy-area>
  </aside>
  <main>
    <schmancy-area name="content"></schmancy-area>
  </main>
</div>`,

		clearQueryParams: `// Clear all query parameters on navigation
area.push({
  area: 'main',
  component: 'home-page',
  clearQueryParams: true
})

// Clear specific query parameters
area.push({
  area: 'main',
  component: 'search-results',
  clearQueryParams: ['filter', 'sort']
})`,

		dynamicImports: `// Load components dynamically using lazy()
import { lazy } from '@mhmo91/schmancy'

const HeavyComponent = lazy(() => import('./components/heavy-component.js'))

area.push({
  area: 'main',
  component: HeavyComponent
})

// Or with a constructor
import { MyComponent } from './my-component.js'
area.push({
  area: 'main',
  component: MyComponent
})`,

		observableSubscriptions: `// Subscribe to route changes
area.on('main').subscribe(route => {
})

// Get specific parameter (query string)
area.param('main', 'userId').subscribe(userId => {
})

// Get specific prop (component property)
area.prop('main', 'orderId').subscribe(orderId => {
})`,

		historyStrategy: `// Different history strategies
area.push({
  area: 'main',
  component: 'page-component',
  historyStrategy: 'push'    // Add to browser history (default)
})

area.push({
  area: 'main',
  component: 'modal-component',
  historyStrategy: 'replace' // Replace current history entry
})

area.push({
  area: 'main',
  component: 'temp-component',
  historyStrategy: 'silent'  // No history update
})`
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Header -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Schmancy Area
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Dynamic content areas with routing and state management
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.import}
					</schmancy-code-preview>
				</div>

				<!-- Quick Start -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Quick Start</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block text-surface-onVariant">
						Create dynamic content areas in three simple steps:
					</schmancy-typography>
					
					<schmancy-code-preview language="html" .preview=${false}>
${this.codeExamples.quickStart}
					</schmancy-code-preview>
				</div>

				<!-- Live Examples -->
				<schmancy-typography type="title" token="lg" class="mb-6 block">Live Examples</schmancy-typography>
				
				<!-- Example 1: Basic Navigation -->
				<div class="mb-12">
					<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
						<schmancy-typography type="headline" token="md" class="mb-2 block">
							1. Basic Navigation
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
							Navigate between different components
						</schmancy-typography>
						
						<!-- Demo controls -->
						<div class="flex gap-2 mb-4">
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ area: 'demo-basic', component: 'area-demo-home-page' })}
							>
								<schmancy-icon>home</schmancy-icon>
								Home
							</schmancy-button>
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ area: 'demo-basic', component: 'area-demo-about-page' })}
							>
								<schmancy-icon>info</schmancy-icon>
								About
							</schmancy-button>
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ area: 'demo-basic', component: 'area-demo-contact-page' })}
							>
								<schmancy-icon>mail</schmancy-icon>
								Contact
							</schmancy-button>
							<schmancy-button 
								variant="outlined"
								@click=${() => area.pop('demo-basic')}
							>
								<schmancy-icon>clear</schmancy-icon>
								Clear
							</schmancy-button>
						</div>
						
						<!-- Demo area -->
						<div class="min-h-[300px] bg-surface-container rounded-xl overflow-hidden">
							<schmancy-area name="demo-basic"></schmancy-area>
						</div>
						
						<!-- Code example -->
						<div class="mt-4">
							<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.basicNavigation}
							</schmancy-code-preview>
						</div>
					</schmancy-surface>
				</div>

				<!-- Example 2: Passing Parameters -->
				<div class="mb-12">
					<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
						<schmancy-typography type="headline" token="md" class="mb-2 block">
							2. Passing Parameters
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
							Pass data to components as properties
						</schmancy-typography>
						
						<!-- Demo controls -->
						<div class="grid grid-cols-2 gap-4 mb-4">
							<schmancy-button 
								variant="filled tonal"
								@click=${() => area.push({ 
									area: 'demo-params', 
									component: 'area-demo-user-profile',
									params: { userId: '123', username: 'john_doe' }
								})}
							>
								Load John's Profile
							</schmancy-button>
							<schmancy-button 
								variant="filled tonal"
								@click=${() => area.push({ 
									area: 'demo-params', 
									component: 'area-demo-user-profile',
									params: { userId: '456', username: 'jane_smith' }
								})}
							>
								Load Jane's Profile
							</schmancy-button>
						</div>
						
						<!-- Demo area -->
						<div class="min-h-[300px] bg-surface-container rounded-xl overflow-hidden">
							<schmancy-area name="demo-params"></schmancy-area>
						</div>
						
						<!-- Code example -->
						<div class="mt-4">
							<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.passingParams}
							</schmancy-code-preview>
						</div>
					</schmancy-surface>
				</div>

				<!-- Example 3: Passing Props -->
				<div class="mb-12">
					<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
						<schmancy-typography type="headline" token="md" class="mb-2 block">
							3. Passing Props (Component Properties)
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
							Pass properties directly to components (not as query parameters)
						</schmancy-typography>
						
						<!-- Demo controls -->
						<div class="flex gap-2 mb-4">
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ 
									area: 'demo-props', 
									component: 'area-demo-props-example',
									props: { 
										title: 'Component with Props',
										data: { message: 'This is complex data', timestamp: Date.now() },
									}
								})}
							>
								<schmancy-icon>widgets</schmancy-icon>
								With All Props
							</schmancy-button>
							<schmancy-button 
								variant="filled tonal"
								@click=${() => area.push({ 
									area: 'demo-props', 
									component: 'area-demo-props-example',
									props: { title: 'Simple Props Only' }
								})}
							>
								<schmancy-icon>text_fields</schmancy-icon>
								Simple Props
							</schmancy-button>
							<schmancy-button 
								variant="outlined"
								@click=${() => area.pop('demo-props')}
							>
								<schmancy-icon>clear</schmancy-icon>
								Clear
							</schmancy-button>
						</div>
						
						<!-- Demo area -->
						<div class="min-h-[300px] bg-surface-container rounded-xl overflow-hidden">
							<schmancy-area name="demo-props"></schmancy-area>
						</div>
						
						<!-- Code example -->
						<div class="mt-4">
							<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.passingProps}
							</schmancy-code-preview>
						</div>
					</schmancy-surface>
				</div>

				<!-- Example 4: Default Component -->
				<div class="mb-12">
					<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
						<schmancy-typography type="headline" token="md" class="mb-2 block">
							4. Default Component
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
							Show a default component when area is empty
						</schmancy-typography>
						
						<!-- Demo area with default -->
						<div class="min-h-[300px] bg-surface-container rounded-xl overflow-hidden mb-4">
							<schmancy-area name="demo-default" default="area-demo-home-page"></schmancy-area>
						</div>
						
						<!-- Demo controls -->
						<div class="flex gap-2">
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ area: 'demo-default', component: 'area-demo-about-page' })}
							>
								Navigate to About
							</schmancy-button>
							<schmancy-button 
								variant="outlined"
								@click=${() => area.pop('demo-default')}
							>
								Reset to Default
							</schmancy-button>
						</div>
						
						<!-- Code example -->
						<div class="mt-4">
							<schmancy-code-preview language="html" .preview=${false}>
${this.codeExamples.defaultComponent}
							</schmancy-code-preview>
						</div>
					</schmancy-surface>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<!-- Area Component Props -->
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
						<div class="p-4 bg-surface-container">
							<schmancy-typography type="title" token="md">Area Component Properties</schmancy-typography>
						</div>
						<table class="w-full">
							<thead>
								<tr class="border-b border-outline">
									<th class="text-left p-4">Property</th>
									<th class="text-left p-4">Type</th>
									<th class="text-left p-4">Description</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-outline">
									<td class="p-4"><code>name</code></td>
									<td class="p-4">string</td>
									<td class="p-4">Unique identifier for the area (required)</td>
								</tr>
								<tr>
									<td class="p-4"><code>default</code></td>
									<td class="p-4">string | Component</td>
									<td class="p-4">Default component to display when area is empty</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Area Service Methods -->
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<div class="p-4 bg-surface-container">
							<schmancy-typography type="title" token="md">Area Service Methods</schmancy-typography>
						</div>
						<table class="w-full">
							<thead>
								<tr class="border-b border-outline">
									<th class="text-left p-4">Method</th>
									<th class="text-left p-4">Parameters</th>
									<th class="text-left p-4">Description</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-b border-outline">
									<td class="p-4"><code>push()</code></td>
									<td class="p-4">RouteAction</td>
									<td class="p-4">Navigate to a component</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>pop()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Clear an area</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>on()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Subscribe to area changes</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>getState()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Get area state observable</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>hasArea()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Check if area has content</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>params()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Get query parameters observable</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>param()</code></td>
									<td class="p-4">areaName: string, key: string</td>
									<td class="p-4">Get specific query parameter</td>
								</tr>
								<tr class="border-b border-outline">
									<td class="p-4"><code>props()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Get component properties observable</td>
								</tr>
								<tr>
									<td class="p-4"><code>prop()</code></td>
									<td class="p-4">areaName: string, key: string</td>
									<td class="p-4">Get specific component property</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Advanced Usage -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Advanced Usage</schmancy-typography>
					
					<div class="grid gap-6">
						<!-- State Management -->
						<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.stateManagement}
						</schmancy-code-preview>

						<!-- Multiple Areas -->
						<schmancy-code-preview language="html" .preview=${false}>
${this.codeExamples.multipleAreas}
						</schmancy-code-preview>

						<!-- Clear Query Parameters -->
						<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.clearQueryParams}
						</schmancy-code-preview>

						<!-- Dynamic Imports -->
						<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.dynamicImports}
						</schmancy-code-preview>

						<!-- Observable Subscriptions -->
						<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.observableSubscriptions}
						</schmancy-code-preview>

						<!-- History Strategy -->
						<schmancy-code-preview language="javascript" .preview=${false}>
${this.codeExamples.historyStrategy}
						</schmancy-code-preview>
					</div>
				</div>
			</schmancy-surface>
		`
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up demo areas
		const areas = ['demo-basic', 'demo-params', 'demo-props', 'demo-default']
		areas.forEach((name: string) => {
			if (area.hasArea(name)) {
				area.pop(name)
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area': DemoArea
		'area-demo-home-page': AreaDemoHomePage
		'area-demo-about-page': AreaDemoAboutPage
		'area-demo-contact-page': AreaDemoContactPage
		'area-demo-user-profile': AreaDemoUserProfile
		'area-demo-props-example': AreaDemoPropsExample
	}
}
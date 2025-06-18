import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import '../shared/installation-section'
import { area } from '@schmancy/area'

// Simple demo components
@customElement('demo-home-page')
class DemoHomePage extends $LitElement() {
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

@customElement('demo-about-page')
class DemoAboutPage extends $LitElement() {
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

@customElement('demo-user-profile')
class DemoUserProfile extends $LitElement() {
	@property() userId?: string
	@property() username?: string

	render() {
		return html`
			<div class="p-8">
				<schmancy-icon size="64" class="text-tertiary mb-4">person</schmancy-icon>
				<schmancy-typography type="headline" token="lg" class="mb-4">User Profile</schmancy-typography>
				<schmancy-surface type="surfaceContainer" class="p-4 rounded-lg">
					<div class="space-y-2">
						<div><strong>User ID:</strong> ${this.userId || 'Not provided'}</div>
						<div><strong>Username:</strong> ${this.username || 'Not provided'}</div>
					</div>
				</schmancy-surface>
			</div>
		`
	}
}

@customElement('demo-area-refactored')
export class DemoAreaRefactored extends $LitElement(css`
	.example-section {
		margin-bottom: 3rem;
	}
	
	.demo-area {
		min-height: 300px;
		background: var(--schmancy-sys-color-surface-container);
		border-radius: 12px;
		overflow: hidden;
	}
	
	.code-section {
		margin-top: 1rem;
	}
`) {
	@state() activeTab = 'overview'

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
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/area'
						import { area } from '@mhmo91/schmancy/area'
					</schmancy-code-preview>
				</div>

				<!-- Quick Start -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Quick Start</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block text-surface-onVariant">
						Create dynamic content areas in three simple steps:
					</schmancy-typography>
					
					<schmancy-code-preview language="html">
						<!-- 1. Add an area to your HTML -->
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
						</script>
					</schmancy-code-preview>
				</div>

				<!-- Live Examples -->
				<schmancy-typography type="title" token="lg" class="mb-6 block">Live Examples</schmancy-typography>
				
				<!-- Example 1: Basic Navigation -->
				<div class="example-section">
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
								@click=${() => area.push({ area: 'demo-basic', component: 'demo-home-page' })}
							>
								<schmancy-icon>home</schmancy-icon>
								Home
							</schmancy-button>
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ area: 'demo-basic', component: 'demo-about-page' })}
							>
								<schmancy-icon>info</schmancy-icon>
								About
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
						<div class="demo-area">
							<schmancy-area name="demo-basic"></schmancy-area>
						</div>
						
						<!-- Code example -->
						<div class="code-section">
							<schmancy-code-preview language="javascript" ?preview=${false}>
								// Navigate to a component
								area.push({
									area: 'main',
									component: 'demo-home-page'
								})
								
								// Clear the area
								area.pop('main')
							</schmancy-code-preview>
						</div>
					</schmancy-surface>
				</div>

				<!-- Example 2: Passing Parameters -->
				<div class="example-section">
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
									component: 'demo-user-profile',
									params: { userId: '123', username: 'john_doe' }
								})}
							>
								Load John's Profile
							</schmancy-button>
							<schmancy-button 
								variant="filled tonal"
								@click=${() => area.push({ 
									area: 'demo-params', 
									component: 'demo-user-profile',
									params: { userId: '456', username: 'jane_smith' }
								})}
							>
								Load Jane's Profile
							</schmancy-button>
						</div>
						
						<!-- Demo area -->
						<div class="demo-area">
							<schmancy-area name="demo-params"></schmancy-area>
						</div>
						
						<!-- Code example -->
						<div class="code-section">
							<schmancy-code-preview language="javascript" ?preview=${false}>
								// Pass parameters to component
								area.push({
									area: 'main',
									component: 'demo-user-profile',
									params: {
										userId: '123',
										username: 'john_doe'
									}
								})
								
								// Parameters become properties on the component
								// @property() userId?: string
								// @property() username?: string
							</schmancy-code-preview>
						</div>
					</schmancy-surface>
				</div>

				<!-- Example 3: Default Component -->
				<div class="example-section">
					<schmancy-surface type="surfaceDim" class="rounded-lg p-6">
						<schmancy-typography type="headline" token="md" class="mb-2 block">
							3. Default Component
						</schmancy-typography>
						<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
							Show a default component when area is empty
						</schmancy-typography>
						
						<!-- Demo area with default -->
						<div class="demo-area mb-4">
							<schmancy-area name="demo-default" default="demo-home-page"></schmancy-area>
						</div>
						
						<!-- Demo controls -->
						<div class="flex gap-2">
							<schmancy-button 
								variant="filled"
								@click=${() => area.push({ area: 'demo-default', component: 'demo-about-page' })}
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
						<div class="code-section">
							<schmancy-code-preview language="html" ?preview=${false}>
								<!-- Set a default component -->
								<schmancy-area 
									name="main" 
									default="demo-home-page"
								></schmancy-area>
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
								<tr>
									<td class="p-4"><code>hasArea()</code></td>
									<td class="p-4">areaName: string</td>
									<td class="p-4">Check if area has content</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Advanced Usage -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Advanced Usage</schmancy-typography>
					
					<schmancy-grid gap="lg">
						<!-- State Management -->
						<schmancy-code-preview language="javascript" ?preview=${false}>
							// Pass state to components
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
								console.log('State updated:', state)
							})
						</schmancy-code-preview>

						<!-- Multiple Areas -->
						<schmancy-code-preview language="html" ?preview=${false}>
							<!-- Create a layout with multiple areas -->
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
							</div>
						</schmancy-code-preview>

						<!-- Clear Query Parameters -->
						<schmancy-code-preview language="javascript" ?preview=${false}>
							// Clear all query parameters on navigation
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
							})
						</schmancy-code-preview>

						<!-- Dynamic Imports -->
						<schmancy-code-preview language="javascript" ?preview=${false}>
							// Load components dynamically
							area.push({
								area: 'main',
								component: import('./components/heavy-component.js')
							})
							
							// Or with a constructor
							import { MyComponent } from './my-component.js'
							area.push({
								area: 'main',
								component: MyComponent
							})
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up demo areas
		['demo-basic', 'demo-params', 'demo-default'].forEach(name => {
			if (area.hasArea(name)) {
				area.pop(name)
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-refactored': DemoAreaRefactored
		'demo-home-page': DemoHomePage
		'demo-about-page': DemoAboutPage
		'demo-user-profile': DemoUserProfile
	}
}
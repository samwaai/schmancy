import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state, property } from 'lit/decorators.js'
import '../shared/installation-section'
import { area } from '@schmancy/area'


// Demo components for different use cases

// 1. Simple pages
@customElement('area-demo-page1')
class AreaDemoPage1 extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Page 1</schmancy-typography>
				<schmancy-typography type="body" token="lg">This is the first page loaded in the demo area.</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('area-demo-page2')
class AreaDemoPage2 extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Page 2</schmancy-typography>
				<schmancy-typography type="body" token="lg">This is the second page. Notice how the content changed!</schmancy-typography>
			</schmancy-surface>
		`
	}
}

// 2. Component with parameters
@customElement('area-demo-user-profile')
class AreaDemoUserProfile extends $LitElement() {
	@property() userId?: string
	@property() tab?: string

	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">User Profile</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-2">
					User ID: <code>${this.userId || 'No ID provided'}</code>
				</schmancy-typography>
				<schmancy-typography type="body" token="lg">
					Active Tab: <code>${this.tab || 'No tab selected'}</code>
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

// 3. Component with state
@customElement('area-demo-product')
class AreaDemoProduct extends $LitElement() {
	@state() productData: any = null

	connectedCallback() {
		super.connectedCallback()
		// Subscribe to state changes
		area.getState('area-demo-state').subscribe((state: any) => {
			if (state && state.product) {
				this.productData = state.product
			}
		})
	}

	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg">
				<schmancy-typography type="headline" token="md" class="mb-4">Product Details</schmancy-typography>
				${this.productData ? html`
					<schmancy-typography type="body" token="lg" class="mb-2">
						Name: <code>${this.productData.name}</code>
					</schmancy-typography>
					<schmancy-typography type="body" token="lg" class="mb-2">
						Price: <code>$${this.productData.price}</code>
					</schmancy-typography>
					<schmancy-typography type="body" token="lg">
						Category: <code>${this.productData.category}</code>
					</schmancy-typography>
				` : html`
					<schmancy-typography type="body" token="lg">No product data available</schmancy-typography>
				`}
			</schmancy-surface>
		`
	}
}

// 4. Default component
@customElement('area-demo-empty')
class AreaDemoEmpty extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-6 rounded-lg bg-surface-container">
				<schmancy-typography type="body" token="lg" class="text-surface-onVariant text-center">
					This area is empty. Select an example to see it in action.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

// 5. Multi-area components
@customElement('area-demo-header')
class AreaDemoHeader extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-4 rounded-lg">
				<schmancy-typography type="headline" token="sm">Demo Header</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('area-demo-sidebar')
class AreaDemoSidebar extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-4 rounded-lg">
				<schmancy-typography type="headline" token="sm" class="mb-4">Sidebar</schmancy-typography>
				<ul class="space-y-2">
					<li>Menu Item 1</li>
					<li>Menu Item 2</li>
					<li>Menu Item 3</li>
				</ul>
			</schmancy-surface>
		`
	}
}

@customElement('area-demo-content')
class AreaDemoContent extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-4 rounded-lg">
				<schmancy-typography type="headline" token="sm" class="mb-4">Main Content</schmancy-typography>
				<schmancy-typography type="body" token="md">
					This demonstrates multiple areas working together on the same page.
				</schmancy-typography>
			</schmancy-surface>
		`
	}
}

@customElement('demo-area')
export class DemoArea extends $LitElement() {
	@state() activeExample = 'basic'
	@state() currentPage = ''
	@state() userIdInput = '12345'
	@state() tabInput = 'profile'

	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Area
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					A routing and state management system for dynamic content areas.
				</schmancy-typography>

				<installation-section></installation-section>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Overview</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block">
						The area component allows you to create dynamic regions in your application that can load different components based on navigation.
					</schmancy-typography>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Key Features</schmancy-typography>
					<ul class="list-disc ml-6 space-y-2">
						<li>Dynamic component loading</li>
						<li>State management per area</li>
						<li>Browser history integration</li>
						<li>Parameter passing between components</li>
						<li>Multiple areas on same page</li>
						<li>Default component support</li>
					</ul>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Component Properties</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">Property</th>
									<th class="text-left p-4">Type</th>
									<th class="text-left p-4">Description</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4"><code>name</code></td>
									<td class="p-4">string</td>
									<td class="p-4">Unique identifier for the area</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4"><code>default</code></td>
									<td class="p-4">string | Component</td>
									<td class="p-4">Default component to display</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Interactive Examples</schmancy-typography>
					
					<!-- Example selector tabs -->
					<schmancy-tabs 
						.value=${this.activeExample}
						@change=${(e: CustomEvent) => this.activeExample = e.detail.value}
						class="mb-6"
					>
						<schmancy-tab value="basic">Basic Navigation</schmancy-tab>
						<schmancy-tab value="params">With Parameters</schmancy-tab>
						<schmancy-tab value="state">With State</schmancy-tab>
						<schmancy-tab value="default">Default Component</schmancy-tab>
						<schmancy-tab value="multi">Multiple Areas</schmancy-tab>
					</schmancy-tabs>

					<!-- Example content -->
					${this.activeExample === 'basic' ? this.renderBasicExample() : ''}
					${this.activeExample === 'params' ? this.renderParamsExample() : ''}
					${this.activeExample === 'state' ? this.renderStateExample() : ''}
					${this.activeExample === 'default' ? this.renderDefaultExample() : ''}
					${this.activeExample === 'multi' ? this.renderMultiExample() : ''}
				</div>
			</schmancy-surface>
		`
	}

	renderBasicExample() {
		return html`
			<schmancy-surface type="container" class="rounded-lg p-6">
				<schmancy-typography type="title" token="md" class="mb-4 block">Basic Navigation</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
					Navigate between simple components without any parameters or state.
				</schmancy-typography>
				
				<div class="mb-4 flex gap-4">
					<schmancy-button @click=${() => this.loadPage1()}>
						Load Page 1
					</schmancy-button>
					<schmancy-button @click=${() => this.loadPage2()}>
						Load Page 2
					</schmancy-button>
					<schmancy-button @click=${() => this.clearBasicArea()} variant="outlined">
						Clear Area
					</schmancy-button>
				</div>
				
				<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
					<schmancy-area name="area-demo-basic"></schmancy-area>
				</schmancy-surface>
			</schmancy-surface>
		`
	}

	renderParamsExample() {
		return html`
			<schmancy-surface type="container" class="rounded-lg p-6">
				<schmancy-typography type="title" token="md" class="mb-4 block">Navigation with Parameters</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
					Pass parameters to components when navigating. Parameters become properties on the target component.
				</schmancy-typography>
				
				<div class="mb-4 grid grid-cols-2 gap-4">
					<schmancy-input
						label="User ID"
						.value=${this.userIdInput}
						@input=${(e: Event) => this.userIdInput = (e.target as HTMLInputElement).value}
					></schmancy-input>
					<schmancy-input
						label="Tab"
						.value=${this.tabInput}
						@input=${(e: Event) => this.tabInput = (e.target as HTMLInputElement).value}
					></schmancy-input>
				</div>
				
				<div class="mb-4">
					<schmancy-button @click=${() => this.loadUserProfile()}>
						Load User Profile
					</schmancy-button>
				</div>
				
				<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
					<schmancy-area name="area-demo-params"></schmancy-area>
				</schmancy-surface>
			</schmancy-surface>
		`
	}

	renderStateExample() {
		return html`
			<schmancy-surface type="container" class="rounded-lg p-6">
				<schmancy-typography type="title" token="md" class="mb-4 block">Navigation with State</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
					Pass complex state objects to components. State can be subscribed to using the area service.
				</schmancy-typography>
				
				<div class="mb-4 flex gap-4">
					<schmancy-button @click=${() => this.loadProductA()}>
						Load Product A
					</schmancy-button>
					<schmancy-button @click=${() => this.loadProductB()}>
						Load Product B
					</schmancy-button>
				</div>
				
				<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
					<schmancy-area name="area-demo-state"></schmancy-area>
				</schmancy-surface>
				
				<schmancy-typography type="body" token="sm" class="mt-2 text-surface-onVariant">
					Check the console to see state updates when navigating.
				</schmancy-typography>
			</schmancy-surface>
		`
	}

	renderDefaultExample() {
		return html`
			<schmancy-surface type="container" class="rounded-lg p-6">
				<schmancy-typography type="title" token="md" class="mb-4 block">Default Component</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
					Areas can have a default component that displays when the area is empty.
				</schmancy-typography>
				
				<div class="mb-4 flex gap-4">
					<schmancy-button @click=${() => this.loadInDefaultArea()}>
						Load Content
					</schmancy-button>
					<schmancy-button @click=${() => this.clearDefaultArea()} variant="outlined">
						Clear (Show Default)
					</schmancy-button>
				</div>
				
				<schmancy-surface type="surfaceDim" class="rounded-lg p-4 min-h-[200px]">
					<schmancy-area name="area-demo-default" .default=${'area-demo-empty'}></schmancy-area>
				</schmancy-surface>
			</schmancy-surface>
		`
	}

	renderMultiExample() {
		return html`
			<schmancy-surface type="container" class="rounded-lg p-6">
				<schmancy-typography type="title" token="md" class="mb-4 block">Multiple Areas</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="mb-4 block text-surface-onVariant">
					Multiple areas can work together to create complex layouts.
				</schmancy-typography>
				
				<div class="mb-4 flex gap-4">
					<schmancy-button @click=${() => this.loadMultipleAreas()}>
						Load All Areas
					</schmancy-button>
					<schmancy-button @click=${() => this.clearMultipleAreas()} variant="outlined">
						Clear All
					</schmancy-button>
				</div>
				
				<div class="grid gap-4">
					<!-- Header -->
					<schmancy-surface type="surfaceDim" class="rounded-lg p-4">
						<schmancy-area name="area-demo-header"></schmancy-area>
					</schmancy-surface>
					
					<!-- Main content with sidebar -->
					<div class="grid grid-cols-3 gap-4">
						<schmancy-surface type="surfaceDim" class="rounded-lg p-4">
							<schmancy-area name="area-demo-sidebar"></schmancy-area>
						</schmancy-surface>
						<schmancy-surface type="surfaceDim" class="rounded-lg p-4 col-span-2">
							<schmancy-area name="area-demo-content"></schmancy-area>
						</schmancy-surface>
					</div>
				</div>
			</schmancy-surface>
		`
	}

	// Basic example methods
	loadPage1() {
		area.push({
			area: 'area-demo-basic',
			component: 'area-demo-page1'
		})
	}

	loadPage2() {
		area.push({
			area: 'area-demo-basic',
			component: 'area-demo-page2'
		})
	}

	clearBasicArea() {
		area.pop('area-demo-basic')
	}

	// Params example methods
	loadUserProfile() {
		area.push({
			area: 'area-demo-params',
			component: 'area-demo-user-profile',
			params: {
				userId: this.userIdInput,
				tab: this.tabInput
			}
		})
	}

	// State example methods
	loadProductA() {
		area.push({
			area: 'area-demo-state',
			component: 'area-demo-product',
			state: {
				product: {
					name: 'Schmancy Widget Pro',
					price: 99.99,
					category: 'Premium'
				}
			}
		})
		
		// Log state changes
		area.getState('area-demo-state').subscribe((state: any) => {
			console.log('Area state updated:', state)
		})
	}

	loadProductB() {
		area.push({
			area: 'area-demo-state',
			component: 'area-demo-product',
			state: {
				product: {
					name: 'Schmancy Widget Basic',
					price: 49.99,
					category: 'Standard'
				}
			}
		})
	}

	// Default example methods
	loadInDefaultArea() {
		area.push({
			area: 'area-demo-default',
			component: 'area-demo-page1'
		})
	}

	clearDefaultArea() {
		area.pop('area-demo-default')
	}

	// Multi-area example methods
	loadMultipleAreas() {
		area.push({
			area: 'area-demo-header',
			component: 'area-demo-header'
		})
		
		area.push({
			area: 'area-demo-sidebar',
			component: 'area-demo-sidebar'
		})
		
		area.push({
			area: 'area-demo-content',
			component: 'area-demo-content'
		})
	}

	clearMultipleAreas() {
		area.pop('area-demo-header')
		area.pop('area-demo-sidebar')
		area.pop('area-demo-content')
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up all demo areas when leaving
		const demoAreas = [
			'area-demo-basic',
			'area-demo-params',
			'area-demo-state',
			'area-demo-default',
			'area-demo-header',
			'area-demo-sidebar',
			'area-demo-content'
		]
		
		demoAreas.forEach(areaName => {
			if (area.hasArea(areaName)) {
				area.pop(areaName)
			}
		})
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area': DemoArea
		'area-demo-page1': AreaDemoPage1
		'area-demo-page2': AreaDemoPage2
		'area-demo-user-profile': AreaDemoUserProfile
		'area-demo-product': AreaDemoProduct
		'area-demo-empty': AreaDemoEmpty
		'area-demo-header': AreaDemoHeader
		'area-demo-sidebar': AreaDemoSidebar
		'area-demo-content': AreaDemoContent
	}
}
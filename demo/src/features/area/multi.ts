import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { area } from '@mhmo91/schmancy/area'

// Header components
@customElement('area-multi-header-default')
class AreaMultiHeaderDefault extends $LitElement() {
	render() {
		return html`
			<div class="flex items-center justify-between">
				<schmancy-typography type="headline" token="sm">Application Header</schmancy-typography>
				<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Not logged in</schmancy-typography>
			</div>
		`
	}
}

@customElement('area-multi-header-user')
class AreaMultiHeaderUser extends $LitElement() {
	@property() username = 'John Doe'

	render() {
		return html`
			<div class="flex items-center justify-between">
				<schmancy-typography type="headline" token="sm">Application Header</schmancy-typography>
				<div class="flex items-center gap-3">
					<schmancy-icon name="account_circle" size="24"></schmancy-icon>
					<schmancy-typography type="body" token="md">${this.username}</schmancy-typography>
				</div>
			</div>
		`
	}
}

// Sidebar components
@customElement('area-multi-sidebar-nav')
class AreaMultiSidebarNav extends $LitElement() {
	render() {
		return html`
			<div>
				<schmancy-typography type="title" token="sm" class="mb-4 block">Navigation</schmancy-typography>
				<div class="space-y-2">
					<schmancy-surface type="container" class="p-3 rounded cursor-pointer hover:bg-surface-containerHigh">
						<schmancy-typography type="body" token="md">Dashboard</schmancy-typography>
					</schmancy-surface>
					<schmancy-surface type="container" class="p-3 rounded cursor-pointer hover:bg-surface-containerHigh">
						<schmancy-typography type="body" token="md">Products</schmancy-typography>
					</schmancy-surface>
					<schmancy-surface type="container" class="p-3 rounded cursor-pointer hover:bg-surface-containerHigh">
						<schmancy-typography type="body" token="md">Orders</schmancy-typography>
					</schmancy-surface>
					<schmancy-surface type="container" class="p-3 rounded cursor-pointer hover:bg-surface-containerHigh">
						<schmancy-typography type="body" token="md">Settings</schmancy-typography>
					</schmancy-surface>
				</div>
			</div>
		`
	}
}

@customElement('area-multi-sidebar-filters')
class AreaMultiSidebarFilters extends $LitElement() {
	render() {
		return html`
			<div>
				<schmancy-typography type="title" token="sm" class="mb-4 block">Filters</schmancy-typography>
				<div class="space-y-3">
					<div>
						<schmancy-typography type="body" token="sm" class="mb-2 text-surface-onVariant">Category</schmancy-typography>
						<select class="w-full p-2 rounded border border-outline bg-surface">
							<option>All Categories</option>
							<option>Electronics</option>
							<option>Clothing</option>
							<option>Books</option>
						</select>
					</div>
					<div>
						<schmancy-typography type="body" token="sm" class="mb-2 text-surface-onVariant">Price Range</schmancy-typography>
						<select class="w-full p-2 rounded border border-outline bg-surface">
							<option>Any Price</option>
							<option>Under $50</option>
							<option>$50 - $100</option>
							<option>Over $100</option>
						</select>
					</div>
				</div>
			</div>
		`
	}
}

// Main content components
@customElement('area-multi-content-dashboard')
class AreaMultiContentDashboard extends $LitElement() {
	render() {
		return html`
			<div>
				<schmancy-typography type="headline" token="md" class="mb-4 block">Dashboard</schmancy-typography>
				<div class="grid grid-cols-3 gap-4">
					<schmancy-surface type="container" class="p-4 rounded-lg">
						<schmancy-typography type="title" token="sm" class="mb-2 block">Total Sales</schmancy-typography>
						<schmancy-typography type="headline" token="lg">$12,345</schmancy-typography>
					</schmancy-surface>
					<schmancy-surface type="container" class="p-4 rounded-lg">
						<schmancy-typography type="title" token="sm" class="mb-2 block">Orders</schmancy-typography>
						<schmancy-typography type="headline" token="lg">156</schmancy-typography>
					</schmancy-surface>
					<schmancy-surface type="container" class="p-4 rounded-lg">
						<schmancy-typography type="title" token="sm" class="mb-2 block">Customers</schmancy-typography>
						<schmancy-typography type="headline" token="lg">89</schmancy-typography>
					</schmancy-surface>
				</div>
			</div>
		`
	}
}

@customElement('area-multi-content-products')
class AreaMultiContentProducts extends $LitElement() {
	render() {
		return html`
			<div>
				<schmancy-typography type="headline" token="md" class="mb-4 block">Products</schmancy-typography>
				<div class="space-y-3">
					${[1, 2, 3].map(i => html`
						<schmancy-surface type="container" class="p-4 rounded-lg">
							<div class="flex justify-between items-center">
								<div>
									<schmancy-typography type="title" token="sm">Product ${i}</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										SKU: PROD-00${i}
									</schmancy-typography>
								</div>
								<schmancy-typography type="title" token="md">$${(i * 29.99).toFixed(2)}</schmancy-typography>
							</div>
						</schmancy-surface>
					`)}
				</div>
			</div>
		`
	}
}

// Footer component
@customElement('area-multi-footer')
class AreaMultiFooter extends $LitElement() {
	render() {
		return html`
			<div class="text-center">
				<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
					© 2024 Schmancy Demo App - Multiple Areas Example
				</schmancy-typography>
			</div>
		`
	}
}

@customElement('demo-area-multi')
export class DemoAreaMulti extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Multiple Areas
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Use multiple areas on the same page to create complex, dynamic layouts with independent navigation regions.
				</schmancy-typography>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Overview</schmancy-typography>
					<schmancy-typography type="body" token="md" class="mb-4 block">
						Multiple areas can work together on the same page, each managing its own navigation and state independently.
						This pattern is perfect for applications with headers, sidebars, main content areas, and footers that need
						to update independently.
					</schmancy-typography>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Live Example</schmancy-typography>
					
					<schmancy-surface type="container" class="rounded-lg p-6">
						<div class="mb-4 flex gap-4 flex-wrap">
							<schmancy-button @click=${() => this.loadLayout1()}>
								Layout 1: Dashboard
							</schmancy-button>
							<schmancy-button @click=${() => this.loadLayout2()}>
								Layout 2: Products
							</schmancy-button>
							<schmancy-button @click=${() => this.toggleUserLogin()}>
								Toggle Login
							</schmancy-button>
							<schmancy-button @click=${() => this.clearAllAreas()} variant="outlined">
								Clear All
							</schmancy-button>
						</div>
						
						<div class="h-[500px] flex flex-col gap-4">
							<!-- Header -->
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 flex-shrink-0">
								<schmancy-area name="multi-demo-header" .default=${'area-multi-header-default'}></schmancy-area>
							</schmancy-surface>
							
							<!-- Main content area with sidebar -->
							<div class="flex-1 grid grid-cols-4 gap-4 min-h-0">
								<!-- Sidebar -->
								<schmancy-surface type="surfaceDim" class="rounded-lg p-4 overflow-y-auto">
									<schmancy-area name="multi-demo-sidebar"></schmancy-area>
								</schmancy-surface>
								
								<!-- Main content -->
								<schmancy-surface type="surfaceDim" class="rounded-lg p-4 col-span-3 overflow-y-auto">
									<schmancy-area name="multi-demo-content"></schmancy-area>
								</schmancy-surface>
							</div>
							
							<!-- Footer -->
							<schmancy-surface type="surfaceDim" class="rounded-lg p-4 flex-shrink-0">
								<schmancy-area name="multi-demo-footer"></schmancy-area>
							</schmancy-surface>
						</div>
					</schmancy-surface>
				</div>

				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Implementation</schmancy-typography>
					
					<div class="space-y-6">
						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">1. Define multiple areas in your layout</schmancy-typography>
							<schmancy-code-preview language="html">
${`<div class="app-layout">
  <!-- Header area -->
  <header>
    <schmancy-area name="header" default="header-default"></schmancy-area>
  </header>
  
  <!-- Main layout -->
  <div class="main-content">
    <!-- Sidebar area -->
    <aside>
      <schmancy-area name="sidebar"></schmancy-area>
    </aside>
    
    <!-- Content area -->
    <main>
      <schmancy-area name="content"></schmancy-area>
    </main>
  </div>
  
  <!-- Footer area -->
  <footer>
    <schmancy-area name="footer"></schmancy-area>
  </footer>
</div>`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">2. Navigate to different areas independently</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Load different components in each area
area.push({
  area: 'header',
  component: 'app-header',
  params: { user: currentUser }
})

area.push({
  area: 'sidebar',
  component: 'navigation-menu'
})

area.push({
  area: 'content',
  component: 'dashboard-view'
})

area.push({
  area: 'footer',
  component: 'app-footer'
})`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">3. Coordinate between areas</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Example: Change sidebar based on main content
function navigateToProducts() {
  // Update main content
  area.push({
    area: 'content',
    component: 'products-list'
  })
  
  // Update sidebar to show filters
  area.push({
    area: 'sidebar',
    component: 'product-filters'
  })
}

// Example: Update header on login
function handleLogin(user) {
  area.push({
    area: 'header',
    component: 'user-header',
    params: { username: user.name }
  })
}`}
							</schmancy-code-preview>
						</div>

						<div>
							<schmancy-typography type="title" token="sm" class="mb-2 block">4. Manage area lifecycle</schmancy-typography>
							<schmancy-code-preview language="javascript">
${`// Clear specific areas
area.pop('sidebar')

// Clear multiple areas
['header', 'sidebar', 'content', 'footer'].forEach(areaName => {
  area.pop(areaName)
})

// Check if area has content
if (area.hasArea('sidebar')) {
  // Area has content loaded
}`}
							</schmancy-code-preview>
						</div>
					</div>
				</div>

				<div>
					<schmancy-typography type="title" token="lg" class="mb-4 block">Common Patterns</schmancy-typography>
					<ul class="list-disc ml-6 space-y-2">
						<li><strong>Master-Detail:</strong> List in sidebar, details in main content</li>
						<li><strong>Dashboard Layout:</strong> Header with user info, navigation sidebar, content area</li>
						<li><strong>Wizard/Steps:</strong> Progress in header, navigation in sidebar, form in content</li>
						<li><strong>Split View:</strong> Two content areas side by side</li>
						<li><strong>Contextual Actions:</strong> Update toolbar based on selected content</li>
						<li><strong>Responsive Layouts:</strong> Different areas for mobile vs desktop</li>
					</ul>
				</div>
			</schmancy-surface>
		`
	}

	private loadLayout1() {
		// Load dashboard layout
		area.push({
			area: 'multi-demo-sidebar',
			component: 'area-multi-sidebar-nav'
		})
		
		area.push({
			area: 'multi-demo-content',
			component: 'area-multi-content-dashboard'
		})
		
		area.push({
			area: 'multi-demo-footer',
			component: 'area-multi-footer'
		})
	}

	private loadLayout2() {
		// Load products layout
		area.push({
			area: 'multi-demo-sidebar',
			component: 'area-multi-sidebar-filters'
		})
		
		area.push({
			area: 'multi-demo-content',
			component: 'area-multi-content-products'
		})
		
		area.push({
			area: 'multi-demo-footer',
			component: 'area-multi-footer'
		})
	}

	private toggleUserLogin() {
		const currentHeader = area.getRoute('multi-demo-header')
		
		if (currentHeader?.component === 'area-multi-header-user') {
			// Logout
			area.pop('multi-demo-header')
		} else {
			// Login
			area.push({
				area: 'multi-demo-header',
				component: 'area-multi-header-user',
				params: {
					username: 'Demo User'
				}
			})
		}
	}

	private clearAllAreas() {
		['multi-demo-header', 'multi-demo-sidebar', 'multi-demo-content', 'multi-demo-footer'].forEach(areaName => {
			area.pop(areaName)
		})
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up when leaving the demo
		this.clearAllAreas()
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-area-multi': DemoAreaMulti
		'area-multi-header-default': AreaMultiHeaderDefault
		'area-multi-header-user': AreaMultiHeaderUser
		'area-multi-sidebar-nav': AreaMultiSidebarNav
		'area-multi-sidebar-filters': AreaMultiSidebarFilters
		'area-multi-content-dashboard': AreaMultiContentDashboard
		'area-multi-content-products': AreaMultiContentProducts
		'area-multi-footer': AreaMultiFooter
	}
}
import { $LitElement } from '@mixins/index'
import { SchmancySheetPosition, sheet } from '@schmancy/sheet'
import { html, css } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-sheet')
export class DemoSheet extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() private logs: string[] = []

	private addLog(message: string) {
		this.logs = [...this.logs, `${new Date().toLocaleTimeString()}: ${message}`]
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Sheet
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Sheets are modal surfaces that slide in from the edge of the screen. Perfect for forms, navigation menus, filters, or any temporary UI that doesn't require a full page transition. Sheets automatically render into the nearest theme container for proper styling and z-index management.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
import { sheet } from '@mhmo91/schmancy/sheet'

// Or import the service directly
import { SchmancySheetPosition, sheet } from '@mhmo91/schmancy/sheet/sheet.service'</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">API Reference</schmancy-typography>
					
					<!-- Essential Methods -->
					<div class="mb-8">
						<schmancy-typography type="headline" token="sm" class="mb-4 block">Essential Methods</schmancy-typography>
						<schmancy-grid gap="md">
							<!-- open() -->
							<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
								<div class="flex items-start justify-between mb-2">
									<schmancy-typography type="label" token="lg" class="text-primary">sheet.open(config)</schmancy-typography>
									<schmancy-chip size="sm" type="assist">Required</schmancy-chip>
								</div>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">
									Opens a new sheet with the specified configuration
								</schmancy-typography>
								<schmancy-code-preview language="javascript" .preview=${false}>
sheet.open({
  component: myComponent,  // Required: HTMLElement
  title: 'Sheet Title',      // Optional: Header title
  uid: 'my-sheet',           // Optional: Unique ID
  position: 'side',          // Optional: 'side' | 'bottom' | auto
  lock: false,               // Optional: Prevent dismissal
  persist: false,            // Optional: Keep in DOM
  handleHistory: true        // Optional: Browser back button
})
								</schmancy-code-preview>
							</schmancy-surface>

							<!-- dismiss() -->
							<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
								<div class="flex items-start justify-between mb-2">
									<schmancy-typography type="label" token="lg" class="text-primary">sheet.dismiss(uid?)</schmancy-typography>
									<schmancy-chip size="sm" type="assist">Common</schmancy-chip>
								</div>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">
									Closes a sheet. If no uid provided, closes the most recent sheet.
								</schmancy-typography>
								<schmancy-code-preview language="javascript" .preview=${false}>
// Close specific sheet
sheet.dismiss('my-sheet')

// Close most recent sheet
sheet.dismiss()
								</schmancy-code-preview>
							</schmancy-surface>
						</schmancy-grid>
					</div>

					<!-- Utility Methods -->
					<div class="mb-8">
						<schmancy-typography type="headline" token="sm" class="mb-4 block">Utility Methods</schmancy-typography>
						<schmancy-grid gap="md">
							<!-- isOpen() -->
							<schmancy-surface type="container" class="p-4 rounded-lg">
								<schmancy-typography type="label" token="md" class="mb-2 block">sheet.isOpen(uid)</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Returns <code>true</code> if a sheet with the given uid is currently open
								</schmancy-typography>
							</schmancy-surface>

							<!-- closeAll() -->
							<schmancy-surface type="container" class="p-4 rounded-lg">
								<schmancy-typography type="label" token="md" class="mb-2 block">sheet.closeAll()</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Closes all open sheets at once
								</schmancy-typography>
							</schmancy-surface>
						</schmancy-grid>
					</div>

					<!-- Configuration Options -->
					<div>
						<schmancy-typography type="headline" token="sm" class="mb-4 block">Configuration Options</schmancy-typography>
						<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
							<schmancy-grid cols="1">
								<!-- Required -->
								<div class="p-4 border-b border-outlineVariant">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">component</schmancy-typography>
										<schmancy-chip size="xs" type="error">Required</schmancy-chip>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										HTMLElement - The component to display in the sheet
									</schmancy-typography>
								</div>

								<!-- Common Options -->
								<div class="p-4 border-b border-outlineVariant">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">title</schmancy-typography>
										<code class="text-xs bg-surface-container px-2 py-1 rounded">string</code>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Header title text
									</schmancy-typography>
								</div>

								<div class="p-4 border-b border-outlineVariant">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">uid</schmancy-typography>
										<code class="text-xs bg-surface-container px-2 py-1 rounded">string</code>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Unique identifier for targeting specific sheets
									</schmancy-typography>
								</div>

								<div class="p-4 border-b border-outlineVariant">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">position</schmancy-typography>
										<code class="text-xs bg-surface-container px-2 py-1 rounded">'side' | 'bottom'</code>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Force position (auto-detects by default: side on desktop, bottom on mobile)
									</schmancy-typography>
								</div>

								<!-- Advanced Options -->
								<div class="p-4 border-b border-outlineVariant">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">lock</schmancy-typography>
										<code class="text-xs bg-surface-container px-2 py-1 rounded">boolean</code>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">Default: false</schmancy-typography>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Prevents dismissal via ESC or overlay click
									</schmancy-typography>
								</div>

								<div class="p-4 border-b border-outlineVariant">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">persist</schmancy-typography>
										<code class="text-xs bg-surface-container px-2 py-1 rounded">boolean</code>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">Default: false</schmancy-typography>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Keeps component in DOM when closed (useful for maintaining state)
									</schmancy-typography>
								</div>

								<div class="p-4">
									<div class="flex items-center gap-2 mb-1">
										<schmancy-typography type="label" token="md">handleHistory</schmancy-typography>
										<code class="text-xs bg-surface-container px-2 py-1 rounded">boolean</code>
										<schmancy-typography type="body" token="xs" class="text-surface-onVariant">Default: true</schmancy-typography>
									</div>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Integrates with browser back button
									</schmancy-typography>
								</div>
							</schmancy-grid>
						</schmancy-surface>
					</div>
				</div>

				<!-- Key Features -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Key Features</schmancy-typography>
					<schmancy-grid cols="1" mdCols="2" gap="md">
						<schmancy-surface type="container" class="p-4 rounded-lg">
							<schmancy-icon class="text-primary mb-2">auto_awesome</schmancy-icon>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Smart Positioning</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Automatically switches between side (desktop) and bottom (mobile) based on viewport size
							</schmancy-typography>
						</schmancy-surface>
						<schmancy-surface type="container" class="p-4 rounded-lg">
							<schmancy-icon class="text-primary mb-2">layers</schmancy-icon>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Theme Integration</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Renders into the nearest schmancy-theme container for proper styling and layering
							</schmancy-typography>
						</schmancy-surface>
						<schmancy-surface type="container" class="p-4 rounded-lg">
							<schmancy-icon class="text-primary mb-2">history</schmancy-icon>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Browser History</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Integrates with browser back button for intuitive navigation
							</schmancy-typography>
						</schmancy-surface>
						<schmancy-surface type="container" class="p-4 rounded-lg">
							<schmancy-icon class="text-primary mb-2">lock</schmancy-icon>
							<schmancy-typography type="title" token="sm" class="mb-2 block">Lock Mode</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
								Prevent dismissal for critical workflows that require user action
							</schmancy-typography>
						</schmancy-surface>
					</schmancy-grid>
				</div>

				<!-- Common Use Cases -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Common Use Cases</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="p-6 rounded-lg">
						<schmancy-grid cols="1" gap="md">
							<div class="flex items-center gap-3">
								<schmancy-icon class="text-secondary">menu</schmancy-icon>
								<div>
									<schmancy-typography type="label" token="lg">Navigation Menu</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Mobile-friendly navigation that slides in from the side
									</schmancy-typography>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<schmancy-icon class="text-secondary">filter_list</schmancy-icon>
								<div>
									<schmancy-typography type="label" token="lg">Filter Panel</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Product filters, search refinements, or data table filters
									</schmancy-typography>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<schmancy-icon class="text-secondary">edit</schmancy-icon>
								<div>
									<schmancy-typography type="label" token="lg">Quick Edit Forms</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Edit user profiles, settings, or data without leaving the page
									</schmancy-typography>
								</div>
							</div>
							<div class="flex items-center gap-3">
								<schmancy-icon class="text-secondary">shopping_cart</schmancy-icon>
								<div>
									<schmancy-typography type="label" token="lg">Shopping Cart</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Review cart items and checkout process
									</schmancy-typography>
								</div>
							</div>
						</schmancy-grid>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
					<schmancy-grid gap="lg" class="w-full">
						<!-- Quick Start - Basic Usage -->
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								@click=${() => {
									this.addLog('Opening basic sheet')
									const content = document.createElement('div')
									content.className = 'p-6'
									content.innerHTML = `
										<schmancy-typography type="headline" token="sm" class="mb-4 block">Welcome!</schmancy-typography>
										<schmancy-typography type="body" token="md" class="text-surface-onVariant">
											This is the simplest way to open a sheet. Just pass a component!
										</schmancy-typography>
									`
									sheet.open({ component: content })
								}}
							>
								Quick Start
							</schmancy-button>
							// Simplest usage - just pass a component
const content = document.createElement('div')
content.innerHTML = '<p>Hello World!</p>'

sheet.open({ component: content })

// Or with a title
sheet.open({ 
  component: content,
  title: 'My Sheet'
})</div>
						</schmancy-code-preview>

						<!-- Position Control -->
						<schmancy-code-preview>
							<schmancy-grid flow="row" gap="sm">
								<schmancy-button
									variant="elevated"
									@click=${() => {
										this.addLog('Opening side sheet')
										const content = document.createElement('div')
										content.className = 'p-6'
										content.innerHTML = `
											<schmancy-typography type="headline" token="sm" class="mb-4 block">Side Sheet</schmancy-typography>
											<schmancy-typography type="body" token="md" class="text-surface-onVariant">
												This sheet is positioned on the side. Perfect for navigation menus or configuration panels.
											</schmancy-typography>
										`
										sheet.open({
											component: content,
											position: SchmancySheetPosition.Side,
											title: 'Side Sheet',
										})
									}}
								>
									<schmancy-icon>chevron_left</schmancy-icon>
									Side Sheet
								</schmancy-button>
								<schmancy-button
									variant="elevated"
									@click=${() => {
										this.addLog('Opening bottom sheet')
										const content = document.createElement('div')
										content.className = 'p-6'
										content.innerHTML = `
											<schmancy-typography type="headline" token="sm" class="mb-4 block">Bottom Sheet</schmancy-typography>
											<schmancy-typography type="body" token="md" class="text-surface-onVariant">
												This sheet slides up from the bottom. Great for mobile interfaces and action menus.
											</schmancy-typography>
										`
										sheet.open({
											component: content,
											position: SchmancySheetPosition.Bottom,
											title: 'Bottom Sheet',
										})
									}}
								>
									<schmancy-icon>keyboard_arrow_up</schmancy-icon>
									Bottom Sheet
								</schmancy-button>
							</schmancy-grid>
							${`// Force specific position
sheet.open({
  component: myComponent,
  position: SchmancySheetPosition.Side,  // Force side position
  title: 'Side Navigation'
})

sheet.open({
  component: myComponent,
  position: SchmancySheetPosition.Bottom, // Force bottom position
  title: 'Action Menu'
})

// Or let it auto-detect (default)
sheet.open({
  component: myComponent,
  title: 'Responsive Sheet'
  // position auto-detects: side on desktop, bottom on mobile
})`}
						</schmancy-code-preview>

						<!-- Navigation Menu Example -->
						<schmancy-code-preview>
							<schmancy-button
								variant="elevated"
								@click=${() => {
									this.addLog('Opening navigation menu')
									sheet.open({
										component: this.createNavigationMenu(),
										title: 'Menu',
										position: SchmancySheetPosition.Side,
									})
								}}
							>
								<schmancy-icon>menu</schmancy-icon>
								Navigation Menu
							</schmancy-button>
							${`// Navigation menu example
const nav = document.createElement('nav')
nav.innerHTML = \`
  <schmancy-list>
    <schmancy-list-item>
      <schmancy-icon slot="start">home</schmancy-icon>
      Home
    </schmancy-list-item>
    <schmancy-list-item>
      <schmancy-icon slot="start">person</schmancy-icon>
      Profile
    </schmancy-list-item>
    <schmancy-list-item>
      <schmancy-icon slot="start">settings</schmancy-icon>
      Settings
    </schmancy-list-item>
  </schmancy-list>
\`

sheet.open({
  component: nav,
  title: 'Menu',
  position: SchmancySheetPosition.Side
})`}
						</schmancy-code-preview>

						<!-- Filter Panel Example -->
						<schmancy-code-preview>
							<schmancy-button
								variant="elevated"
								@click=${() => {
									this.addLog('Opening filter panel')
									sheet.open({
										component: this.createFilterPanel(),
										title: 'Filters',
										uid: 'filter-panel',
										persist: true, // Keep filters in DOM
									})
								}}
							>
								<schmancy-icon>filter_list</schmancy-icon>
								Filter Products
							</schmancy-button>
							${`// Filter panel that persists state
const filters = document.createElement('schmancy-form')
filters.className = 'p-4'
filters.innerHTML = \`
  <schmancy-grid gap="md">
    <schmancy-select label="Category" .options=\${[
      { label: 'All Categories', value: '' },
      { label: 'Electronics', value: 'electronics' },
      { label: 'Clothing', value: 'clothing' }
    ]}></schmancy-select>
    <schmancy-range label="Price Range" min="0" max="1000"></schmancy-range>
    <schmancy-checkbox label="Free Shipping"></schmancy-checkbox>
    <schmancy-button variant="filled" type="submit">Apply Filters</schmancy-button>
  </schmancy-grid>
\`

sheet.open({
  component: filters,
  title: 'Filters',
  uid: 'filter-panel',
  persist: true // Keeps component in DOM when closed
})`}
						</schmancy-code-preview>

						<!-- Critical Action with Lock -->
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								color="error"
								@click=${() => {
									this.addLog('Opening locked confirmation sheet')
									const confirmDelete = document.createElement('div')
									confirmDelete.className = 'p-6'
									confirmDelete.innerHTML = `
										<schmancy-icon size="48" class="text-error mb-4">warning</schmancy-icon>
										<schmancy-typography type="headline" token="sm" class="mb-4 block">Delete Account?</schmancy-typography>
										<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
											This action cannot be undone. All your data will be permanently deleted.
										</schmancy-typography>
										<schmancy-grid flow="row" gap="sm">
											<schmancy-button variant="filled" color="error" id="confirm-delete">Delete Account</schmancy-button>
											<schmancy-button variant="text" id="cancel-delete">Cancel</schmancy-button>
										</schmancy-grid>
									`
									
									sheet.open({
										component: confirmDelete,
										uid: 'delete-confirm',
										lock: true,
										title: 'Confirm Action',
										handleHistory: false
									})
									
									// Add event listeners after sheet opens
									setTimeout(() => {
										confirmDelete.querySelector('#confirm-delete')?.addEventListener('click', () => {
											this.addLog('User confirmed deletion')
											sheet.dismiss('delete-confirm')
										})
										confirmDelete.querySelector('#cancel-delete')?.addEventListener('click', () => {
											this.addLog('User cancelled deletion')
											sheet.dismiss('delete-confirm')
										})
									}, 100)
								}}
							>
								Delete Account
							</schmancy-button>
							// Critical actions that require user confirmation
const confirmDialog = createDeleteConfirmation()

sheet.open({
  component: confirmDialog,
  uid: 'delete-confirm',
  lock: true, // Prevents ESC/overlay dismiss
  title: 'Confirm Action',
  handleHistory: false // Don't add to browser history
})

// Handle user actions
confirmDialog.querySelector('#confirm').onclick = () => {
  performDelete()
  sheet.dismiss('delete-confirm')
}

confirmDialog.querySelector('#cancel').onclick = () => {
  sheet.dismiss('delete-confirm')
}</div>
						</schmancy-code-preview>

						<!-- Persistent Sheet for State -->
						<schmancy-code-preview>
							<schmancy-button
								variant="elevated"
								@click=${() => {
									this.addLog('Opening persistent filter sheet')
									if (sheet.isOpen('filter-panel')) {
										sheet.open({
											component: document.querySelector('schmancy-sheet[uid="filter-panel"] schmancy-form'),
											uid: 'filter-panel',
											title: 'Filters',
											persist: true
										})
									} else {
										sheet.open({
											component: this.createFilterPanel(),
											uid: 'filter-panel',
											title: 'Filters',
											persist: true
										})
									}
								}}
							>
								Persistent Filters (Maintains State)
							</schmancy-button>
							// Sheet component stays in DOM when closed
sheet.open({
  component: myComponent,
  uid: 'persistent-example',
  persist: true,
  title: 'Persistent Sheet'
})</div>
						</schmancy-code-preview>

						<!-- Real-world: Edit Form -->
						<schmancy-code-preview>
							<schmancy-button
								variant="elevated"
								@click=${() => {
									this.addLog('Opening edit form')
									const form = this.createEditForm()
									sheet.open({
										component: form,
										title: 'Edit Profile',
										position: SchmancySheetPosition.Side,
									})
								}}
							>
								<schmancy-icon>edit</schmancy-icon>
								Edit Profile
							</schmancy-button>
							${`const form = document.createElement('schmancy-form')
form.innerHTML = \`
  <schmancy-input label="Name" required></schmancy-input>
  <schmancy-input label="Email" type="email"></schmancy-input>
  <schmancy-button type="submit">Save</schmancy-button>
\`

sheet.open({
  component: form,
  title: 'User Profile',
  position: SchmancySheetPosition.Side
})`}
						</schmancy-code-preview>

						<!-- Advanced: Sheet Stack Management -->
						<schmancy-code-preview>
							<schmancy-grid flow="row" gap="sm">
								<schmancy-button
									variant="filled"
									@click=${() => {
										this.addLog('Opening product catalog')
										const catalog = this.createProductCatalog()
										sheet.open({
											component: catalog,
											uid: 'catalog',
											title: 'Products',
										})
									}}
								>
									Open Catalog
								</schmancy-button>
								<schmancy-button
									variant="outlined"
									@click=${() => {
										this.addLog('Dismissing top sheet')
										sheet.dismiss() // Dismisses most recent
									}}
								>
									Close Top Sheet
								</schmancy-button>
								<schmancy-button
									variant="text"
									color="error"
									@click=${() => {
										this.addLog('Closing all sheets')
										sheet.closeAll()
									}}
								>
									Close All
								</schmancy-button>
							</schmancy-grid>
							// Sheet stack management

// Open product catalog
sheet.open({
  component: catalogComponent,
  uid: 'catalog',
  title: 'Products'
})

// User clicks a product - open details
sheet.open({
  component: productDetails,
  uid: 'product-123',
  title: 'Product Details'
})

// Dismiss the most recent sheet (no uid needed)
sheet.dismiss() // Closes product details

// Dismiss a specific sheet
sheet.dismiss('catalog')

// Check if a sheet is open
if (sheet.isOpen('catalog')) {
  console.log('Catalog is open')
}

// Close all sheets at once
sheet.closeAll()</div>
						</schmancy-code-preview>
					</schmancy-grid>

					<!-- Event Log -->
					${this.logs.length > 0 ? html`
						<div class="mt-8">
							<schmancy-typography type="title" token="md" class="mb-4 block">Event Log</schmancy-typography>
							<schmancy-surface type="surfaceDim" class="p-4 font-mono text-sm">
								${this.logs.map(log => html`
									<div class="text-surface-onVariant">${log}</div>
								`)}
							</schmancy-surface>
						</div>
					` : ''}
				</div>
			</schmancy-surface>
		`
	}

	private createNavigationMenu() {
		const nav = document.createElement('nav')
		nav.className = 'p-4'
		nav.innerHTML = `
			<schmancy-list>
				<schmancy-list-item interactive>
					<schmancy-icon slot="start">home</schmancy-icon>
					<span>Home</span>
				</schmancy-list-item>
				<schmancy-list-item interactive>
					<schmancy-icon slot="start">dashboard</schmancy-icon>
					<span>Dashboard</span>
				</schmancy-list-item>
				<schmancy-list-item interactive>
					<schmancy-icon slot="start">shopping_cart</schmancy-icon>
					<span>Orders</span>
					<schmancy-chip slot="end" size="sm" type="primary">12</schmancy-chip>
				</schmancy-list-item>
				<schmancy-list-item interactive>
					<schmancy-icon slot="start">inventory</schmancy-icon>
					<span>Products</span>
				</schmancy-list-item>
				<schmancy-divider></schmancy-divider>
				<schmancy-list-item interactive>
					<schmancy-icon slot="start">settings</schmancy-icon>
					<span>Settings</span>
				</schmancy-list-item>
				<schmancy-list-item interactive>
					<schmancy-icon slot="start">logout</schmancy-icon>
					<span>Sign Out</span>
				</schmancy-list-item>
			</schmancy-list>
		`
		return nav
	}

	private createFilterPanel() {
		const filters = document.createElement('schmancy-form')
		filters.className = 'p-4'
		filters.innerHTML = `
			<schmancy-grid gap="lg">
				<div>
					<schmancy-typography type="label" token="lg" class="mb-3 block">Category</schmancy-typography>
					<schmancy-radio-group name="category" value="all">
						<schmancy-radio value="all" label="All Products"></schmancy-radio>
						<schmancy-radio value="electronics" label="Electronics"></schmancy-radio>
						<schmancy-radio value="clothing" label="Clothing"></schmancy-radio>
						<schmancy-radio value="home" label="Home & Garden"></schmancy-radio>
					</schmancy-radio-group>
				</div>
				
				<div>
					<schmancy-typography type="label" token="lg" class="mb-3 block">Price Range</schmancy-typography>
					<schmancy-grid cols="2" gap="sm">
						<schmancy-input type="number" label="Min" value="0"></schmancy-input>
						<schmancy-input type="number" label="Max" value="1000"></schmancy-input>
					</schmancy-grid>
				</div>
				
				<div>
					<schmancy-typography type="label" token="lg" class="mb-3 block">Shipping</schmancy-typography>
					<schmancy-checkbox label="Free Shipping Only" checked></schmancy-checkbox>
					<schmancy-checkbox label="Prime Eligible"></schmancy-checkbox>
				</div>
				
				<schmancy-divider></schmancy-divider>
				
				<schmancy-grid flow="row" gap="sm">
					<schmancy-button variant="filled" type="submit">Apply Filters</schmancy-button>
					<schmancy-button variant="text">Reset</schmancy-button>
				</schmancy-grid>
			</schmancy-grid>
		`
		return filters
	}

	private createProductCatalog() {
		const catalog = document.createElement('div')
		catalog.className = 'p-4'
		catalog.innerHTML = `
			<schmancy-grid gap="md">
				${[1, 2, 3].map(i => `
					<schmancy-card type="elevated" class="cursor-pointer hover:shadow-md transition-shadow">
						<div class="p-4">
							<div class="bg-surface-container h-32 rounded mb-3 flex items-center justify-center">
								<schmancy-icon size="48" class="text-surface-onVariant opacity-50">image</schmancy-icon>
							</div>
							<schmancy-typography type="title" token="md" class="mb-1 block">Product ${i}</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="text-surface-onVariant mb-3">
								Amazing product with great features
							</schmancy-typography>
							<div class="flex items-center justify-between">
								<schmancy-typography type="title" token="lg" class="text-primary">$${i}99</schmancy-typography>
								<schmancy-button variant="filled" size="sm" id="product-${i}">
									View Details
								</schmancy-button>
							</div>
						</div>
					</schmancy-card>
				`).join('')}
			</schmancy-grid>
		`
		
		// Add click handlers for opening product details
		setTimeout(() => {
			catalog.querySelectorAll('[id^="product-"]').forEach(btn => {
				btn.addEventListener('click', (e) => {
					const productId = (e.target as HTMLElement).id.split('-')[1]
					this.openProductDetails(productId)
				})
			})
		}, 100)
		
		return catalog
	}

	private openProductDetails(productId: string) {
		const details = document.createElement('div')
		details.className = 'p-6'
		details.innerHTML = `
			<schmancy-typography type="headline" token="md" class="mb-4 block">Product ${productId} Details</schmancy-typography>
			<schmancy-typography type="body" token="md" class="text-surface-onVariant mb-4">
				This is the detailed view for product ${productId}. You can add more information, images, and actions here.
			</schmancy-typography>
			<schmancy-button variant="filled" @click=${() => sheet.dismiss()}>
				Back to Catalog
			</schmancy-button>
		`
		
		sheet.open({
			component: details,
			uid: `product-${productId}`,
			title: `Product ${productId}`,
		})
	}

	private createEditForm() {
		const form = document.createElement('schmancy-form')
		form.className = 'p-6'
		form.innerHTML = `
			<schmancy-grid gap="md">
				<schmancy-typography type="headline" token="sm" class="block">Edit Profile</schmancy-typography>
				<schmancy-input label="Name" required value="John Doe"></schmancy-input>
				<schmancy-input label="Email" type="email" value="john@example.com"></schmancy-input>
				<schmancy-select label="Role" value="developer"></schmancy-select>
				<schmancy-grid flow="row" gap="sm" class="mt-4">
					<schmancy-button type="submit" variant="filled">Save</schmancy-button>
					<schmancy-button variant="text" type="button">Cancel</schmancy-button>
				</schmancy-grid>
			</schmancy-grid>
		`
		
		// Add select options after creation
		const select = form.querySelector('schmancy-select')
		if (select) {
			select.setAttribute('options', JSON.stringify([
				{ label: 'Developer', value: 'developer' },
				{ label: 'Designer', value: 'designer' },
				{ label: 'Manager', value: 'manager' }
			]))
		}
		
		// Add cancel handler
		const cancelBtn = form.querySelector('schmancy-button[type="button"]')
		cancelBtn?.addEventListener('click', () => sheet.dismiss())
		
		return form
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'demo-sheet': DemoSheet
	}
}
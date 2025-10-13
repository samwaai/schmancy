import { $LitElement } from '@mixins/index'
import { $dialog } from '@schmancy/dialog'
import { sheet } from '@schmancy/sheet'
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '../../shared/installation-section'

// Test component that accepts props
@customElement('demo-detail-view')
class DemoDetailView extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@property() itemId!: string
	@property() itemTitle?: string
	@property() description?: string

	render() {
		return html`
			<div class="p-6">
				<schmancy-typography type="headline" token="md" class="mb-4 block">
					${this.itemTitle || 'Detail View'}
				</schmancy-typography>
				<schmancy-grid gap="md">
					<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
						<schmancy-typography type="label" token="sm" class="mb-2 block text-surface-onVariant">
							Item ID
						</schmancy-typography>
						<schmancy-typography type="body" token="md">
							${this.itemId || 'No ID provided'}
						</schmancy-typography>
					</schmancy-surface>
					${this.description ? html`
						<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
							<schmancy-typography type="label" token="sm" class="mb-2 block text-surface-onVariant">
								Description
							</schmancy-typography>
							<schmancy-typography type="body" token="md">
								${this.description}
							</schmancy-typography>
						</schmancy-surface>
					` : ''}
				</schmancy-grid>
			</div>
		`
	}
}

@customElement('overlays-sheet')
export default class OverlaysSheet extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Sheet
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Slide-in panels for navigation, forms, and temporary UI.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript" .preview=${false}>
import { sheet } from '@mhmo91/schmancy/sheet'
					</schmancy-code-preview>
				</div>

				<!-- Quick Start -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Quick Start</schmancy-typography>
					<schmancy-code-preview language="javascript" .preview=${false}>
// Recommended: Use push() with props
sheet.push({
  component: 'my-detail-view',
  props: {
    itemId: '123',
    title: 'Item Details'
  }
})

// Pass props to component instances
const item = { id: 'abc-123', name: 'Product A' }
sheet.push({
  component: 'product-details',
  props: {
    productId: item.id,
    productName: item.name
  },
  uid: 'product-sheet'
})

// Dismiss
sheet.dismiss()
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">API Reference</schmancy-typography>

					<schmancy-typography type="headline" token="sm" class="mb-4 block">Methods</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Method</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">sheet.push(config)</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Opens a sheet with component and props (recommended, follows area router pattern)
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">sheet.open(config)</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<span class="text-warning">@deprecated</span> - Use push() instead
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">sheet.dismiss(uid?)</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Closes sheet by uid or the most recent if no uid provided
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">sheet.closeAll()</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Closes all open sheets
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">sheet.isOpen(uid)</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Returns true if sheet with uid is open
										</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<schmancy-typography type="headline" token="sm" class="mb-4 block">Configuration Options</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Property</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Type</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Default</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">component</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">ComponentType</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">required</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Component to display (string, class, element, or lazy)
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">props</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Record&lt;string, unknown&gt;</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">undefined</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Properties to pass to the component
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">title</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Optional title displayed in the sheet header
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">position</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'side' | 'bottom'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">auto</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Sheet position (auto-detects: mobile=bottom, desktop=side)
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">uid</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">component.tagName</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Unique identifier for the sheet instance
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">lock</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Prevents dismissal via ESC key or overlay click
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">persist</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Keeps sheet in DOM after closing
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">handleHistory</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">true</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Integrates with browser back button
										</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm">header</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'visible' | 'hidden'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'visible'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Controls visibility of the sheet header
										</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
					<schmancy-grid gap="lg" class="w-full">
						<!-- Props Example (NEW) -->
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								@click=${() => {
									// Simulate passing data to a detail view component
									const mockItem = {
										id: 'item-' + Math.floor(Math.random() * 1000),
										title: 'Sample Product',
										description: 'This component received props from the sheet.push() method'
									}

									sheet.push({
										component: 'demo-detail-view',
										props: {
											itemId: mockItem.id,
											itemTitle: mockItem.title,
											description: mockItem.description
										},
										uid: 'detail-sheet-props'
									})
								}}
							>
								<schmancy-icon>visibility</schmancy-icon>
								Open with Props
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Basic Sheet -->
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								@click=${() => {
									const content = document.createElement('div')
									content.className = 'p-6'
									content.innerHTML = `
										<schmancy-typography type="headline" token="sm" class="mb-4 block">Hello!</schmancy-typography>
										<schmancy-typography type="body" token="md" class="text-surface-onVariant">
											This is a basic sheet example.
										</schmancy-typography>
									`
									sheet.open({
										component: content,
										uid: 'basic-sheet'
									})
								}}
							>
								Open Basic Sheet
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Position Options -->
						<schmancy-code-preview>
							<schmancy-grid flow="row" gap="sm">
								<schmancy-button
									variant="elevated"
									@click=${() => {
										const content = document.createElement('div')
										content.className = 'p-6'
										content.innerHTML = '<p>Side positioned sheet</p>'
										sheet.open({
											component: content,
											
											uid: 'side-sheet'
										})
									}}
								>
									Side Sheet
								</schmancy-button>
								<schmancy-button
									variant="elevated"
									@click=${() => {
										const content = document.createElement('div')
										content.className = 'p-6'
										content.innerHTML = '<p>Bottom positioned sheet</p>'
										sheet.open({
											component: content,
											
											uid: 'bottom-sheet'
										})
									}}
								>
									Bottom Sheet
								</schmancy-button>
							</schmancy-grid>
						</schmancy-code-preview>

						<!-- Navigation Menu -->
						<schmancy-code-preview>
							<schmancy-button
								variant="elevated"
								@click=${() => {
									const nav = document.createElement('nav')
									nav.className = 'p-4'
									nav.innerHTML = `
										<schmancy-list>
											<schmancy-list-item interactive>
												<schmancy-icon slot="start">home</schmancy-icon>
												<span>Home</span>
											</schmancy-list-item>
											<schmancy-list-item interactive>
												<schmancy-icon slot="start">person</schmancy-icon>
												<span>Profile</span>
											</schmancy-list-item>
											<schmancy-list-item interactive>
												<schmancy-icon slot="start">settings</schmancy-icon>
												<span>Settings</span>
											</schmancy-list-item>
										</schmancy-list>
									`
									sheet.open({
										component: nav,
										
										uid: 'nav-menu'
									})
								}}
							>
								<schmancy-icon>menu</schmancy-icon>
								Navigation Menu
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Form Example -->
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								@click=${() => {
									const form = document.createElement('schmancy-form')
									form.className = 'p-6'
									form.innerHTML = `
										<schmancy-grid gap="md">
											<schmancy-input label="Name" required></schmancy-input>
											<schmancy-input label="Email" type="email"></schmancy-input>
											<schmancy-button type="submit" variant="filled">Save</schmancy-button>
										</schmancy-grid>
									`
									sheet.open({
										component: form,
										uid: 'edit-form'
									})
								}}
							>
								<schmancy-icon>edit</schmancy-icon>
								Edit Form
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Date Range Filter Example -->
						<schmancy-code-preview>
							<schmancy-button
								variant="elevated"
								@click=${() => {
									const dateFilterContent = document.createElement('div')
									dateFilterContent.className = 'p-6'
									dateFilterContent.innerHTML = `
										<schmancy-grid gap="lg">
											<schmancy-typography type="headline" token="sm" class="block">
												Filter by Date Range
											</schmancy-typography>

											<schmancy-date-range
												id="dateRange"
												placeholder="Select date range"
												clearable
												.customPresets="${[
													{
														label: 'Last 7 Days',
														dateFrom: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
														dateTo: new Date().toISOString().split('T')[0]
													},
													{
														label: 'Last 30 Days',
														dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
														dateTo: new Date().toISOString().split('T')[0]
													},
													{
														label: 'This Month',
														dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
														dateTo: new Date().toISOString().split('T')[0]
													}
												]}"
											></schmancy-date-range>

											<div class="flex gap-2">
												<schmancy-button id="applyBtn" variant="filled">
													Apply Filter
												</schmancy-button>
												<schmancy-button id="cancelBtn" variant="text">
													Cancel
												</schmancy-button>
											</div>
										</schmancy-grid>
									`

									// Add event listeners after creating the element
									const dateRange = dateFilterContent.querySelector('#dateRange')
									const applyBtn = dateFilterContent.querySelector('#applyBtn')
									const cancelBtn = dateFilterContent.querySelector('#cancelBtn')

									dateRange?.addEventListener('change', (e: CustomEvent) => {
									})

									applyBtn?.addEventListener('click', () => {
										const dateRangeEl = dateRange as any
										const event = new CustomEvent('filter-applied', {
											detail: {
												dateFrom: dateRangeEl?.dateFrom?.value || '',
												dateTo: dateRangeEl?.dateTo?.value || ''
											},
											bubbles: true,
											composed: true
										})
										dateFilterContent.dispatchEvent(event)
										sheet.dismiss('date-filter')
									})

									cancelBtn?.addEventListener('click', () => {
										sheet.dismiss('date-filter')
									})

									sheet.open({
										component: dateFilterContent,
										uid: 'date-filter'
									})
								}}
							>
								<schmancy-icon>calendar_today</schmancy-icon>
								Date Range Filter
							</schmancy-button>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>

				<!-- Dismiss Testing Example -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-6 block">Dismiss Testing</schmancy-typography>
					<schmancy-grid gap="lg" class="w-full">
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								@click=${() => {
									// Test dismiss functionality
									const testContent = document.createElement('div')
									testContent.className = 'p-6'
									testContent.innerHTML = `
										<schmancy-grid gap="md">
											<schmancy-typography type="headline" token="sm" class="block">
												Test Dismiss Functionality
											</schmancy-typography>
											<schmancy-typography type="body" token="md" class="text-surface-onVariant block">
												Try these ways to close the sheet:
											</schmancy-typography>
											<ul class="list-disc pl-6 space-y-2">
												<li>Click outside the sheet (on the overlay)</li>
												<li>Press the ESC key</li>
												<li>Click the X button in the header</li>
												<li>Click the button below</li>
											</ul>
											<schmancy-button id="dismissBtn" variant="filled">
												Dismiss Programmatically
											</schmancy-button>
										</schmancy-grid>
									`

									// Add dismiss button handler
									setTimeout(() => {
										const dismissBtn = testContent.querySelector('#dismissBtn')
										dismissBtn?.addEventListener('click', () => {
											sheet.dismiss('dismiss-test')
										})
									}, 100)

									sheet.open({
										component: testContent,
										uid: 'dismiss-test',
										onBeforeOpen: (component) => {
										},
										onAfterOpen: (component) => {

											// Log sheet state

											// Test auto-dismiss after 10 seconds
											setTimeout(() => {
												if (sheet.isOpen('dismiss-test')) {
													sheet.dismiss('dismiss-test')
												}
											}, 10000)
										}
									})
								}}
							>
								Test Dismiss Functionality
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Dialog from Sheet Example -->
						<schmancy-code-preview>
							<schmancy-button
								variant="filled"
								@click=${() => {
									const content = document.createElement('div')
									content.className = 'p-6'
									content.innerHTML = `

										<schmancy-grid gap="md">
											<schmancy-typography type="headline" token="sm" class="block">
												Sheet with Dialog Test
											</schmancy-typography>
											<schmancy-typography type="body" token="md" class="text-surface-onVariant block">
												Click the button below to open a dialog from within this sheet.
											</schmancy-typography>
											<schmancy-button id="openDialogBtn" variant="filled">
												Open Dialog
											</schmancy-button>
											<schmancy-typography type="body" token="sm" class="text-surface-onVariant block">
												The dialog should appear above this sheet.
											</schmancy-typography>
										</schmancy-grid>
									`

									// Add event listener to open dialog
									setTimeout(() => {
										const btn = content.querySelector('#openDialogBtn')
										btn?.addEventListener('click', async () => {
											const confirmed = await $dialog.confirm({
												title: 'Dialog Above Sheet',
												message: 'This dialog should appear above the sheet. Can you see it properly?',
												confirmText: 'Yes, it works!',
												cancelText: 'No, it\'s behind'
											})
										})
									}, 100)

									sheet.open({
										component: content,
										uid: 'dialog-test-sheet'
									})
								}}
							>
								Test Dialog Above Sheet
							</schmancy-button>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'overlays-sheet': OverlaysSheet
	}
}
import { $LitElement } from '@mixins/index'
import { sheet } from '@schmancy/sheet'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'
import '@schmancy/date-range'

@customElement('demo-sheet')
export class DemoSheet extends $LitElement() {
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
// Basic usage
const content = document.createElement('div')
content.innerHTML = '<p>Hello World!</p>'
sheet.open({ component: content })

// With options
sheet.open({ 
  component: content,
  title: 'My Sheet',
  position: 'side'
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
										<code class="text-sm">sheet.open(config)</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											Opens a sheet with component, title, position, etc.
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
										<schmancy-typography type="body" token="sm">HTMLElement</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">required</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											The content element to display in the sheet
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
										title: 'Basic Sheet',
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
											title: 'Side Sheet',
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
											title: 'Bottom Sheet',
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
										title: 'Menu',
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
										title: 'Edit Profile',
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

									dateRange?.addEventListener('change', (e) => {
										console.log('Date range selected:', e.detail)
									})

									applyBtn?.addEventListener('click', () => {
										const event = new CustomEvent('filter-applied', {
											detail: { dateFrom: dateRange.dateFrom, dateTo: dateRange.dateTo },
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
										title: 'Date Filter',
										uid: 'date-filter',
										position: 'side'
									})
								}}
							>
								<schmancy-icon>calendar_today</schmancy-icon>
								Date Range Filter
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
		'demo-sheet': DemoSheet
	}
}
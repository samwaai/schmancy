import { $LitElement } from '@mixins/index'
import { sheet } from '@schmancy/sheet'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

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
					
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
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
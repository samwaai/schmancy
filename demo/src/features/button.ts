import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-button')
export class DemoButton extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Button
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design 3 buttons with 5 variants and full accessibility support.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/button'
						import '@mhmo91/schmancy/icon-button' // For icon-only buttons
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<!-- Button Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">Button Component</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden mb-6">
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">variant</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'elevated' | 'filled' | 'filled tonal' | 'outlined' | 'text'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'text'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Visual style variant</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">width</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'auto' | 'full'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'auto'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Button width behavior</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">type</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'button' | 'submit' | 'reset'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'button'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">HTML button type attribute</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">href</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Makes button a link</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">disabled</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Disable button interactions</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">ariaLabel</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">undefined</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Accessibility label</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Icon Button Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">Icon Button Component</schmancy-typography>
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">variant</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'filled' | 'filled tonal' | 'outlined' | 'standard'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'standard'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Visual style variant</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">size</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'sm' | 'md' | 'lg'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'md'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Button size (40px, 48px, 56px)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">ariaLabel</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">required</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Required accessibility label</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Slots -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Slots</schmancy-typography>
					<schmancy-surface type="surfaceDim" class="rounded-lg overflow-hidden">
						<table class="w-full">
							<thead class="bg-surface-container">
								<tr>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Slot Name</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">default</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Button text content</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">prefix</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Icon or content before text</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">suffix</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Icon or content after text</schmancy-typography>
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
						<!-- Button Variants -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-4">
								<schmancy-button variant="elevated">Elevated</schmancy-button>
								<schmancy-button variant="filled">Filled</schmancy-button>
								<schmancy-button variant="filled tonal">Filled Tonal</schmancy-button>
								<schmancy-button variant="outlined">Outlined</schmancy-button>
								<schmancy-button variant="text">Text</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Disabled States -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-4">
								<schmancy-button disabled variant="elevated">Elevated</schmancy-button>
								<schmancy-button disabled variant="filled">Filled</schmancy-button>
								<schmancy-button disabled variant="filled tonal">Tonal</schmancy-button>
								<schmancy-button disabled variant="outlined">Outlined</schmancy-button>
								<schmancy-button disabled variant="text">Text</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Buttons with Icons -->
						<schmancy-code-preview language="html">
							<div class="flex gap-4">
								<schmancy-button variant="filled">
									<schmancy-icon slot="prefix">add</schmancy-icon>
									Add Item
								</schmancy-button>
								<schmancy-button variant="outlined">
									Send
									<schmancy-icon slot="suffix">send</schmancy-icon>
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Icon-Only Buttons -->
						<schmancy-code-preview language="html">
							<div class="flex gap-4 items-center">
								<schmancy-icon-button ariaLabel="Settings" size="sm">
									settings
								</schmancy-icon-button>
								<schmancy-icon-button ariaLabel="Edit" variant="filled" size="md">
									edit
								</schmancy-icon-button>
								<schmancy-icon-button ariaLabel="Delete" variant="outlined" size="lg">
									delete
								</schmancy-icon-button>
							</div>
						</schmancy-code-preview>

						<!-- Full Width Button -->
						<schmancy-code-preview language="html">
							<schmancy-button variant="filled" width="full">
								Full Width Button
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Link Button -->
						<schmancy-code-preview language="html">
							<div class="flex gap-4">
								<schmancy-button href="https://example.com" variant="text">
									External Link
									<schmancy-icon slot="suffix">open_in_new</schmancy-icon>
								</schmancy-button>
								<schmancy-button href="/docs" variant="outlined">
									View Documentation
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Loading State Pattern -->
						<schmancy-code-preview language="html">
							<div class="flex gap-4">
								<schmancy-button variant="filled" disabled>
									<schmancy-spinner slot="prefix" size="4" color="surface"></schmancy-spinner>
									Processing...
								</schmancy-button>
								<schmancy-button variant="outlined" disabled>
									Saving
									<schmancy-spinner slot="suffix" size="4" color="surface"></schmancy-spinner>
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Form Buttons -->
						<schmancy-code-preview language="html">
							<form class="space-y-4">
								<schmancy-input placeholder="Enter your email" type="email"></schmancy-input>
								<div class="flex gap-2 justify-end">
									<schmancy-button type="reset" variant="text">
										Reset
									</schmancy-button>
									<schmancy-button type="submit" variant="filled">
										Submit
									</schmancy-button>
								</div>
							</form>
						</schmancy-code-preview>

						<!-- Button Group -->
						<schmancy-code-preview language="html">
							<div class="inline-flex rounded-lg overflow-hidden divide-x divide-outline">
								<schmancy-button variant="filled tonal" class="rounded-none">
									<schmancy-icon>format_align_left</schmancy-icon>
								</schmancy-button>
								<schmancy-button variant="filled tonal" class="rounded-none">
									<schmancy-icon>format_align_center</schmancy-icon>
								</schmancy-button>
								<schmancy-button variant="filled tonal" class="rounded-none">
									<schmancy-icon>format_align_right</schmancy-icon>
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Real-World Example: Action Bar -->
						<schmancy-code-preview language="html">
							<schmancy-card>
								<div class="p-6">
									<schmancy-typography type="headline" token="sm" class="mb-2 block">
										Confirm Action
									</schmancy-typography>
									<schmancy-typography type="body" token="md" class="text-surface-onVariant block">
										Are you sure you want to delete this item? This action cannot be undone.
									</schmancy-typography>
								</div>
								<schmancy-card-action>
									<schmancy-button variant="text">Cancel</schmancy-button>
									<schmancy-button variant="filled">Delete</schmancy-button>
								</schmancy-card-action>
							</schmancy-card>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-button': DemoButton
	}
}
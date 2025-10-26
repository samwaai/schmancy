import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-core-buttons')
export default class DemoCoreButtons extends $LitElement() {
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
											'elevated' | 'filled' | 'filled tonal' | 'tonal' | 'outlined' | 'text'
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

						<!-- Tonal Variant Compatibility -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-4 items-center">
								<schmancy-button variant="tonal">Tonal (alias)</schmancy-button>
								<schmancy-button variant="filled tonal">Filled Tonal (original)</schmancy-button>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									Both render identically
								</schmancy-typography>
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

					<!-- Width Examples Section -->
					<schmancy-typography type="title" token="lg" class="mb-6 mt-12 block">Width Examples</schmancy-typography>
					<schmancy-typography type="body" token="lg" class="mb-6 text-surface-onVariant block">
						Buttons support flexible width options through both the width property and Tailwind classes.
					</schmancy-typography>

					<schmancy-grid gap="lg" class="w-full">
						<!-- Full Width with Property -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Using width="full" property
								</schmancy-typography>
								<schmancy-button variant="filled" width="full">
									Full Width Button
								</schmancy-button>
								<schmancy-button variant="outlined" width="full">
									Another Full Width Button
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Full Width with Tailwind Class -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Using w-full Tailwind class
								</schmancy-typography>
								<schmancy-button variant="filled" class="w-full">
									Full Width with Tailwind
								</schmancy-button>
								<schmancy-button variant="elevated" class="w-full">
									Elevated Full Width
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- All Variants Full Width -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									All variants with full width
								</schmancy-typography>
								<schmancy-button variant="elevated" class="w-full">Elevated</schmancy-button>
								<schmancy-button variant="filled" class="w-full">Filled</schmancy-button>
								<schmancy-button variant="filled tonal" class="w-full">Filled Tonal</schmancy-button>
								<schmancy-button variant="outlined" class="w-full">Outlined</schmancy-button>
								<schmancy-button variant="text" class="w-full">Text</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Full Width with Icons -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Full width buttons with icons
								</schmancy-typography>
								<schmancy-button variant="filled" class="w-full">
									<schmancy-icon slot="prefix">shopping_cart</schmancy-icon>
									Add to Cart
								</schmancy-button>
								<schmancy-button variant="outlined" class="w-full">
									Download Report
									<schmancy-icon slot="suffix">download</schmancy-icon>
								</schmancy-button>
								<schmancy-button variant="filled tonal" class="w-full">
									<schmancy-icon slot="prefix">upload</schmancy-icon>
									Upload Files
									<schmancy-icon slot="suffix">arrow_forward</schmancy-icon>
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Icon Buttons Full Width -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Icon buttons with full width (stretches to container width)
								</schmancy-typography>
								<schmancy-icon-button ariaLabel="Settings" variant="filled" class="w-full">
									settings
								</schmancy-icon-button>
								<schmancy-icon-button ariaLabel="More options" variant="outlined" class="w-full">
									more_horiz
								</schmancy-icon-button>
								<schmancy-icon-button ariaLabel="Add" variant="filled tonal" class="w-full">
									add
								</schmancy-icon-button>
							</div>
						</schmancy-code-preview>

						<!-- Button Groups Full Width -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Button groups with full width
								</schmancy-typography>
								<!-- Equal width buttons in a row -->
								<div class="flex gap-2">
									<schmancy-button variant="outlined" class="flex-1">
										Previous
									</schmancy-button>
									<schmancy-button variant="filled" class="flex-1">
										Next
									</schmancy-button>
								</div>
								<!-- Three equal buttons -->
								<div class="flex gap-2">
									<schmancy-button variant="text" class="flex-1">
										Option 1
									</schmancy-button>
									<schmancy-button variant="text" class="flex-1">
										Option 2
									</schmancy-button>
									<schmancy-button variant="text" class="flex-1">
										Option 3
									</schmancy-button>
								</div>
							</div>
						</schmancy-code-preview>

						<!-- Responsive Width -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Responsive width (full on mobile, auto on desktop)
								</schmancy-typography>
								<schmancy-button variant="filled" class="w-full sm:w-auto">
									Responsive Button
								</schmancy-button>
								<schmancy-button variant="outlined" class="w-full md:w-auto">
									Full until Medium
								</schmancy-button>
								<schmancy-button variant="elevated" class="w-full lg:w-auto">
									Full until Large
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Mixed Width Layouts -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Mixed width layouts
								</schmancy-typography>
								<!-- Form with mixed widths -->
								<div class="space-y-3">
									<schmancy-input placeholder="Enter your email" class="w-full"></schmancy-input>
									<schmancy-button variant="filled" class="w-full">
										Subscribe to Newsletter
									</schmancy-button>
								</div>
								<!-- Action bar with mixed widths -->
								<div class="flex gap-2">
									<schmancy-button variant="text" class="flex-shrink-0">
										Cancel
									</schmancy-button>
									<schmancy-button variant="filled" class="flex-1">
										Save Changes
									</schmancy-button>
								</div>
							</div>
						</schmancy-code-preview>

						<!-- Constrained Full Width -->
						<schmancy-code-preview language="html">
							<div class="max-w-sm mx-auto space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Full width within constrained container
								</schmancy-typography>
								<schmancy-button variant="filled" class="w-full">
									Login
								</schmancy-button>
								<schmancy-button variant="outlined" class="w-full">
									Create Account
								</schmancy-button>
								<schmancy-button variant="text" class="w-full">
									Forgot Password?
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Loading States Full Width -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="md" class="block mb-2">
									Loading states with full width
								</schmancy-typography>
								<schmancy-button variant="filled" class="w-full" disabled>
									<schmancy-spinner slot="prefix" size="4" color="surface"></schmancy-spinner>
									Processing Payment...
								</schmancy-button>
								<schmancy-button variant="outlined" class="w-full" disabled>
									Uploading Files
									<schmancy-spinner slot="suffix" size="4" color="surface"></schmancy-spinner>
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Real-World Example: Mobile-First Form -->
						<schmancy-code-preview language="html">
							<schmancy-card class="max-w-md mx-auto">
								<div class="p-6 space-y-4">
									<schmancy-typography type="headline" token="md" class="block">
										Sign In
									</schmancy-typography>
									<schmancy-input
										placeholder="Email"
										type="email"
										class="w-full">
									</schmancy-input>
									<schmancy-input
										placeholder="Password"
										type="password"
										class="w-full">
									</schmancy-input>
									<schmancy-button variant="filled" class="w-full">
										Sign In
									</schmancy-button>
									<div class="flex gap-2">
										<schmancy-button variant="outlined" class="flex-1">
											<schmancy-icon slot="prefix">mail</schmancy-icon>
											Google
										</schmancy-button>
										<schmancy-button variant="outlined" class="flex-1">
											<schmancy-icon slot="prefix">smartphone</schmancy-icon>
											GitHub
										</schmancy-button>
									</div>
									<schmancy-button variant="text" class="w-full">
										Don't have an account? Sign up
									</schmancy-button>
								</div>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Real-World Example: E-commerce Actions -->
						<schmancy-code-preview language="html">
							<schmancy-card>
								<div class="p-6 space-y-4">
									<schmancy-typography type="headline" token="sm" class="block">
										Product Actions
									</schmancy-typography>
									<!-- Mobile-first full width on small screens -->
									<div class="flex flex-col sm:flex-row gap-3">
										<schmancy-button variant="filled" class="w-full sm:flex-1">
											<schmancy-icon slot="prefix">shopping_cart</schmancy-icon>
											Add to Cart
										</schmancy-button>
										<schmancy-button variant="filled tonal" class="w-full sm:w-auto">
											<schmancy-icon>favorite_border</schmancy-icon>
										</schmancy-button>
									</div>
									<schmancy-button variant="outlined" class="w-full">
										Buy Now
									</schmancy-button>
								</div>
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
		'demo-core-buttons': DemoCoreButtons
	}
}
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
					Material Design 3 buttons with multiple variants and states for user interactions.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/button'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
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
											'elevated' | 'filled' | 'filled tonal' | 'outlined' | 'text'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'filled'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Button style variant</schmancy-typography>
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">loading</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Show loading state</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Button type attribute</schmancy-typography>
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
								<schmancy-button variant="elevated">elevated</schmancy-button>
								<schmancy-button variant="filled">filled</schmancy-button>
								<schmancy-button variant="filled tonal">filled tonal</schmancy-button>
								<schmancy-button variant="outlined">outlined</schmancy-button>
								<schmancy-button variant="text">text</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Disabled States -->
						<schmancy-code-preview language="html">
							<div class="flex flex-wrap gap-4">
								<schmancy-button disabled variant="elevated">elevated</schmancy-button>
								<schmancy-button disabled variant="filled">filled</schmancy-button>
								<schmancy-button disabled variant="filled tonal">tonal</schmancy-button>
								<schmancy-button disabled variant="outlined">outlined</schmancy-button>
								<schmancy-button disabled variant="text">text</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Full Width Button -->
						<schmancy-code-preview language="html">
							<schmancy-button variant="filled" width="full">
								Full Width Button
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Button with Icon -->
						<schmancy-code-preview language="html">
							<div class="flex gap-4">
								<schmancy-button variant="filled">
									<schmancy-icon slot="start">add</schmancy-icon>
									Add Item
								</schmancy-button>
								<schmancy-button variant="outlined">
									Send
									<schmancy-icon slot="end">send</schmancy-icon>
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Loading State -->
						<schmancy-code-preview language="html">
							<div class="flex gap-4">
								<schmancy-button variant="filled" loading>
									Processing...
								</schmancy-button>
								<schmancy-button variant="outlined" loading>
									Saving
								</schmancy-button>
							</div>
						</schmancy-code-preview>

						<!-- Custom Styled Button -->
						<schmancy-code-preview language="html">
							<schmancy-button variant="filled" class="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
								<schmancy-typography type="label" token="lg" class="px-4 py-2">
									Custom Gradient
								</schmancy-typography>
							</schmancy-button>
						</schmancy-code-preview>

						<!-- Form Buttons -->
						<schmancy-code-preview language="html">
							<form class="space-y-4">
								<schmancy-input placeholder="Enter your email" type="email"></schmancy-input>
								<div class="flex gap-2">
									<schmancy-button type="submit" variant="filled">
										Submit
									</schmancy-button>
									<schmancy-button type="reset" variant="text">
										Reset
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

						<!-- Size Variations with Typography -->
						<schmancy-code-preview language="html">
							<div class="flex items-center gap-4">
								<schmancy-button variant="filled" class="h-auto">
									<schmancy-typography type="label" token="sm" class="px-2 py-1">
										Small
									</schmancy-typography>
								</schmancy-button>
								<schmancy-button variant="filled">
									Default
								</schmancy-button>
								<schmancy-button variant="filled" class="h-auto">
									<schmancy-typography type="headline" token="sm" class="px-6 py-4">
										Large
									</schmancy-typography>
								</schmancy-button>
							</div>
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
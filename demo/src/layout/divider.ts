import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import './shared/installation-section'

@customElement('layout-divider')
export default class LayoutDivider extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Divider
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Visual separator for content sections with outline variants and orientations.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/divider'
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">outline</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'default' | 'variant'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'variant'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Border color variant</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">orientation</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'horizontal' | 'vertical'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'horizontal'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Divider orientation</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">grow</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'start' | 'end' | 'both'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'start'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Growth direction</schmancy-typography>
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
						<!-- Basic Horizontal -->
						<schmancy-code-preview title="Basic Horizontal">
							<div class="w-full">
								<schmancy-typography type="body" token="md" class="mb-2">
									Content above divider
								</schmancy-typography>
								<schmancy-divider></schmancy-divider>
								<schmancy-typography type="body" token="md" class="mt-2">
									Content below divider
								</schmancy-typography>
							</div>
						</schmancy-code-preview>

						<!-- Outline Variants -->
						<schmancy-code-preview title="Outline Variants">
							<div class="w-full space-y-4">
								<div>
									<schmancy-typography type="label" token="sm" class="mb-2 block">
										Default (outline)
									</schmancy-typography>
									<schmancy-divider outline="default"></schmancy-divider>
								</div>
								<div>
									<schmancy-typography type="label" token="sm" class="mb-2 block">
										Variant (outline-variant) - More Subtle
									</schmancy-typography>
									<schmancy-divider outline="variant"></schmancy-divider>
								</div>
							</div>
						</schmancy-code-preview>

						<!-- Dark Theme Test -->
						<schmancy-code-preview title="Dark Surface Test">
							<div class="w-full space-y-4">
								<schmancy-surface type="surfaceDim" class="p-4 rounded">
									<schmancy-typography type="label" token="sm" class="mb-2 block">
										On Dim Surface
									</schmancy-typography>
									<schmancy-divider></schmancy-divider>
								</schmancy-surface>

								<schmancy-surface type="containerLow" class="p-4 rounded">
									<schmancy-typography type="label" token="sm" class="mb-2 block">
										On Container Low Surface
									</schmancy-typography>
									<schmancy-divider outline="default"></schmancy-divider>
								</schmancy-surface>

								<schmancy-surface type="containerHighest" class="p-4 rounded">
									<schmancy-typography type="label" token="sm" class="mb-2 block">
										On Container Highest Surface
									</schmancy-typography>
									<schmancy-divider></schmancy-divider>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Vertical Orientation -->
						<schmancy-code-preview title="Vertical Dividers">
							<div class="flex items-center gap-4" style="height: 100px">
								<schmancy-typography type="body" token="md">Section 1</schmancy-typography>
								<schmancy-divider orientation="vertical"></schmancy-divider>
								<schmancy-typography type="body" token="md">Section 2</schmancy-typography>
								<schmancy-divider orientation="vertical" outline="default"></schmancy-divider>
								<schmancy-typography type="body" token="md">Section 3</schmancy-typography>
							</div>
						</schmancy-code-preview>

						<!-- In Lists -->
						<schmancy-code-preview title="In Lists">
							<schmancy-surface type="containerLow" class="rounded-lg overflow-hidden">
								<div class="p-4">
									<schmancy-typography type="title" token="md">Item 1</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Description for first item
									</schmancy-typography>
								</div>
								<schmancy-divider></schmancy-divider>
								<div class="p-4">
									<schmancy-typography type="title" token="md">Item 2</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Description for second item
									</schmancy-typography>
								</div>
								<schmancy-divider></schmancy-divider>
								<div class="p-4">
									<schmancy-typography type="title" token="md">Item 3</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										Description for third item
									</schmancy-typography>
								</div>
							</schmancy-surface>
						</schmancy-code-preview>

						<!-- In Cards -->
						<schmancy-code-preview title="In Cards">
							<schmancy-card type="outlined" class="w-full">
								<schmancy-card-content class="p-0">
									<div class="p-4">
										<schmancy-typography type="title" token="lg" class="block mb-2">
											Card Header
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Subtitle or metadata
										</schmancy-typography>
									</div>

									<schmancy-divider outline="default"></schmancy-divider>

									<div class="p-4">
										<schmancy-typography type="body" token="md">
											Main card content goes here. This is separated from the header by a divider.
										</schmancy-typography>
									</div>

									<schmancy-divider></schmancy-divider>

									<div class="p-4 flex gap-2">
										<schmancy-button type="text">Cancel</schmancy-button>
										<schmancy-button type="filled">Confirm</schmancy-button>
									</div>
								</schmancy-card-content>
							</schmancy-card>
						</schmancy-code-preview>

						<!-- Section Dividers -->
						<schmancy-code-preview title="Section Dividers">
							<div class="w-full">
								<schmancy-typography type="headline" token="md" class="mb-4">
									Section 1: Introduction
								</schmancy-typography>
								<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
									This is the introduction section with some content.
								</schmancy-typography>

								<schmancy-divider outline="default" class="my-6"></schmancy-divider>

								<schmancy-typography type="headline" token="md" class="mb-4">
									Section 2: Details
								</schmancy-typography>
								<schmancy-typography type="body" token="md" class="mb-6 text-surface-onVariant">
									More detailed content in the second section.
								</schmancy-typography>

								<schmancy-divider outline="default" class="my-6"></schmancy-divider>

								<schmancy-typography type="headline" token="md" class="mb-4">
									Section 3: Conclusion
								</schmancy-typography>
								<schmancy-typography type="body" token="md" class="text-surface-onVariant">
									Final thoughts and conclusion.
								</schmancy-typography>
							</div>
						</schmancy-code-preview>

						<!-- Menu Separators -->
						<schmancy-code-preview title="Menu Style">
							<schmancy-surface type="surface" elevation="2" class="rounded-lg p-2 w-64">
								<div class="p-2 hover:bg-surface-container rounded cursor-pointer">
									<schmancy-typography type="body" token="md">Profile</schmancy-typography>
								</div>
								<div class="p-2 hover:bg-surface-container rounded cursor-pointer">
									<schmancy-typography type="body" token="md">Settings</schmancy-typography>
								</div>

								<schmancy-divider class="my-1"></schmancy-divider>

								<div class="p-2 hover:bg-surface-container rounded cursor-pointer">
									<schmancy-typography type="body" token="md">Help</schmancy-typography>
								</div>
								<div class="p-2 hover:bg-surface-container rounded cursor-pointer">
									<schmancy-typography type="body" token="md">Feedback</schmancy-typography>
								</div>

								<schmancy-divider class="my-1"></schmancy-divider>

								<div class="p-2 hover:bg-error-container rounded cursor-pointer">
									<schmancy-typography type="body" token="md" class="text-error-default">
										Logout
									</schmancy-typography>
								</div>
							</schmancy-surface>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'layout-divider': LayoutDivider
	}
}

import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-core-surfaces')
export class DemoCoreSurfaces extends $LitElement() {
	@state() private selectedOption: 'option1' | 'option2' | 'option3' | null = null
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Surface
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design 3 surface containers with elevation and color variants for creating visual hierarchy.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/surface'
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">type</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'surface' | 'surfaceDim' | 'surfaceBright' | 'container' |
											'containerLowest' | 'containerLow' | 'containerHigh' | 'containerHighest' |
											'glass' | 'transparent' | 'glassOforim' |
											'primary' | 'primaryContainer' | 'secondary' | 'secondaryContainer' |
											'tertiary' | 'tertiaryContainer' | 'error' | 'errorContainer'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'container'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Surface color variant</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">elevation</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">0 | 1 | 2 | 3 | 4 | 5</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">0</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Shadow depth level</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">rounded</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											'none' | 'top' | 'left' | 'right' | 'bottom' | 'all'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'none'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Corner rounding style</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">fill</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">'all' | 'width' | 'height' | 'auto'</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'auto'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Fill parent container dimensions</schmancy-typography>
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
						<!-- Surface Types -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
								<schmancy-surface type="surface" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Surface
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Default surface color for main content areas
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="surfaceDim" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Surface Dim
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Dimmed surface for reduced emphasis
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="surfaceBright" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Surface Bright
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Bright surface for increased emphasis
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Container Variants -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-2 md:grid-cols-4 gap-3">
								<schmancy-surface type="containerLowest" rounded="all" class="p-4 text-center">
									<schmancy-typography type="label" token="md" class="block">
										Container Lowest
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerLow" rounded="all" class="p-4 text-center">
									<schmancy-typography type="label" token="md" class="block">
										Container Low
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="container" rounded="all" class="p-4 text-center">
									<schmancy-typography type="label" token="md" class="block">
										Container
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerHigh" rounded="all" class="p-4 text-center">
									<schmancy-typography type="label" token="md" class="block">
										Container High
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerHighest" rounded="all" class="p-4 text-center">
									<schmancy-typography type="label" token="md" class="block">
										Container Highest
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Elevation Levels -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
								<schmancy-surface elevation="0" rounded="all" class="p-6 text-center">
									<schmancy-typography type="label" token="lg" class="block mb-2">
										Elevation 0
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">No shadow</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface elevation="1" rounded="all" class="p-6 text-center">
									<schmancy-typography type="label" token="lg" class="block mb-2">
										Elevation 1
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">Lowest shadow</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface elevation="2" rounded="all" class="p-6 text-center">
									<schmancy-typography type="label" token="lg" class="block mb-2">
										Elevation 2
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">Low shadow</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface elevation="3" rounded="all" class="p-6 text-center">
									<schmancy-typography type="label" token="lg" class="block mb-2">
										Elevation 3
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">Medium shadow</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface elevation="4" rounded="all" class="p-6 text-center">
									<schmancy-typography type="label" token="lg" class="block mb-2">
										Elevation 4
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">High shadow</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface elevation="5" rounded="all" class="p-6 text-center">
									<schmancy-typography type="label" token="lg" class="block mb-2">
										Elevation 5
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">Highest shadow</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Rounded Corners -->
						<schmancy-code-preview language="html">
							<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
								<schmancy-surface type="containerLow" rounded="none" class="p-4 text-center">
									<schmancy-typography type="label" token="md">No Rounding</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerLow" rounded="top" class="p-4 text-center">
									<schmancy-typography type="label" token="md">Top Rounded</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerLow" rounded="bottom" class="p-4 text-center">
									<schmancy-typography type="label" token="md">Bottom Rounded</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerLow" rounded="left" class="p-4 text-center">
									<schmancy-typography type="label" token="md">Left Rounded</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerLow" rounded="right" class="p-4 text-center">
									<schmancy-typography type="label" token="md">Right Rounded</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="containerLow" rounded="all" class="p-4 text-center">
									<schmancy-typography type="label" token="md">All Rounded</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Practical Examples -->
						<schmancy-code-preview language="html">
							<!-- Dashboard Widget -->
							<schmancy-surface type="surface" elevation="2" rounded="all" class="p-6 max-w-sm">
								<schmancy-typography type="label" token="sm" class="text-primary-default block mb-2">
									PERFORMANCE
								</schmancy-typography>
								<schmancy-typography type="display" token="sm" class="block mb-1">
									98.5%
								</schmancy-typography>
								<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
									System uptime last 30 days
								</schmancy-typography>
							</schmancy-surface>
						</schmancy-code-preview>

						<schmancy-code-preview language="html">
							<!-- Nested Surfaces -->
							<schmancy-surface type="surface" rounded="all" class="p-6">
								<schmancy-typography type="headline" token="md" class="block mb-4">
									Account Settings
								</schmancy-typography>
								
								<div class="space-y-3">
									<schmancy-surface type="containerLow" rounded="all" class="p-4">
										<schmancy-typography type="label" token="lg" class="block mb-1">
											Profile Information
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Manage your personal details
										</schmancy-typography>
									</schmancy-surface>

									<schmancy-surface type="containerLow" rounded="all" class="p-4">
										<schmancy-typography type="label" token="lg" class="block mb-1">
											Security
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Password and authentication settings
										</schmancy-typography>
									</schmancy-surface>

									<schmancy-surface type="containerLow" rounded="all" class="p-4">
										<schmancy-typography type="label" token="lg" class="block mb-1">
											Notifications
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Configure email and push notifications
										</schmancy-typography>
									</schmancy-surface>
								</div>
							</schmancy-surface>
						</schmancy-code-preview>

						<!-- Fill Options -->
						<schmancy-code-preview language="html">
							<div style="height: 200px; position: relative;">
								<schmancy-surface type="surfaceDim" fill="all" class="p-4">
									<schmancy-typography type="label" token="md">
										This surface fills the entire parent container (fill="all")
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- State-Based Surface Types -->
						<div class="col-span-full mt-8">
							<schmancy-typography type="title" token="lg" class="mb-4 block">
								State-Based Surface Types
							</schmancy-typography>
							<schmancy-typography type="body" token="md" class="text-surface-onVariant mb-4 block">
								Use state-based surface types to indicate selection, active states, or semantic meaning
							</schmancy-typography>
						</div>

						<schmancy-code-preview language="html">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
								<schmancy-surface type="primary" rounded="all" elevation="2" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Primary
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										High emphasis state using primary color. Use for primary actions or selected states.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="primaryContainer" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Primary Container
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Lower emphasis primary state. Ideal for selected list items or active navigation.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="secondary" rounded="all" elevation="2" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Secondary
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Secondary emphasis state using secondary color palette.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="secondaryContainer" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Secondary Container
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Lower emphasis secondary state for subtle highlighting.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="tertiary" rounded="all" elevation="2" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Tertiary
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Tertiary emphasis state for complementary information.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="tertiaryContainer" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Tertiary Container
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Lower emphasis tertiary state for accent highlights.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="error" rounded="all" elevation="2" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Error
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										High emphasis error state for critical issues or warnings.
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="errorContainer" rounded="all" class="p-6">
									<schmancy-typography type="title" token="lg" class="block mb-2">
										Error Container
									</schmancy-typography>
									<schmancy-typography type="body" token="md">
										Lower emphasis error state for validation messages.
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Interactive Selection Example -->
						<schmancy-code-preview language="html">
							<div class="space-y-3">
								<schmancy-typography type="label" token="lg" class="block mb-3">
									Interactive Selection Example
								</schmancy-typography>

								<schmancy-surface
									type=${this.selectedOption === 'option1' ? 'primaryContainer' : 'containerHighest'}
									rounded="all"
									class="p-4 cursor-pointer transition-all"
									@click=${() => { this.selectedOption = 'option1' }}
								>
									<schmancy-typography type="title" token="md" class="block mb-1">
										Option 1
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										${this.selectedOption === 'option1' ? '✓ Selected' : 'Click to select'}
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface
									type=${this.selectedOption === 'option2' ? 'primaryContainer' : 'containerHighest'}
									rounded="all"
									class="p-4 cursor-pointer transition-all"
									@click=${() => { this.selectedOption = 'option2' }}
								>
									<schmancy-typography type="title" token="md" class="block mb-1">
										Option 2
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										${this.selectedOption === 'option2' ? '✓ Selected' : 'Click to select'}
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface
									type=${this.selectedOption === 'option3' ? 'primaryContainer' : 'containerHighest'}
									rounded="all"
									class="p-4 cursor-pointer transition-all"
									@click=${() => { this.selectedOption = 'option3' }}
								>
									<schmancy-typography type="title" token="md" class="block mb-1">
										Option 3
									</schmancy-typography>
									<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
										${this.selectedOption === 'option3' ? '✓ Selected' : 'Click to select'}
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Semantic Meaning Example -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-typography type="label" token="lg" class="block mb-3">
									Semantic Meaning Example
								</schmancy-typography>

								<schmancy-surface type="primaryContainer" rounded="all" class="p-4">
									<schmancy-typography type="label" token="md" class="block mb-1">
										ℹ️ Information
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">
										Use primary container for informational messages or tips
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="secondaryContainer" rounded="all" class="p-4">
									<schmancy-typography type="label" token="md" class="block mb-1">
										✨ Feature Highlight
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">
										Use secondary container to highlight new or special features
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="tertiaryContainer" rounded="all" class="p-4">
									<schmancy-typography type="label" token="md" class="block mb-1">
										💡 Pro Tip
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">
										Use tertiary container for helpful tips or suggestions
									</schmancy-typography>
								</schmancy-surface>

								<schmancy-surface type="errorContainer" rounded="all" class="p-4">
									<schmancy-typography type="label" token="md" class="block mb-1">
										⚠️ Warning
									</schmancy-typography>
									<schmancy-typography type="body" token="sm">
										Use error container for validation errors or warnings
									</schmancy-typography>
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Glass and Transparent Types -->
						<div class="col-span-full mt-8">
							<schmancy-typography type="title" token="lg" class="mb-4 block">
								Glass & Transparent Effects
							</schmancy-typography>
						</div>

						<schmancy-code-preview language="html">
							<!-- Container with background for glass effect demonstration -->
							<div class="relative p-8 rounded-lg" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
								<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
									<schmancy-surface type="glass" elevation="2" rounded="all" class="p-6">
										<schmancy-typography type="title" token="lg" class="block mb-2">
											Glass
										</schmancy-typography>
										<schmancy-typography type="body" token="md">
											Standard glassmorphism effect with backdrop blur and semi-transparent background
										</schmancy-typography>
									</schmancy-surface>

									<schmancy-surface type="glassOforim" elevation="3" rounded="all" class="p-6">
										<schmancy-typography type="title" token="lg" class="block mb-2">
											Glass Oforim
										</schmancy-typography>
										<schmancy-typography type="body" token="md">
											Enhanced glass variant with stronger blur and brightness
										</schmancy-typography>
									</schmancy-surface>

									<schmancy-surface type="transparent" rounded="all" class="p-6">
										<schmancy-typography type="title" token="lg" class="block mb-2">
											Transparent
										</schmancy-typography>
										<schmancy-typography type="body" token="md">
											Fully transparent background without backdrop effects
										</schmancy-typography>
									</schmancy-surface>
								</div>
							</div>
						</schmancy-code-preview>

						<schmancy-code-preview language="html">
							<!-- Layered glass surfaces example -->
							<div class="relative p-8 rounded-lg" style="background: linear-gradient(to right, #ff6b6b, #feca57, #48dbfb, #ff9ff3);">
								<schmancy-surface type="glass" elevation="3" rounded="all" class="p-6 max-w-md">
									<schmancy-typography type="headline" token="md" class="block mb-4">
										Layered Glass Card
									</schmancy-typography>
									<schmancy-surface type="glassOforim" rounded="all" class="p-4 mb-4">
										<schmancy-typography type="label" token="lg" class="block mb-2">
											Nested Glass Surface
										</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Glass effects can be layered for enhanced depth
										</schmancy-typography>
									</schmancy-surface>
									<schmancy-typography type="body" token="md">
										The glass effect adapts to theme colors and works beautifully over any background
									</schmancy-typography>
								</schmancy-surface>
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
		'demo-core-surfaces': DemoCoreSurfaces
	}
}
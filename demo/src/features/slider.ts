import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-slider')
export class DemoSlider extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Slider
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Range input slider for selecting values within a defined range.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/slider'
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">value</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">0</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Current value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">min</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">0</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Minimum value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">max</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">100</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Maximum value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">step</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">1</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Step increment</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">label</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Slider label</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Disable slider</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">showValue</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">true</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Show current value</schmancy-typography>
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
						<!-- Basic Slider -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-slider
									label="Volume"
									value="50"
									min="0"
									max="100"
								></schmancy-slider>
								
								<schmancy-slider
									label="Brightness"
									value="75"
									min="0"
									max="100"
									step="5"
								></schmancy-slider>
							</div>
						</schmancy-code-preview>

						<!-- Custom Range -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-slider
									label="Temperature (°C)"
									value="22"
									min="16"
									max="30"
									step="0.5"
								></schmancy-slider>
								
								<schmancy-slider
									label="Price Range"
									value="150"
									min="0"
									max="500"
									step="10"
								></schmancy-slider>
							</div>
						</schmancy-code-preview>

						<!-- Without Value Display -->
						<schmancy-code-preview language="html">
							<schmancy-slider
								label="Opacity"
								value="0.8"
								min="0"
								max="1"
								step="0.1"
								showValue="false"
							></schmancy-slider>
						</schmancy-code-preview>

						<!-- Disabled State -->
						<schmancy-code-preview language="html">
							<schmancy-slider
								label="Disabled Slider"
								value="30"
								disabled
							></schmancy-slider>
						</schmancy-code-preview>

						<!-- Form Integration -->
						<schmancy-code-preview language="html">
							<schmancy-form
								@submit="${(e) => {
									alert('Settings saved!');
								}}"
								class="space-y-4 max-w-md"
							>
								<schmancy-typography type="headline" token="sm" class="block mb-4">
									Display Settings
								</schmancy-typography>
								
								<schmancy-slider
									name="brightness"
									label="Brightness"
									value="80"
									min="0"
									max="100"
								></schmancy-slider>
								
								<schmancy-slider
									name="contrast"
									label="Contrast"
									value="50"
									min="0"
									max="100"
								></schmancy-slider>
								
								<schmancy-slider
									name="fontSize"
									label="Font Size"
									value="16"
									min="12"
									max="24"
									step="2"
								></schmancy-slider>
								
								<schmancy-button type="submit" variant="filled">
									Save Settings
								</schmancy-button>
							</schmancy-form>
						</schmancy-code-preview>

						<!-- Audio Mixer Example -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-typography type="title" token="md" class="block mb-4">
									Audio Mixer
								</schmancy-typography>
								
								<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
									<schmancy-slider
										label="Bass"
										value="0"
										min="-12"
										max="12"
										step="1"
									></schmancy-slider>
									
									<schmancy-slider
										label="Mid"
										value="0"
										min="-12"
										max="12"
										step="1"
									></schmancy-slider>
									
									<schmancy-slider
										label="Treble"
										value="0"
										min="-12"
										max="12"
										step="1"
									></schmancy-slider>
								</div>
								
								<schmancy-divider></schmancy-divider>
								
								<schmancy-slider
									label="Master Volume"
									value="70"
									min="0"
									max="100"
								></schmancy-slider>
							</div>
						</schmancy-code-preview>

						<!-- Interactive Color Picker -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-typography type="title" token="md" class="block mb-4">
									RGB Color Picker
								</schmancy-typography>
								
								<div class="space-y-3">
									<schmancy-slider
										label="Red"
										value="128"
										min="0"
										max="255"
										class="[--schmancy-sys-color-primary-default:rgb(255,0,0)]"
									></schmancy-slider>
									
									<schmancy-slider
										label="Green"
										value="128"
										min="0"
										max="255"
										class="[--schmancy-sys-color-primary-default:rgb(0,255,0)]"
									></schmancy-slider>
									
									<schmancy-slider
										label="Blue"
										value="128"
										min="0"
										max="255"
										class="[--schmancy-sys-color-primary-default:rgb(0,0,255)]"
									></schmancy-slider>
								</div>
								
								<div class="mt-4 p-4 rounded-lg bg-surface-container">
									<schmancy-typography type="body" token="sm">
										Preview color will be shown here
									</schmancy-typography>
								</div>
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
		'demo-slider': DemoSlider
	}
}
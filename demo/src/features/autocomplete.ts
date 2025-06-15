import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-autocomplete')
export class DemoAutocomplete extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Autocomplete
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Searchable dropdown with single and multi-select support, perfect for large option sets.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/autocomplete'
						import '@mhmo91/schmancy/option'
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
										<schmancy-typography type="body" token="sm">string | string[]</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Selected value(s)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">multi</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Enable multi-selection</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">placeholder</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Placeholder text</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Field label</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">required</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Mark as required</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Disable interactions</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">autocomplete</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Browser autocomplete attribute</schmancy-typography>
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
						<!-- Basic Single Select -->
						<schmancy-code-preview language="html">
							<schmancy-autocomplete
								placeholder="Select a fruit"
								label="Favorite Fruit"
								@change="${(e) => console.log('Selected:', e.detail.value)}"
							>
								<schmancy-option value="apple">Apple</schmancy-option>
								<schmancy-option value="banana">Banana</schmancy-option>
								<schmancy-option value="orange">Orange</schmancy-option>
								<schmancy-option value="grape">Grape</schmancy-option>
								<schmancy-option value="strawberry">Strawberry</schmancy-option>
								<schmancy-option value="watermelon">Watermelon</schmancy-option>
								<schmancy-option value="pineapple">Pineapple</schmancy-option>
								<schmancy-option value="mango">Mango</schmancy-option>
							</schmancy-autocomplete>
						</schmancy-code-preview>

						<!-- Multi Select -->
						<schmancy-code-preview language="html">
							<schmancy-autocomplete
								multi
								placeholder="Select languages"
								label="Programming Languages"
								value="js,python"
								@change="${(e) => console.log('Selected:', e.detail.values)}"
							>
								<schmancy-option value="js">JavaScript</schmancy-option>
								<schmancy-option value="ts">TypeScript</schmancy-option>
								<schmancy-option value="python">Python</schmancy-option>
								<schmancy-option value="java">Java</schmancy-option>
								<schmancy-option value="csharp">C#</schmancy-option>
								<schmancy-option value="go">Go</schmancy-option>
								<schmancy-option value="rust">Rust</schmancy-option>
								<schmancy-option value="swift">Swift</schmancy-option>
							</schmancy-autocomplete>
						</schmancy-code-preview>

						<!-- With Icons -->
						<schmancy-code-preview language="html">
							<schmancy-autocomplete
								placeholder="Select a status"
								label="Project Status"
							>
								<schmancy-option value="active">
									<schmancy-icon slot="start" class="text-success-default">check_circle</schmancy-icon>
									Active
								</schmancy-option>
								<schmancy-option value="pending">
									<schmancy-icon slot="start" class="text-warning-default">schedule</schmancy-icon>
									Pending
								</schmancy-option>
								<schmancy-option value="completed">
									<schmancy-icon slot="start" class="text-primary-default">task_alt</schmancy-icon>
									Completed
								</schmancy-option>
								<schmancy-option value="cancelled">
									<schmancy-icon slot="start" class="text-error-default">cancel</schmancy-icon>
									Cancelled
								</schmancy-option>
							</schmancy-autocomplete>
						</schmancy-code-preview>

						<!-- Country Select with Autofill -->
						<schmancy-code-preview language="html">
							<schmancy-form @submit="${(e) => console.log('Form data:', e.detail)}">
								<div class="space-y-4 max-w-md">
									<schmancy-autocomplete
										name="country"
										autocomplete="country-name"
										required
										placeholder="Select your country"
										label="Country"
									>
										<schmancy-option value="US">United States</schmancy-option>
										<schmancy-option value="CA">Canada</schmancy-option>
										<schmancy-option value="MX">Mexico</schmancy-option>
										<schmancy-option value="GB">United Kingdom</schmancy-option>
										<schmancy-option value="FR">France</schmancy-option>
										<schmancy-option value="DE">Germany</schmancy-option>
										<schmancy-option value="JP">Japan</schmancy-option>
										<schmancy-option value="CN">China</schmancy-option>
										<schmancy-option value="IN">India</schmancy-option>
										<schmancy-option value="BR">Brazil</schmancy-option>
									</schmancy-autocomplete>
									
									<schmancy-button type="submit" variant="filled">
										Submit
									</schmancy-button>
								</div>
							</schmancy-form>
						</schmancy-code-preview>

						<!-- With Descriptions -->
						<schmancy-code-preview language="html">
							<schmancy-autocomplete
								placeholder="Choose a plan"
								label="Subscription Plan"
							>
								<schmancy-option value="free">
									<div>
										<schmancy-typography type="body" token="md">Free</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Basic features for personal use
										</schmancy-typography>
									</div>
								</schmancy-option>
								<schmancy-option value="pro">
									<div>
										<schmancy-typography type="body" token="md">Pro</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Advanced features for professionals
										</schmancy-typography>
									</div>
								</schmancy-option>
								<schmancy-option value="enterprise">
									<div>
										<schmancy-typography type="body" token="md">Enterprise</schmancy-typography>
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">
											Full suite for large organizations
										</schmancy-typography>
									</div>
								</schmancy-option>
							</schmancy-autocomplete>
						</schmancy-code-preview>

						<!-- Disabled State -->
						<schmancy-code-preview language="html">
							<div class="space-y-4">
								<schmancy-autocomplete
									disabled
									value="locked"
									label="Disabled Autocomplete"
								>
									<schmancy-option value="locked">Locked Value</schmancy-option>
									<schmancy-option value="other">Other Option</schmancy-option>
								</schmancy-autocomplete>
								
								<schmancy-autocomplete
									label="With Disabled Options"
									placeholder="Some options are disabled"
								>
									<schmancy-option value="available">Available</schmancy-option>
									<schmancy-option value="sold-out" disabled>Sold Out</schmancy-option>
									<schmancy-option value="coming-soon" disabled>Coming Soon</schmancy-option>
									<schmancy-option value="in-stock">In Stock</schmancy-option>
								</schmancy-autocomplete>
							</div>
						</schmancy-code-preview>

						<!-- Large Dataset Example -->
						<schmancy-code-preview language="html">
							<schmancy-autocomplete
								placeholder="Search timezones..."
								label="Timezone"
								hint="Start typing to filter results"
							>
								<schmancy-option value="UTC">UTC (Coordinated Universal Time)</schmancy-option>
								<schmancy-option value="America/New_York">Eastern Time (US & Canada)</schmancy-option>
								<schmancy-option value="America/Chicago">Central Time (US & Canada)</schmancy-option>
								<schmancy-option value="America/Denver">Mountain Time (US & Canada)</schmancy-option>
								<schmancy-option value="America/Los_Angeles">Pacific Time (US & Canada)</schmancy-option>
								<schmancy-option value="America/Anchorage">Alaska Time</schmancy-option>
								<schmancy-option value="Pacific/Honolulu">Hawaii Time</schmancy-option>
								<schmancy-option value="Europe/London">London</schmancy-option>
								<schmancy-option value="Europe/Paris">Paris</schmancy-option>
								<schmancy-option value="Europe/Berlin">Berlin</schmancy-option>
								<schmancy-option value="Asia/Tokyo">Tokyo</schmancy-option>
								<schmancy-option value="Asia/Shanghai">Shanghai</schmancy-option>
								<schmancy-option value="Asia/Dubai">Dubai</schmancy-option>
								<schmancy-option value="Australia/Sydney">Sydney</schmancy-option>
								<schmancy-option value="Pacific/Auckland">Auckland</schmancy-option>
							</schmancy-autocomplete>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-autocomplete': DemoAutocomplete
	}
}
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-select')
export class DemoSelect extends $LitElement() {
	@state() singleValue = ''
	@state() multiValue: string[] = []
	@state() eventLog: string[] = []

	private logEvent(event: string, value: any) {
		this.eventLog = [`${new Date().toLocaleTimeString()} - ${event}: ${JSON.stringify(value)}`, ...this.eventLog.slice(0, 4)]
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Select
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					A dropdown select component with single and multi-select capabilities, form validation, and keyboard navigation.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/select'
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
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">value</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">string | string[]</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">The selected value(s)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">label</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Label for the select field</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">placeholder</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Placeholder text when no value is selected</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">multi</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Enable multi-select mode</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">required</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Makes the field required</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">disabled</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Disables the select field</schmancy-typography>
									</td>
								</tr>
								<tr class="border-b border-outlineVariant">
									<td class="p-4">
										<schmancy-typography type="body" token="md">hint</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">Helper text shown below the field</schmancy-typography>
									</td>
								</tr>
								<tr>
									<td class="p-4">
										<schmancy-typography type="body" token="md">validateOn</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">'always' | 'touched' | 'dirty' | 'submitted'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="md" class="font-mono">'touched'</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm" class="text-surface-onVariant">When to show validation errors</schmancy-typography>
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
						
						<!-- Basic Select -->
						<schmancy-code-preview>
							<schmancy-select label="Choose a fruit" placeholder="Select a fruit...">
								<schmancy-option value="apple">Apple</schmancy-option>
								<schmancy-option value="banana">Banana</schmancy-option>
								<schmancy-option value="orange">Orange</schmancy-option>
								<schmancy-option value="grape">Grape</schmancy-option>
							</schmancy-select>
						</schmancy-code-preview>

						<!-- Select with Change Event -->
						<schmancy-code-preview>
							<div class="space-y-4">
								<schmancy-select 
									label="Select Rooms" 
									.value=${this.singleValue}
									@change=${(e: CustomEvent) => {
										this.singleValue = e.detail.value
										this.logEvent('change', e.detail.value)
									}}
								>
									<schmancy-option value="1">1 Room</schmancy-option>
									<schmancy-option value="2">2 Rooms</schmancy-option>
									<schmancy-option value="3">3 Rooms</schmancy-option>
									<schmancy-option value="4">4 Rooms</schmancy-option>
									<schmancy-option value="5">5 Rooms</schmancy-option>
								</schmancy-select>
								
								<schmancy-button 
									@click=${() => {
										const newValue = Math.floor(Math.random() * 5 + 1).toString()
										this.singleValue = newValue
										this.logEvent('programmatic', newValue)
									}}
								>
									Change Value Programmatically
								</schmancy-button>

								<schmancy-surface type="surfaceDim" class="p-4 rounded-lg">
									<schmancy-typography type="label" token="md" class="mb-2 block">Event Log</schmancy-typography>
									${this.eventLog.length === 0 
										? html`<schmancy-typography type="body" token="sm" class="text-surface-onVariant">No events yet...</schmancy-typography>`
										: this.eventLog.map(log => html`
											<schmancy-typography type="body" token="sm" class="font-mono block">${log}</schmancy-typography>
										`)
									}
								</schmancy-surface>
							</div>
						</schmancy-code-preview>

						<!-- Multi-Select -->
						<schmancy-code-preview>
							<schmancy-select 
								label="Select colors" 
								multi
								placeholder="Choose multiple colors..."
								.value=${this.multiValue}
								@change=${(e: CustomEvent) => this.multiValue = e.detail.value}
								hint="You can select multiple options"
							>
								<schmancy-option value="red">Red</schmancy-option>
								<schmancy-option value="green">Green</schmancy-option>
								<schmancy-option value="blue">Blue</schmancy-option>
								<schmancy-option value="yellow">Yellow</schmancy-option>
								<schmancy-option value="purple">Purple</schmancy-option>
							</schmancy-select>
						</schmancy-code-preview>

						<!-- Required Field -->
						<schmancy-code-preview>
							<schmancy-select 
								label="Country" 
								required
								placeholder="Select your country..."
								hint="This field is required"
							>
								<schmancy-option value="us">United States</schmancy-option>
								<schmancy-option value="uk">United Kingdom</schmancy-option>
								<schmancy-option value="ca">Canada</schmancy-option>
								<schmancy-option value="au">Australia</schmancy-option>
							</schmancy-select>
						</schmancy-code-preview>

						<!-- Disabled State -->
						<schmancy-code-preview>
							<schmancy-select 
								label="Service Type" 
								disabled
								value="premium"
							>
								<schmancy-option value="basic">Basic</schmancy-option>
								<schmancy-option value="premium">Premium</schmancy-option>
								<schmancy-option value="enterprise">Enterprise</schmancy-option>
							</schmancy-select>
						</schmancy-code-preview>

						<!-- With Pre-selected Value -->
						<schmancy-code-preview>
							<schmancy-select 
								label="Language" 
								value="en"
								hint="Your preferred language"
							>
								<schmancy-option value="en">English</schmancy-option>
								<schmancy-option value="es">Spanish</schmancy-option>
								<schmancy-option value="fr">French</schmancy-option>
								<schmancy-option value="de">German</schmancy-option>
								<schmancy-option value="it">Italian</schmancy-option>
							</schmancy-select>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-select': DemoSelect
	}
}
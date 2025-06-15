import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-radio')
export class DemoRadio extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Radio
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design 3 radio buttons for single-choice selection from multiple options.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/radio-button'
						import '@mhmo91/schmancy/radio-group'
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
										<schmancy-typography type="label" token="md">Component</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Properties</schmancy-typography>
									</th>
									<th class="text-left p-4">
										<schmancy-typography type="label" token="md">Description</schmancy-typography>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-radio-button</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											value: string<br>
											name: string<br>
											checked: boolean<br>
											disabled: boolean
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Individual radio button</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">schmancy-radio-group</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											value: string<br>
											name: string<br>
											label: string<br>
											required: boolean<br>
											options: Array&lt;{label: string, value: string}&gt;
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Radio button group container</schmancy-typography>
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
						<!-- Basic Radio Group -->
						<schmancy-code-preview language="html">
							<schmancy-radio-group
								label="Select your preferred contact method"
								name="contact"
								value="email"
								@change="${(e) => console.log('Selected:', e.detail.value)}"
							>
								<schmancy-radio-button value="email">
									<div slot="label">Email</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="phone">
									<div slot="label">Phone</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="mail">
									<div slot="label">Mail</div>
								</schmancy-radio-button>
							</schmancy-radio-group>
						</schmancy-code-preview>

						<!-- Radio Group with Options Array -->
						<schmancy-code-preview language="html">
							<schmancy-radio-group
								label="Choose a subscription plan"
								name="plan"
								.options="${[
									{ label: 'Basic - $9/month', value: 'basic' },
									{ label: 'Pro - $19/month', value: 'pro' },
									{ label: 'Enterprise - $49/month', value: 'enterprise' }
								]}"
								@change="${(e) => console.log('Plan selected:', e.detail.value)}"
							></schmancy-radio-group>
						</schmancy-code-preview>

						<!-- Radio with Rich Content -->
						<schmancy-code-preview language="html">
							<schmancy-radio-group
								label="Select shipping method"
								name="shipping"
							>
								<schmancy-radio-button value="standard">
									<div slot="label">
										<div class="font-medium">Standard Shipping</div>
										<div class="text-xs text-surface-onVariant">5-7 business days • Free</div>
									</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="express">
									<div slot="label">
										<div class="font-medium">Express Shipping</div>
										<div class="text-xs text-surface-onVariant">2-3 business days • $9.99</div>
									</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="overnight">
									<div slot="label">
										<div class="font-medium">Overnight Shipping</div>
										<div class="text-xs text-surface-onVariant">Next business day • $24.99</div>
									</div>
								</schmancy-radio-button>
							</schmancy-radio-group>
						</schmancy-code-preview>

						<!-- Horizontal Layout -->
						<schmancy-code-preview language="html">
							<schmancy-radio-group
								label="Size"
								name="size"
								class="flex flex-row gap-4"
							>
								<schmancy-radio-button value="s">
									<div slot="label">S</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="m">
									<div slot="label">M</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="l">
									<div slot="label">L</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="xl">
									<div slot="label">XL</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="xxl">
									<div slot="label">XXL</div>
								</schmancy-radio-button>
							</schmancy-radio-group>
						</schmancy-code-preview>

						<!-- Disabled Options -->
						<schmancy-code-preview language="html">
							<schmancy-radio-group
								label="Select a payment method"
								name="payment"
								value="card"
							>
								<schmancy-radio-button value="card">
									<div slot="label">Credit Card</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="paypal">
									<div slot="label">PayPal</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="bitcoin" disabled>
									<div slot="label">Bitcoin (Coming Soon)</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="applepay" disabled>
									<div slot="label">Apple Pay (Coming Soon)</div>
								</schmancy-radio-button>
							</schmancy-radio-group>
						</schmancy-code-preview>

						<!-- Form Integration -->
						<schmancy-code-preview language="html">
							<schmancy-form
								@submit="${(e) => {
									console.log('Form data:', e.detail.data);
									alert('Form submitted! Check console.');
								}}"
								class="space-y-4 max-w-md"
							>
								<schmancy-typography type="headline" token="sm" class="block mb-4">
									User Preferences
								</schmancy-typography>
								
								<schmancy-input
									label="Name"
									name="name"
									placeholder="Enter your name"
									required
								></schmancy-input>
								
								<schmancy-radio-group
									label="Notification Preference"
									name="notifications"
									required
								>
									<schmancy-radio-button value="all">
										<div slot="label">All notifications</div>
									</schmancy-radio-button>
									<schmancy-radio-button value="important">
										<div slot="label">Important only</div>
									</schmancy-radio-button>
									<schmancy-radio-button value="none">
										<div slot="label">No notifications</div>
									</schmancy-radio-button>
								</schmancy-radio-group>
								
								<schmancy-radio-group
									label="Theme"
									name="theme"
									.options="${[
										{ label: 'Light', value: 'light' },
										{ label: 'Dark', value: 'dark' },
										{ label: 'System', value: 'system' }
									]}"
								></schmancy-radio-group>
								
								<schmancy-button type="submit" variant="filled">
									Save Preferences
								</schmancy-button>
							</schmancy-form>
						</schmancy-code-preview>

						<!-- Visual Radio Options -->
						<schmancy-code-preview language="html">
							<schmancy-radio-group
								label="Choose a color theme"
								name="color"
							>
								<schmancy-radio-button value="red">
									<div slot="label" class="flex items-center gap-2">
										<div class="w-4 h-4 rounded-full bg-red-500"></div>
										<span>Red</span>
									</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="green">
									<div slot="label" class="flex items-center gap-2">
										<div class="w-4 h-4 rounded-full bg-green-500"></div>
										<span>Green</span>
									</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="blue">
									<div slot="label" class="flex items-center gap-2">
										<div class="w-4 h-4 rounded-full bg-blue-500"></div>
										<span>Blue</span>
									</div>
								</schmancy-radio-button>
								<schmancy-radio-button value="purple">
									<div slot="label" class="flex items-center gap-2">
										<div class="w-4 h-4 rounded-full bg-purple-500"></div>
										<span>Purple</span>
									</div>
								</schmancy-radio-button>
							</schmancy-radio-group>
						</schmancy-code-preview>
					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-radio': DemoRadio
	}
}
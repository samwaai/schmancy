import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../shared/installation-section'

@customElement('demo-input')
export class DemoInput extends $LitElement() {
	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Input
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					Material Design 3 text input fields for capturing user data with validation support.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/input'
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
											'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'time' | 'datetime-local'
										</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">'text'</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Input type</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Input label</schmancy-typography>
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
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">value</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Input value</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">hint</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">''</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Helper text below input</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline">
									<td class="p-4">
										<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">error</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean | string</schmancy-typography>
									</td>
									<td class="p-4">
										<code class="text-sm">false</code>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Error state or message</schmancy-typography>
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
										<schmancy-typography type="body" token="sm">Disable input</schmancy-typography>
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
							</tbody>
						</table>
					</schmancy-surface>
				</div>

				<!-- Examples -->
				<div>
					<schmancy-typography type="title" token="lg" class="mb-6 block">Examples</schmancy-typography>
					
					<schmancy-grid gap="lg" class="w-full">
						<!-- Basic Text Input -->
						<schmancy-code-preview language="html">
							<div class="space-y-4 max-w-md">
								<schmancy-input 
									label="Username" 
									placeholder="Enter your username"
								></schmancy-input>
								
								<schmancy-input 
									label="Email" 
									type="email" 
									placeholder="user@example.com"
									hint="We'll never share your email"
								></schmancy-input>
								
								<schmancy-input 
									label="Password" 
									type="password" 
									placeholder="Enter password"
									hint="At least 8 characters"
								></schmancy-input>
							</div>
						</schmancy-code-preview>

						<!-- Input States -->
						<schmancy-code-preview language="html">
							<div class="space-y-4 max-w-md">
								<schmancy-input 
									label="Required Field" 
									placeholder="This field is required"
									required
								></schmancy-input>
								
								<schmancy-input 
									label="Error State" 
									placeholder="Invalid input"
									error="Please enter a valid email address"
									value="invalid-email"
								></schmancy-input>
								
								<schmancy-input 
									label="Disabled Input" 
									placeholder="Cannot edit"
									disabled
									value="Disabled value"
								></schmancy-input>
							</div>
						</schmancy-code-preview>

						<!-- Number and Date Inputs -->
						<schmancy-code-preview language="html">
							<div class="space-y-4 max-w-md">
								<schmancy-input 
									label="Quantity" 
									type="number" 
									placeholder="0"
									min="0"
									max="100"
									step="5"
								></schmancy-input>
								
								<schmancy-input 
									label="Birth Date" 
									type="date"
								></schmancy-input>
								
								<schmancy-input 
									label="Appointment Time" 
									type="time"
								></schmancy-input>
								
								<schmancy-input 
									label="Event Date & Time" 
									type="datetime-local"
								></schmancy-input>
							</div>
						</schmancy-code-preview>

						<!-- Input with Icons -->
						<schmancy-code-preview language="html">
							<div class="space-y-4 max-w-md">
								<schmancy-input 
									label="Search" 
									placeholder="Search products..."
								>
									<schmancy-icon slot="leading">search</schmancy-icon>
								</schmancy-input>
								
								<schmancy-input 
									label="Phone Number" 
									type="tel"
									placeholder="+1 (555) 123-4567"
								>
									<schmancy-icon slot="leading">phone</schmancy-icon>
								</schmancy-input>
								
								<schmancy-input 
									label="Website" 
									type="url"
									placeholder="https://example.com"
								>
									<schmancy-icon slot="trailing">open_in_new</schmancy-icon>
								</schmancy-input>
							</div>
						</schmancy-code-preview>

						<!-- Form Example -->
						<schmancy-code-preview language="html">
							<schmancy-form 
								@submit="${(e) => {
									console.log('Form data:', e.detail.data);
									alert('Form submitted! Check console.');
								}}"
								class="space-y-4 max-w-md"
							>
								<schmancy-typography type="headline" token="sm" class="block mb-4">
									Contact Form
								</schmancy-typography>
								
								<schmancy-input 
									label="Full Name" 
									name="name"
									placeholder="John Doe"
									required
								></schmancy-input>
								
								<schmancy-input 
									label="Email Address" 
									name="email"
									type="email"
									placeholder="john@example.com"
									required
									hint="We'll use this to contact you"
								></schmancy-input>
								
								<schmancy-input 
									label="Phone Number" 
									name="phone"
									type="tel"
									placeholder="+1 (555) 123-4567"
									pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
								></schmancy-input>
								
								<schmancy-textarea 
									label="Message" 
									name="message"
									placeholder="Your message..."
									rows="4"
									required
								></schmancy-textarea>
								
								<div class="flex gap-2 mt-6">
									<schmancy-button type="submit" variant="filled">
										Send Message
									</schmancy-button>
									<schmancy-button type="reset" variant="text">
										Clear
									</schmancy-button>
								</div>
							</schmancy-form>
						</schmancy-code-preview>

						<!-- Validation Example -->
						<schmancy-code-preview language="html">
							<div class="space-y-4 max-w-md">
								<schmancy-input 
									label="Username" 
									placeholder="alphanumeric only"
									pattern="[a-zA-Z0-9]+"
									minlength="3"
									maxlength="20"
									hint="3-20 characters, letters and numbers only"
								></schmancy-input>
								
								<schmancy-input 
									label="Age" 
									type="number"
									min="18"
									max="120"
									hint="Must be 18 or older"
								></schmancy-input>
								
								<schmancy-input 
									label="Website URL" 
									type="url"
									pattern="https://.*"
									hint="Must start with https://"
								></schmancy-input>
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
		'demo-input': DemoInput
	}
}
import { $LitElement } from '@mhmo91/schmancy/mixins'
import { html } from 'lit'
import { customElement, state } from 'lit/decorators.js'

@customElement('demo-steps')
export default class DemoSteps extends $LitElement() {
	@state() private currentStep = 1
	@state() private formData = {
		firstName: '',
		lastName: '',
		email: '',
		phone: '',
		address: '',
		city: '',
		zip: '',
		paymentMethod: '',
		cardNumber: '',
		expiryDate: '',
		cvv: ''
	}
	@state() private dynamicCurrentStep = 1
	@state() private lockBackDemo = false

	private handleNext() {
		if (this.currentStep < 4) {
			this.currentStep++
		}
	}

	private handlePrevious() {
		if (this.currentStep > 1) {
			this.currentStep--
		}
	}

	private handleFormInputChange(key: keyof typeof this.formData, value: string) {
		this.formData = {
			...this.formData,
			[key]: value
		}
	}

	private handleDynamicStepChange(step: number) {
		this.dynamicCurrentStep = step
	}

	private toggleLockBack() {
		this.lockBackDemo = !this.lockBackDemo
	}

	render() {
		return html`
			<schmancy-surface class="p-8">
				<!-- Component Title -->
				<schmancy-typography type="display" token="lg" class="mb-4 block">
					Steps
				</schmancy-typography>
				<schmancy-typography type="body" token="lg" class="mb-8 text-surface-onVariant block">
					A wizard-style step component with navigation, completion tracking, and content areas. Perfect for multi-step forms and guided workflows.
				</schmancy-typography>

				<!-- Installation -->
				<installation-section></installation-section>

				<!-- Import -->
				<div class="mb-8">
					<schmancy-typography type="title" token="lg" class="mb-4 block">Import</schmancy-typography>
					<schmancy-code-preview language="javascript">
						import '@mhmo91/schmancy/steps'
					</schmancy-code-preview>
				</div>

				<!-- API Reference -->
				<div class="mb-12">
					<schmancy-typography type="title" token="lg" class="mb-4 block">API Reference</schmancy-typography>
					
					<!-- Steps Container Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">Steps Container</schmancy-typography>
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
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">currentStep</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">1</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">The currently active step (1-based)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">gap</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">4</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Gap between steps. Maps to Tailwind gap classes (gap-0 through gap-24)</schmancy-typography>
									</td>
								</tr>
							</tbody>
						</table>
					</schmancy-surface>

					<!-- Step Component -->
					<schmancy-typography type="title" token="md" class="mb-2 block">Step Component</schmancy-typography>
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
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">position</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">number</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">1</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">The step's position in the sequence (1-based)</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">title</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">The step's title</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">description</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">string</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">''</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Optional description for the step</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">completed</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Explicitly mark step as completed</schmancy-typography>
									</td>
								</tr>
								<tr class="border-t border-outline-variant">
									<td class="p-4">
										<schmancy-typography type="body" token="sm">
											<code class="text-sm bg-primary-container text-primary-onContainer px-2 py-1 rounded">lockBack</code>
										</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">boolean</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">false</schmancy-typography>
									</td>
									<td class="p-4">
										<schmancy-typography type="body" token="sm">Prevent navigation to previous steps</schmancy-typography>
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
						
						<!-- Basic Usage -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Basic Usage</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="1">
									<schmancy-step position="1" title="Account">
										<p>Create your account details</p>
									</schmancy-step>
									<schmancy-step position="2" title="Profile">
										<p>Set up your profile information</p>
									</schmancy-step>
									<schmancy-step position="3" title="Complete">
										<p>Review and finish</p>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

						<!-- With Descriptions -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">With Descriptions</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="2">
									<schmancy-step 
										position="1" 
										title="Personal Information" 
										description="Basic details about yourself"
									>
										<div class="space-y-4">
											<schmancy-input label="First Name" value="John"></schmancy-input>
											<schmancy-input label="Last Name" value="Doe"></schmancy-input>
											<schmancy-input label="Email" value="john@example.com"></schmancy-input>
										</div>
									</schmancy-step>
									<schmancy-step 
										position="2" 
										title="Contact Details" 
										description="How can we reach you?"
									>
										<div class="space-y-4">
											<schmancy-input label="Phone Number"></schmancy-input>
											<schmancy-input label="Address"></schmancy-input>
											<schmancy-input label="City"></schmancy-input>
										</div>
									</schmancy-step>
									<schmancy-step 
										position="3" 
										title="Review" 
										description="Confirm your information"
									>
										<p>Please review your information before submitting.</p>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

						<!-- Custom Gap Spacing -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Custom Gap Spacing</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
								Control the spacing between steps using the <code class="text-sm bg-primary-container text-primary-onContainer px-1 rounded">gap</code> property. Values map to Tailwind gap classes.
							</schmancy-typography>
							<schmancy-code-preview language="html">
								<div class="space-y-8">
									<!-- Compact spacing (gap-2) -->
									<div>
										<schmancy-typography type="label" token="sm" class="mb-2 block">Compact (gap-2)</schmancy-typography>
										<schmancy-steps-container currentStep="2" gap="2">
											<schmancy-step position="1" title="Step 1">
												<p>Compact spacing</p>
											</schmancy-step>
											<schmancy-step position="2" title="Step 2">
												<p>Less vertical space</p>
											</schmancy-step>
											<schmancy-step position="3" title="Step 3">
												<p>Good for compact layouts</p>
											</schmancy-step>
										</schmancy-steps-container>
									</div>
									
									<!-- Default spacing (gap-4) -->
									<div>
										<schmancy-typography type="label" token="sm" class="mb-2 block">Default (gap-4)</schmancy-typography>
										<schmancy-steps-container currentStep="2">
											<schmancy-step position="1" title="Step 1">
												<p>Default spacing</p>
											</schmancy-step>
											<schmancy-step position="2" title="Step 2">
												<p>Balanced vertical space</p>
											</schmancy-step>
											<schmancy-step position="3" title="Step 3">
												<p>Works for most use cases</p>
											</schmancy-step>
										</schmancy-steps-container>
									</div>
									
									<!-- Spacious layout (gap-8) -->
									<div>
										<schmancy-typography type="label" token="sm" class="mb-2 block">Spacious (gap-8)</schmancy-typography>
										<schmancy-steps-container currentStep="2" gap="8">
											<schmancy-step position="1" title="Step 1">
												<p>More breathing room</p>
											</schmancy-step>
											<schmancy-step position="2" title="Step 2">
												<p>Extra vertical space</p>
											</schmancy-step>
											<schmancy-step position="3" title="Step 3">
												<p>Good for content-heavy steps</p>
											</schmancy-step>
										</schmancy-steps-container>
									</div>
								</div>
							</schmancy-code-preview>
						</div>

						<!-- Completed States -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Completed States</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
								Steps can be explicitly marked as completed using the <code class="text-sm bg-primary-container text-primary-onContainer px-1 rounded">completed</code> property.
							</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="3">
									<schmancy-step position="1" title="Step 1" completed>
										<p>This step is marked as completed</p>
									</schmancy-step>
									<schmancy-step position="2" title="Step 2" completed>
										<p>This step is also completed</p>
									</schmancy-step>
									<schmancy-step position="3" title="Step 3">
										<p>Current active step</p>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

						<!-- Lock Back Feature -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Lock Back Navigation</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
								Use <code class="text-sm bg-primary-container text-primary-onContainer px-1 rounded">lockBack</code> to prevent users from navigating to previous steps.
							</schmancy-typography>
							<div class="mb-4">
								<schmancy-button @click=${this.toggleLockBack} variant="outlined" size="sm">
									${this.lockBackDemo ? 'Disable' : 'Enable'} Lock Back
								</schmancy-button>
							</div>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="2">
									<schmancy-step position="1" title="Locked Step" .lockBack="${this.lockBackDemo}">
										<p>You ${this.lockBackDemo ? 'cannot' : 'can'} navigate back to this step</p>
									</schmancy-step>
									<schmancy-step position="2" title="Current Step">
										<p>Current step - try clicking the previous step ${this.lockBackDemo ? '(locked)' : '(unlocked)'}</p>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

						<!-- Dynamic Navigation -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Dynamic Navigation</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
								Control step navigation programmatically by updating the <code class="text-sm bg-primary-container text-primary-onContainer px-1 rounded">currentStep</code> property.
							</schmancy-typography>
							<div class="mb-4 space-x-2">
								<schmancy-button @click=${() => this.handleDynamicStepChange(1)} variant="outlined" size="sm">
									Go to Step 1
								</schmancy-button>
								<schmancy-button @click=${() => this.handleDynamicStepChange(2)} variant="outlined" size="sm">
									Go to Step 2
								</schmancy-button>
								<schmancy-button @click=${() => this.handleDynamicStepChange(3)} variant="outlined" size="sm">
									Go to Step 3
								</schmancy-button>
							</div>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="${this.dynamicCurrentStep}">
									<schmancy-step position="1" title="First Step">
										<p>Welcome to step one! Current step: ${this.dynamicCurrentStep}</p>
									</schmancy-step>
									<schmancy-step position="2" title="Second Step">
										<p>You're in step two! Current step: ${this.dynamicCurrentStep}</p>
									</schmancy-step>
									<schmancy-step position="3" title="Third Step">
										<p>Final step reached! Current step: ${this.dynamicCurrentStep}</p>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

						<!-- Real-world Example: Multi-step Form -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Real-world Example: Checkout Flow</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
								A complete checkout process with form validation and navigation controls.
							</schmancy-typography>
							<div class="mb-4 space-x-2">
								<schmancy-button 
									@click=${this.handlePrevious} 
									variant="outlined" 
									size="sm" 
									?disabled=${this.currentStep === 1}
								>
									Previous
								</schmancy-button>
								<schmancy-button 
									@click=${this.handleNext} 
									variant="filled" 
									size="sm" 
									?disabled=${this.currentStep === 4}
								>
									${this.currentStep === 4 ? 'Complete' : 'Next'}
								</schmancy-button>
							</div>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="${this.currentStep}">
									<schmancy-step 
										position="1" 
										title="Personal Information" 
										description="Tell us about yourself"
									>
										<div class="space-y-4 max-w-md">
											<div class="grid grid-cols-2 gap-4">
												<schmancy-input 
													label="First Name" 
													.value=${this.formData.firstName}
													@input=${(e: any) => this.handleFormInputChange('firstName', e.target.value)}
												></schmancy-input>
												<schmancy-input 
													label="Last Name" 
													.value=${this.formData.lastName}
													@input=${(e: any) => this.handleFormInputChange('lastName', e.target.value)}
												></schmancy-input>
											</div>
											<schmancy-input 
												label="Email Address" 
												type="email" 
												.value=${this.formData.email}
												@input=${(e: any) => this.handleFormInputChange('email', e.target.value)}
											></schmancy-input>
											<schmancy-input 
												label="Phone Number" 
												type="tel" 
												.value=${this.formData.phone}
												@input=${(e: any) => this.handleFormInputChange('phone', e.target.value)}
											></schmancy-input>
										</div>
									</schmancy-step>
									
									<schmancy-step 
										position="2" 
										title="Shipping Address" 
										description="Where should we send your order?"
									>
										<div class="space-y-4 max-w-md">
											<schmancy-input 
												label="Street Address" 
												.value=${this.formData.address}
												@input=${(e: any) => this.handleFormInputChange('address', e.target.value)}
											></schmancy-input>
											<div class="grid grid-cols-2 gap-4">
												<schmancy-input 
													label="City" 
													.value=${this.formData.city}
													@input=${(e: any) => this.handleFormInputChange('city', e.target.value)}
												></schmancy-input>
												<schmancy-input 
													label="ZIP Code" 
													.value=${this.formData.zip}
													@input=${(e: any) => this.handleFormInputChange('zip', e.target.value)}
												></schmancy-input>
											</div>
										</div>
									</schmancy-step>
									
									<schmancy-step 
										position="3" 
										title="Payment Method" 
										description="How would you like to pay?"
									>
										<div class="space-y-4 max-w-md">
											<schmancy-select 
												label="Payment Method" 
												.value=${this.formData.paymentMethod}
												@change=${(e: any) => this.handleFormInputChange('paymentMethod', e.target.value)}
											>
												<schmancy-option value="">Select payment method</schmancy-option>
												<schmancy-option value="credit">Credit Card</schmancy-option>
												<schmancy-option value="debit">Debit Card</schmancy-option>
												<schmancy-option value="paypal">PayPal</schmancy-option>
											</schmancy-select>
											${this.formData.paymentMethod === 'credit' || this.formData.paymentMethod === 'debit' ? html`
												<schmancy-input 
													label="Card Number" 
													.value=${this.formData.cardNumber}
													@input=${(e: any) => this.handleFormInputChange('cardNumber', e.target.value)}
												></schmancy-input>
												<div class="grid grid-cols-2 gap-4">
													<schmancy-input 
														label="MM/YY" 
														placeholder="12/25" 
														.value=${this.formData.expiryDate}
														@input=${(e: any) => this.handleFormInputChange('expiryDate', e.target.value)}
													></schmancy-input>
													<schmancy-input 
														label="CVV" 
														.value=${this.formData.cvv}
														@input=${(e: any) => this.handleFormInputChange('cvv', e.target.value)}
													></schmancy-input>
												</div>
											` : ''}
										</div>
									</schmancy-step>
									
									<schmancy-step 
										position="4" 
										title="Review & Confirm" 
										description="Please review your order"
									>
										<div class="space-y-4">
											<schmancy-typography type="title" token="sm" class="block">Order Summary</schmancy-typography>
											<div class="bg-surface-container p-4 rounded-lg space-y-2">
												<div><strong>Name:</strong> ${this.formData.firstName} ${this.formData.lastName}</div>
												<div><strong>Email:</strong> ${this.formData.email}</div>
												<div><strong>Phone:</strong> ${this.formData.phone}</div>
												<div><strong>Address:</strong> ${this.formData.address}, ${this.formData.city} ${this.formData.zip}</div>
												<div><strong>Payment:</strong> ${this.formData.paymentMethod}</div>
											</div>
											<schmancy-button variant="filled" size="lg">
												Complete Order
											</schmancy-button>
										</div>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

						<!-- Custom Content -->
						<div>
							<schmancy-typography type="title" token="md" class="mb-4 block">Custom Step Content</schmancy-typography>
							<schmancy-typography type="body" token="sm" class="mb-4 text-surface-onVariant block">
								Steps can contain any content including forms, media, and interactive elements.
							</schmancy-typography>
							<schmancy-code-preview language="html">
								<schmancy-steps-container currentStep="2">
									<schmancy-step position="1" title="Welcome" description="Get started">
										<div class="space-y-4">
											<schmancy-typography type="headline" token="sm">
												Welcome to our service!
											</schmancy-typography>
											<p>This wizard will guide you through the setup process.</p>
											<schmancy-button variant="filled" size="sm">
												Let's Begin
											</schmancy-button>
										</div>
									</schmancy-step>
									
									<schmancy-step position="2" title="Upload Files" description="Add your documents">
										<div class="space-y-4">
											<div class="border-2 border-dashed border-outline-variant rounded-lg p-8 text-center">
												<schmancy-typography type="body" token="md" class="text-surface-onVariant">
													Drag and drop files here or click to browse
												</schmancy-typography>
												<schmancy-button variant="outlined" size="sm" class="mt-4">
													Choose Files
												</schmancy-button>
											</div>
										</div>
									</schmancy-step>
									
									<schmancy-step position="3" title="Configure Settings" description="Customize your preferences">
										<div class="space-y-4">
											<div class="grid grid-cols-1 gap-4 max-w-md">
												<schmancy-select label="Theme">
													<schmancy-option value="light">Light</schmancy-option>
													<schmancy-option value="dark">Dark</schmancy-option>
													<schmancy-option value="auto">Auto</schmancy-option>
												</schmancy-select>
												<schmancy-select label="Language">
													<schmancy-option value="en">English</schmancy-option>
													<schmancy-option value="es">Spanish</schmancy-option>
													<schmancy-option value="fr">French</schmancy-option>
												</schmancy-select>
											</div>
										</div>
									</schmancy-step>
								</schmancy-steps-container>
							</schmancy-code-preview>
						</div>

					</schmancy-grid>
				</div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-steps': DemoSteps
	}
}
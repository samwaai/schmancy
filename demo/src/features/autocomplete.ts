import { html, LitElement } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import { $notify } from '@schmancy/notification'
import { $dialog } from '@schmancy/dialog'
import countriesData from '@schmancy/extra/countries/countries.data'
import '@schmancy/autocomplete'
import type { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete/autocomplete'

@customElement('demo-autocomplete')
export class DemoAutocomplete extends LitElement {
	@state() private formData: any = {}
	@state() private selectedCountry = ''
	@state() private selectedTimezone = ''
	@state() private selectedFruit = ''

	private handleSubmit = async (e: CustomEvent) => {
		console.log('handleSubmit called!', e)
		console.error('SUBMIT HANDLER TRIGGERED!')
		e.preventDefault()
		
		// schmancy-form passes FormData in the detail property
		const formData = e.detail as FormData
		const data = Object.fromEntries(formData.entries())
		
		// Add autocomplete values if not already in formData
		if (!data.country) {
			data.country = this.selectedCountry
		}
		
		this.formData = data
		
		// Always log form submission
		console.log('=== FORM SUBMITTED ===')
		console.log('Form data:', data)
		console.log('Selected country:', this.selectedCountry)
		console.log('All form values:', {
			fullname: data.fullname,
			email: data.email,
			phone: data.phone,
			address: data.address,
			postal: data.postal,
			city: data.city,
			country: data.country
		})
		console.log('===================')
		
		// Show form data in dialog with syntax highlighting
		$dialog.component(
			html`
				<div style="padding: 1.5rem;">
					<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
					<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
					<pre style="margin: 0; font-size: 14px;"><code class="language-json" id="form-data-code">${JSON.stringify(data, null, 2)}</code></pre>
					<script>
						// Highlight the code block after it's rendered
						setTimeout(() => {
							const codeBlock = document.getElementById('form-data-code');
							if (codeBlock && window.hljs) {
								window.hljs.highlightElement(codeBlock);
							}
						}, 100);
					</script>
				</div>
			`,
			{
				title: 'Form Data',
				width: '500px',
				confirmText: 'OK',
				cancelText: ''
			}
		)
		
		$notify.success('Form submitted! Browser should remember these values for autofill.')
	}

	render() {
		console.log('DemoAutocomplete rendering...')
		return html`
			<schmancy-surface type="container">
				<div style="padding: 2rem; max-width: 800px; margin: 0 auto;">
					<schmancy-typography type="headline" token="lg" style="margin-bottom: 1rem">
						Autocomplete Component Demo
					</schmancy-typography>
					
					<schmancy-typography type="body" token="lg" style="margin-bottom: 2rem; color: var(--schmancy-sys-color-outline)">
						Test browser autofill integration with the autocomplete component. Fill the form once, navigate away, then return to test autofill.
					</schmancy-typography>

					<!-- Autofill Test Section -->
					<schmancy-card type="outlined" style="margin-bottom: 2rem">
						<schmancy-card-content>
							<schmancy-typography type="title" token="lg" style="margin-bottom: 1rem">
								Browser Autofill Test
							</schmancy-typography>
							
							<schmancy-form @submit=${this.handleSubmit} id="autofill-test-form">
								<schmancy-grid gap="md">
									<!-- Personal Information -->
									<schmancy-typography type="label" token="lg">Personal Information</schmancy-typography>
									
									<sch-input
										name="fullname"
										autocomplete="name"
										required
										placeholder="Full Name"
										label="Full Name"
									></sch-input>
									
									<schmancy-grid cols="1fr 1fr" gap="md">
										<sch-input
											name="email"
											autocomplete="email"
											required
											type="email"
											placeholder="Email Address"
											label="Email"
										></sch-input>
										<sch-input
											name="phone"
											autocomplete="tel"
											required
											type="tel"
											placeholder="Phone Number"
											label="Phone"
										></sch-input>
									</schmancy-grid>
									
									<schmancy-divider></schmancy-divider>
									
									<!-- Address Information -->
									<schmancy-typography type="label" token="lg">Billing Address</schmancy-typography>
									
									<sch-input
										name="address"
										autocomplete="street-address"
										placeholder="Street Address"
										label="Street Address"
									></sch-input>
									
									<schmancy-grid cols="2fr 2fr 3fr" gap="md">
										<sch-input
											name="postal"
											autocomplete="postal-code"
											required
											placeholder="Postal Code"
											label="Postal Code"
										></sch-input>
										
										<sch-input
											name="city"
											autocomplete="address-level2"
											required
											placeholder="City"
											label="City"
										></sch-input>
										
										<schmancy-autocomplete
											name="country"
											autocomplete="country-name"
											required
											placeholder="Select Country"
											label="Country"
											.value=${this.selectedCountry}
											@change=${(e: SchmancyAutocompleteChangeEvent) => {
												this.selectedCountry = e.detail.value as string
												$notify.info(`Country selected: ${e.detail.value}`)
											}}
										>
											${repeat(
												countriesData, // Top 50 countries for demo
												c => c.code,
												c => html`
													<schmancy-option .value=${c.code} .label=${c.name}>
														${c.name}
													</schmancy-option>
												`
											)}
										</schmancy-autocomplete>
									</schmancy-grid>
									
									
									<schmancy-button type="submit" variant="filled" style="margin-top: 1rem">
										Submit Form
									</schmancy-button>
								</schmancy-grid>
							</schmancy-form>
						</schmancy-card-content>
					</schmancy-card>

					<!-- Other Autocomplete Examples -->
					<schmancy-card type="outlined" style="margin-bottom: 2rem">
						<schmancy-card-content>
							<schmancy-typography type="title" token="lg" style="margin-bottom: 1rem">
								Basic Autocomplete Examples
							</schmancy-typography>
							
							<schmancy-grid gap="lg">
								<!-- Single Select -->
								<div>
									<schmancy-typography type="subtitle" token="md" style="margin-bottom: 0.5rem">
										Single Select
									</schmancy-typography>
									<schmancy-autocomplete
										placeholder="Select a fruit"
										label="Favorite Fruit"
										.value=${this.selectedFruit}
										@change=${(e: SchmancyAutocompleteChangeEvent) => {
											this.selectedFruit = e.detail.value as string
											$notify.success(`Selected: ${e.detail.value}`)
										}}
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
								</div>
								
								<!-- Multi Select -->
								<div>
									<schmancy-typography type="subtitle" token="md" style="margin-bottom: 0.5rem">
										Multi Select
									</schmancy-typography>
									<schmancy-autocomplete
										multi
										placeholder="Select languages"
										label="Programming Languages"
										@change=${(e: SchmancyAutocompleteChangeEvent) => {
											console.log('Selected languages:', e.detail.values)
											$notify.info(`Selected: ${e.detail.values?.join(', ') || 'None'}`)
										}}
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
								</div>
								
								<!-- With Description -->
								<div>
									<schmancy-typography type="subtitle" token="md" style="margin-bottom: 0.5rem">
										With Description
									</schmancy-typography>
									<schmancy-autocomplete
										placeholder="Search for a timezone"
										label="Timezone"
										description="Start typing to filter timezones"
										.value=${this.selectedTimezone}
										@change=${(e: SchmancyAutocompleteChangeEvent) => {
											this.selectedTimezone = e.detail.value as string
										}}
									>
										<schmancy-option value="UTC">UTC (Coordinated Universal Time)</schmancy-option>
										<schmancy-option value="America/New_York">Eastern Time (US & Canada)</schmancy-option>
										<schmancy-option value="America/Chicago">Central Time (US & Canada)</schmancy-option>
										<schmancy-option value="America/Denver">Mountain Time (US & Canada)</schmancy-option>
										<schmancy-option value="America/Los_Angeles">Pacific Time (US & Canada)</schmancy-option>
										<schmancy-option value="Europe/London">London</schmancy-option>
										<schmancy-option value="Europe/Paris">Paris</schmancy-option>
										<schmancy-option value="Asia/Tokyo">Tokyo</schmancy-option>
										<schmancy-option value="Australia/Sydney">Sydney</schmancy-option>
									</schmancy-autocomplete>
								</div>
							</schmancy-grid>
						</schmancy-card-content>
					</schmancy-card>

					<!-- Debug Information -->
					${Object.keys(this.formData).length > 0 ? html`
						<schmancy-card type="filled">
							<schmancy-card-content>
								<schmancy-typography type="title" token="md" style="margin-bottom: 0.5rem">
									Last Submitted Form Data
								</schmancy-typography>
								<pre style="background: var(--schmancy-sys-color-surface-container); padding: 1rem; border-radius: 4px; overflow-x: auto;">
${JSON.stringify(this.formData, null, 2)}</pre>
							</schmancy-card-content>
						</schmancy-card>
					` : ''}
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
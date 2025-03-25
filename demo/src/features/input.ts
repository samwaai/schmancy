import { $LitElement } from '@mixins/index'
import { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete'
import { SchmancyChipsChangeEvent } from '@schmancy/chips'
import dayjs from 'dayjs'
import { PropertyValueMap, css, html } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'

@customElement('demo-input')
export class DemoInput extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@state() country?: string
	@state() chip = ''

	@state() value = 'email'
	protected firstUpdated(_changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>): void {
		super.firstUpdated(_changedProperties)
		this.country = 'DE'
	}

	connectedCallback(): void {
		super.connectedCallback()
		setTimeout(() => {
			this.chip = 'chip1'
			this.value = 'phone'
		}, 1000)
	}
	render() {
		const options = [
			{
				value: 'option1',
				label: 'Option 1',
			},
			{
				value: 'option2',
				label: 'Option 2',
			},
			{
				value: 'option3',
				label: 'Option 3',
			},
		]
		const v = undefined
		return html`
			<schmancy-surface type="container" fill="all" rounded="left">
				<schmancy-scroll hide>
					<schmancy-chips wrap="nowrap">
						${repeat(
							Array.from({ length: 14 }, (_, i) => {
								const date = dayjs().add(i, 'days')
								const day = date.format('ddd DD MMM')
								return day
							}),
							a => a,
							(a, i) => html`
								<schmancy-chip
									.value=${a}
									.selected=${i === 0}
									label=${a}
									@click=${() => {
										// Update selected date
										const date = dayjs().add(i, 'days')
									}}
								>
									${a}
								</schmancy-chip>
							`,
						)}
					</schmancy-chips>
				</schmancy-scroll>
				<schmancy-surface type="container" class="p-2 mb-4">
					<schmancy-typography type="headline">V2 Input Form</schmancy-typography>
					<sch-form
						@submit=${(e: CustomEvent) => {
							console.log('V2 Form data:', e.detail.data)
							alert('V2 Form submitted! Check console for details.')
						}}
						class="flex flex-col gap-2"
					>
						<sch-input
							label="Email Address"
							name="email"
							type="email"
							placeholder="example@domain.com"
							required
							hint="We'll never share your email"
						></sch-input>

						<sch-input
							label="Password"
							name="password"
							type="text"
							placeholder="Enter password"
							required
							hint="At least 8 characters"
							minlength="8"
						></sch-input>

						<sch-input label="Birth Date" name="birthdate" type="date" required></sch-input>

						<schmancy-select required label="Preferred Contact Method" name="contactMethod">
							${repeat(
								['email', 'phone', 'mail'],
								option => option,
								option => html`<schmancy-option value="${option}">${option}</schmancy-option>`,
							)}
						</schmancy-select>

						<schmancy-textarea
							label="Additional Comments"
							name="comments"
							placeholder="Share your thoughts..."
							rows="3"
						></schmancy-textarea>

						<div class="flex items-center mb-2">
							<schmancy-checkbox name="subscribe">Subscribe to newsletter</schmancy-checkbox>
						</div>

						<schmancy-button variant="filled" type="submit">Submit V2 Form</schmancy-button>
					</sch-form>
				</schmancy-surface>
				<schmancy-surface type="surface" rounded="left">
					<schmancy-form
						@submit=${(e: CustomEvent) => {
							console.log('Form submitted:', e.detail.data)
							alert('Form submitted successfully! Check console for details.')
						}}
						class="p-2 flex flex-col gap-2"
					>
						<schmancy-typography type="headline">Form Example with Validation </schmancy-typography>
						<schmancy-input
							label="Full Name"
							name="name"
							placeholder="Enter your full name"
							required
							hint="Please provide your full legal name"
						></schmancy-input>

						<schmancy-select-timezones required></schmancy-select-timezones>

						<schmancy-button variant="filled" type="submit">Submit</schmancy-button>
					</schmancy-form>

					<form>
						<schmancy-select-countries
							.value=${this.country}
							@change=${(e: CustomEvent<SchmancyAutocompleteChangeEvent>) => {
								console.log('e.detail', e.detail)
							}}
						></schmancy-select-countries>
					</form>
				</schmancy-surface>

				<schmancy-grid class="p-4 w-full" flow="row" justify="start" gap="md">
					<schmancy-checkbox> checkbox </schmancy-checkbox>
					<!-- Single-select example -->
					<schmancy-select .value=${v ?? ''} label="Choose an option">
						${repeat(
							options,
							o => o.value,
							option =>
								html` <schmancy-option value=${option.value} label=${option.label}> ${option.label} </schmancy-option>`,
						)}
					</schmancy-select>
					<!-- date range -->
					<!-- input number -->
					<schmancy-input step="0.01" type="number" label="Input number" placeholder="placeholder"></schmancy-input>

					<schmancy-date-range
						type="datetime-local"
						.dateFrom=${{
							label: 'Check-in',
							value: dayjs().startOf('day').format('YYYY-MM-DDTHH:mm'),
						}}
						.dateTo=${{
							label: 'Check-out',
							value: dayjs().endOf('D').format('YYYY-MM-DDTHH:mm'),
						}}
						@change=${(e: CustomEvent) => {
							console.log('e.detail', e.detail)
						}}
					></schmancy-date-range>

					<schmancy-grid justify="end">
						<schmancy-menu>
							<schmancy-menu-item>Item 1 with very long text </schmancy-menu-item>
							<schmancy-menu-item>Item 2</schmancy-menu-item>
							<schmancy-menu-item>Item 3</schmancy-menu-item>
						</schmancy-menu>
					</schmancy-grid>

					<schmancy-chips
						.values=${['chip1']}
						multi
						@change=${(e: CustomEvent<SchmancyChipsChangeEvent>) => {
							console.log('e.detail', e.detail)
						}}
					>
						<schmancy-chip readOnly selected label="Chip 1" value="chip1"></schmancy-chip>
						<schmancy-chip label="Chip 2" value="chip2"></schmancy-chip>
						<schmancy-chip label="Chip 3" value="chip3"></schmancy-chip>
					</schmancy-chips>

					<!-- single -->
					<schmancy-button
						@click=${() => {
							this.chip = ''
						}}
						>reset Chips</schmancy-button
					>
					<schmancy-chips
						.value=${this.chip}
						@change=${(e: CustomEvent<SchmancyChipsChangeEvent>) => {
							console.log('e.detail', e.detail)
						}}
					>
						${repeat(
							['chip1', 'chip2', 'chip3'],
							c => c,
							c => html` <schmancy-chip label=${c} value=${c}> ${c} </schmancy-chip>`,
						)}
					</schmancy-chips>
					<schmancy-textarea label="Textarea" placeholder="placeholder"></schmancy-textarea>

					<schmancy-autocomplete
						multi
						placeholder="Search for options"
						label="Select options"
						value="option1,option2"
						@change="${e => console.log('Selected values:', e.detail.value)}"
					>
						<schmancy-option value="option1" label="Option 1">
							Option 1
							<schmancy-icon-button
								@click=${e => {
									e.stopPropagation()
									e.preventDefault()
									console.log('edit')
								}}
								slot="support"
								>edit</schmancy-icon-button
							>
						</schmancy-option>
						<schmancy-option value="option2" label="Option 2">Option 2</schmancy-option>
						<schmancy-option value="option3" label="Option 3">Option 3</schmancy-option>
						<schmancy-option value="option4" label="Option 4">Option 4</schmancy-option>
					</schmancy-autocomplete>
					<schmancy-input
						class="w-full"
						type="date"
						label="Input"
						placeholder="placeholder"
						@change=${(e: Event) => {
							console.log('change', e)
						}}
					></schmancy-input>
					<!-- Single-select example -->
					<schmancy-select label="Choose an option" placeholder="Select an option">
						<schmancy-option value="option1" label="Option 1"> Option 1 </schmancy-option>
						<schmancy-option value="option2" label="Option 2"> Option 2 </schmancy-option>
						<schmancy-option value="option3" label="Option 3"> Option 3 </schmancy-option>
					</schmancy-select>

					<br />

					<!-- Multi-select example -->
					<schmancy-select .value=${['option2']} label="Choose multiple options" placeholder="Select options" multi>
						<schmancy-option value="option1" label="Option 1"> Option 1</schmancy-option>
						<schmancy-option value="option2" label="Option 2"> Option 2</schmancy-option>
						<schmancy-option value="option3" label="Option 3">Option 3</schmancy-option>
						<schmancy-option value="option4" label="Option 4">Option 4</schmancy-option>
					</schmancy-select>
					<schmancy-form
						@submit=${() => {
							// e.preventDefault()
							console.log('submit')
						}}
					>
						<schmancy-payment-card-form
							@change=${e => {
								console.log(e.detail)
							}}
						></schmancy-payment-card-form>
						<!-- <schmancy-button type="submit">Submit</schmancy-button> -->
					</schmancy-form>
					<schmancy-input
						.error=${true}
						hint="another day another moment"
						label="Input"
						placeholder="placeholder"
					></schmancy-input>
					<schmancy-input label="disabled Input" placeholder="placeholder" disabled></schmancy-input>

					<schmancy-autocomplete
						@change=${(e: SchmancyAutocompleteChangeEvent) => {
							console.log('e.detail', e.detail)
						}}
						@reset=${() => {}}
						label="Status"
						value="All"
					>
						${[
							'All',
							'New',
							'Paid CC',
							'Approved',
							'Modified',
							'Checked-In',
							'Checked-Out',
							'No show',
							'Cancelled',
							'Invalid CC',
							'Debtor',
							'Problematic',
							'Prepaid',
							'Paid',
							'Paid bank',
							'Completed',
						].map(o => html` <schmancy-option .value="${o}" .label=${o}> ${o}</schmancy-option>`)}
					</schmancy-autocomplete>
				</schmancy-grid>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-input': DemoInput
	}
}

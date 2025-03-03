import { $LitElement } from '@mixins/index'
import { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete'
import { css, html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import countriesData from './countries.data'
import SchmancyAutocomplete from '@schmancy/autocomplete/autocomplete'

@customElement('schmancy-select-countries')
export class SchmancyCountriesSelect extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	// Form association setup
	static formAssociated = true
	private internals?: ElementInternals

	@property({
		type: String,
		reflect: true,
		attribute: 'value',
	})
	value?: string

	@state() chip = ''
	@property({ type: Boolean, reflect: true }) required = false
	@property({ type: String }) label = 'Country'
	@property({ type: String }) hint = 'Please select a country'
	@property({ type: String }) placeholder = 'Select a country'
	@property({ type: String }) name = ''

	@query('schmancy-autocomplete') private autocomplete!: SchmancyAutocomplete

	constructor() {
		super()
		// Initialize ElementInternals for form association
		try {
			this.internals = this.attachInternals()
		} catch (e) {
			console.warn('FormAssociated elements not supported in this browser', e)
		}
	}

	get form() {
		return this.internals?.form
	}

	// Form validation methods
	public checkValidity(): boolean {
		if (this.required && (!this.value || this.value === '')) {
			this.internals?.setValidity({ valueMissing: true }, 'Please select a country')
			return false
		}

		this.internals?.setValidity({})
		return true
	}

	public reportValidity(): boolean {
		const valid = this.checkValidity()

		if (!valid && this.autocomplete) {
			// Delegate to autocomplete for visual validation
			this.autocomplete.reportValidity()
		}

		return valid
	}

	// Update form value when component's value changes
	updated(changedProps: Map<string, unknown>) {
		if (changedProps.has('value')) {
			this.internals?.setFormValue(this.value || '')
		}
	}

	private handleChange(e: SchmancyAutocompleteChangeEvent) {
		this.value = e.detail.value as string
		this.dispatchEvent(new Event('change', { bubbles: true }))
		this.checkValidity()
	}

	render() {
		return html`
			<schmancy-autocomplete
				.placeholder=${this.placeholder}
				.hint=${this.hint}
				.required=${this.required}
				.label=${this.label}
				.value=${this.value ?? ''}
				.name=${this.name}
				@change=${this.handleChange}
			>
				${repeat(
					countriesData ?? [],
					c => c.code,
					country => html` <schmancy-option value=${country.code ?? ''}> ${country.name} </schmancy-option> `,
				)}
			</schmancy-autocomplete>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-select-countries': SchmancyCountriesSelect
	}
}

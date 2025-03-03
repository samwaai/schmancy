import { $LitElement } from '@mixins/index'
import { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import countriesData from './countries.data'

@customElement('schmancy-select-countries')
export class SchmancyCountriesSelect extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	@property({
		type: String,
		reflect: true,
		attribute: 'value',
	})
	value?: string
	@state() chip = ''

	@property({ type: Boolean }) required = false

	render() {
		return html`<schmancy-autocomplete
			.required=${this.required}
			@change=${(e: SchmancyAutocompleteChangeEvent) => {
				this.value = e.detail.value as string
			}}
			label="Country"
			.value=${this.value ?? ''}
		>
			${repeat(
				countriesData ?? [],
				c => c.code,
				category => html` <schmancy-option value=${category.code ?? 0}> ${category.name} </schmancy-option>`,
			)}
		</schmancy-autocomplete> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-select-countries': SchmancyCountriesSelect
	}
}

import { $LitElement } from '@mixins/index'
import { SchmancyAutocompleteChangeEvent } from '@schmancy/autocomplete'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { repeat } from 'lit/directives/repeat.js'
import timezonesData from './timezones.data'

@customElement('schmancy-select-timezones')
export class SchmancyTimezonesSelect extends $LitElement(css`
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
			label="Timezone"
			.value=${this.value ?? ''}
		>
			${repeat(
				timezonesData ?? [],
				tz => tz.tzCode,
				timezone => html` <schmancy-option value=${timezone.tzCode ?? ''}> ${timezone.name} </schmancy-option>`,
			)}
		</schmancy-autocomplete> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-select-timezones': SchmancyTimezonesSelect
	}
}

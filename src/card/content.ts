import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * @element schmancy-card-content
 * @slot default - The main content of the card
 */
@customElement('schmancy-card-content')
export default class SchmancyCardContent extends TailwindElement(css`
	:host {
		display: block;
		padding: 1rem;
	}
`) {
	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-content': SchmancyCardContent
	}
}

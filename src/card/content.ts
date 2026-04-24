import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Content region of a schmancy-card — holds the card's headline, supporting text, and inline controls.
 *
 * @element schmancy-card-content
 * @summary Always nested inside schmancy-card. The padded content block between the media and action rows.
 * @example
 * <schmancy-card-content>
 *   <h3>Card title</h3>
 *   <p>Supporting text that describes the card's subject.</p>
 * </schmancy-card-content>
 * @platform div - Styled `<div>` with padding. Degrades to a plain div if the tag never registers.
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

import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Action row of a schmancy-card — holds the card's buttons / links (typically aligned bottom-right).
 *
 * @element schmancy-card-action
 * @summary Always nested inside schmancy-card. Holds the primary + secondary CTAs for the card.
 * @example
 * <schmancy-card-action>
 *   <schmancy-button variant="text">Cancel</schmancy-button>
 *   <schmancy-button variant="filled">Save</schmancy-button>
 * </schmancy-card-action>
 * @platform div - Styled flex container. Degrades to a plain div if the tag never registers.
 * @slot - The content of the action
 */
@customElement('schmancy-card-action')
export default class SchmancyCardAction extends TailwindElement(css`
	:host {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		align-items: center;
		justify-content: flex-end;
	}
`) {
	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-action': SchmancyCardAction
	}
}

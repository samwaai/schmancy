import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * @element schmancy-card-action
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

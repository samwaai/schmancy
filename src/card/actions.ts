import { TailwindElement } from '@mhmo91/lit-mixins/src'

import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * @element schmancy-card-action
 * @slot - The content of the action
 */
@customElement('schmancy-card-action')
export default class SchmancyCardMedia extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	protected render(): unknown {
		return html` <section class="pb-4 px-4"><slot> </slot></section> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card-action': SchmancyCardMedia
	}
}

import TailwindElement from '@mhmo91/lit-mixins/src/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-divider')
export default class SchmancyDivider extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	protected render(): unknown {
		return html`<div class="border-t border-outline"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-divider': SchmancyDivider
	}
}

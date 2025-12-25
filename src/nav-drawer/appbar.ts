import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * @element schmancy-nav-drawer-appbar
 * @slot - The default slot
 */
@customElement('schmancy-nav-drawer-appbar')
export class SchmancyDrawerAppbar extends TailwindElement(css`
	:host {
		display: block;
		width: 100%;
		min-width: 0;
	}
`) {
	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar
	}
}

import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

/**
 * Top app bar region inside schmancy-nav-drawer — the horizontal strip above the content area that typically holds the page title, hamburger trigger, and contextual actions.
 *
 * @element schmancy-nav-drawer-appbar
 * @summary Always nested inside schmancy-nav-drawer. Holds the page-level title + top-right actions. On mobile, the drawer's hamburger button renders inside this region.
 * @example
 * <schmancy-nav-drawer-appbar>
 *   <schmancy-typography type="title" token="lg">Dashboard</schmancy-typography>
 *   <schmancy-icon-button slot="trailing" aria-label="Notifications">
 *     <schmancy-icon>notifications</schmancy-icon>
 *   </schmancy-icon-button>
 * </schmancy-nav-drawer-appbar>
 * @platform header - Styled horizontal bar. Degrades to a plain header element if the tag never registers.
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

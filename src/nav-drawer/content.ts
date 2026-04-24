import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'

/**
 * Main content region inside schmancy-nav-drawer — typically hosts the router outlet or the page's body content.
 *
 * @element schmancy-nav-drawer-content
 * @summary Always nested inside schmancy-nav-drawer. Scrollable by default; propagates scroll events up so the drawer can collapse app-bar on scroll.
 * @example
 * <schmancy-nav-drawer-content>
 *   <schmancy-area name="main"></schmancy-area>
 * </schmancy-nav-drawer-content>
 * @platform main scroll - Scrollable `<main>`. Degrades to a plain scrollable div if the tag never registers.
 */
@customElement('schmancy-nav-drawer-content')
export class SchmancyNavigationDrawerContent extends $LitElement(css`
	:host {
		display: block;
		position: relative;
		inset: 0;
		overflow-y: auto;
	}
`) {
	connectedCallback(): void {
		super.connectedCallback()
		fromEvent(this, 'scroll')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				this.parentElement.dispatchEvent(new CustomEvent('scroll', { detail: e, bubbles: true, composed: true }))
			})
	}
	render() {
		return html` <slot></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-content': SchmancyNavigationDrawerContent
	}
}

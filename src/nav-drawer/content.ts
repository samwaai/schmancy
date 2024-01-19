import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { fromEvent, takeUntil, throttleTime } from 'rxjs'

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

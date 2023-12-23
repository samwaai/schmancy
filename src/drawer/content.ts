import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-nav-drawer-content')
export class SchmancyNavigationDrawerContent extends $LitElement(css`
	:host {
		display: block;
		position: relative;
		inset: 0;
		overflow-y: auto;
	}
`) {
	render() {
		return html` <slot></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-content': SchmancyNavigationDrawerContent
	}
}

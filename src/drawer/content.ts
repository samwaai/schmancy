import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-drawer-content')
export class SchmancyDrawerContent extends $LitElement(css`
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
		'schmancy-drawer-content': SchmancyDrawerContent
	}
}

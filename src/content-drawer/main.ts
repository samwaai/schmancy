import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-content-drawer-main')
export class SchmancyContentDrawerMain extends $LitElement(css`
	:host {
		display: flow;
		overflow-y: auto;
	}
`) {
	render() {
		return html` <slot></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer-main': SchmancyContentDrawerMain
	}
}

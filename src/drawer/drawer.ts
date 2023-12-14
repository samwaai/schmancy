import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-drawer')
export class SchmancyDrawer extends $LitElement(css`
	:host {
		display: block;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}
`) {
	protected render() {
		return html`
			<schmancy-grid cols="auto 1fr" rows="1fr" flow="col" justify="stretch" align="stretch" class="flex h-[100%]">
				<slot></slot>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-drawer': SchmancyDrawer
	}
}

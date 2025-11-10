import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { $dialog } from '../dialog/dialog-service'

@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends $LitElement(css`
	:host {
		display: block;
	}
`) {

	protected render(): unknown {
		return html`
			<schmancy-list-item @click=${() => $dialog.dismiss()}>
				<slot></slot>
			</schmancy-list-item>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-menu-item': SchmancyMenuItem
	}
}

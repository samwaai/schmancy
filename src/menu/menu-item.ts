import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { $dialog } from '../dialog/dialog-service'

@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends SchmancyElement {
	static styles = [css`
	:host {
		display: block;
	}
`]


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

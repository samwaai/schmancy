import { SchmancyElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends SchmancyElement {
	static styles = [css`
	:host {
		display: block;
	}
`]

	private dismissParentMenu = (): void => {
		// Bubbling 'close' is the protocol the overlay `show()` watches; the
		// enclosing `<schmancy-menu>` opens the menu via `show()` and this
		// completes the subscription, so the overlay tears itself down.
		this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
	}

	protected render(): unknown {
		return html`
			<schmancy-list-item @click=${this.dismissParentMenu}>
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

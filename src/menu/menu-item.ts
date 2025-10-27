import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'

@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends $LitElement(css`
	:host {
		display: block;
	}
`) {
	connectedCallback(): void {
		super.connectedCallback()
		fromEvent(this, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				e.stopPropagation()
				// Auto-dismiss dialog when menu item is clicked
			})
	}
	protected render(): unknown {
		return html`
			<schmancy-list-item>
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

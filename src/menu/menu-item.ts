import { $LitElement } from '@mhmo91/lit-mixins/src'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { fromEvent, takeUntil } from 'rxjs'

@customElement('schmancy-menu-item')
export default class SchmancyMenuItem extends $LitElement() {
	connectedCallback(): void {
		super.connectedCallback()
		fromEvent(this, 'click')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(e => {
				e.stopPropagation()
				this.dispatchEvent(
					new CustomEvent('schmancy-menu-item-click', {
						bubbles: true,
						composed: true,
					}),
				)
			})
	}
	protected render(): unknown {
		return html`
			<schmancy-list-item variant="containerHighest">
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

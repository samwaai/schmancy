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

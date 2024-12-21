import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-table')
export default class SchmancyTable extends TailwindElement() {
	protected render(): unknown {
		return html`
			<slot name="header"></slot>
			<slot></slot>
			<slot name="footer"></slot>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-table': SchmancyTable
	}
}

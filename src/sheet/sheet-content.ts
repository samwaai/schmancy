import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('schmancy-sheet-content')
export default class SchmancySheetContent extends TailwindElement() {
	render() {
		return html`
			<div tabindex="0">
				<slot></slot>
			</div>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-sheet-content': SchmancySheetContent
	}
}

import { $LitElement } from '@mhmo91/lit-mixins/src'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@schmancy/index'
@customElement('schmancy-demo')
export default class SchmancyDemo extends $LitElement() {
	render() {
		return html`
			<schmancy-grid flow="row" cols="3">
				<div>Row 1, Column 1</div>
				<div>Row 1, Column 2</div>
				<div>Row 1, Column 3</div>
				<div>Row 2, Column 1</div>
				<div>Row 2, Column 2</div>
				<div>Row 2, Column 3</div>
				<div>Row 3, Column 1</div>
				<div>Row 3, Column 2</div>
				<div>Row 3, Column 3</div>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-demo': SchmancyDemo
	}
}

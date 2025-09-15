import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import './chips/chip-demos'

@customElement('demo-chips')
export class DemoChips extends $LitElement() {
	render() {
		return html`<demo-chip-demos></demo-chip-demos>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'demo-chips': DemoChips
	}
}
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-tab')
export default class SchmancyTab extends TailwindElement() {
	@property({ type: String, reflect: true }) label
	@property({ type: Boolean, reflect: true }) active!: boolean

	protected render(): unknown {
		return html` <slot .hidden=${!this.active}></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab': SchmancyTab
	}
}

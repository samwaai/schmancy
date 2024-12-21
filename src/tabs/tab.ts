import { consume } from '@lit/context'
import { TailwindElement } from '@mixins/tailwind'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyTabsModeContext } from './context'

@customElement('schmancy-tab')
export default class SchmancyTab extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@property({ type: String, reflect: true }) label
	@property({ type: String, reflect: true }) value
	@property({ type: Boolean, reflect: true }) active!: boolean

	@consume({ context: SchmancyTabsModeContext, subscribe: true })
	@state()
	mode
	protected render(): unknown {
		return html` <slot .hidden=${this.mode === 'tabs' ? !this.active : false}></slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab': SchmancyTab
	}
}

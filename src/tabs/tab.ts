import { consume } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { SchmancyTabsModeContext } from './context'

@customElement('schmancy-tab')
export default class SchmancyTab extends TailwindElement() {
	@property({ type: String, reflect: true }) label
	@property({ type: String, reflect: true }) value
	@property({ type: Boolean, reflect: true }) active!: boolean

	@consume({ context: SchmancyTabsModeContext, subscribe: true })
	@state()
	mode

	protected updated(changedProperties: Map<PropertyKey, unknown>) {
		if (changedProperties.has('active') && this.active) {
			// Trigger resize for virtualizers to recalculate when tab becomes visible
			requestAnimationFrame(() => {
				window.dispatchEvent(new Event('resize'))
			})
		}
	}

	protected render(): unknown {
		// Don't render content until tab is active (virtualizers need actual layout, not hidden)
		if (this.mode === 'tabs' && !this.active) {
			return html``
		}
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-tab': SchmancyTab
	}
}

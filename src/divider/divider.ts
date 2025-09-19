// divider.ts
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'

@customElement('schmancy-divider')
export default class SchmancyDivider extends $LitElement() {
	@property({ type: String }) outline: 'default' | 'variant' = 'variant'
	@property({ reflect: true, type: String }) orientation: 'horizontal' | 'vertical' = 'horizontal'
	@property({ type: String }) grow: 'start' | 'end' | 'both' = 'start'

	protected render() {
		const classes = {
			divider: true,
			horizontal: this.orientation === 'horizontal',
			vertical: this.orientation === 'vertical',
			'border-outlineVariant': this.outline === 'variant',
			'border-outline': this.outline === 'default',
			[`grow-${this.grow}`]: true, // e.g., grow-start, grow-end, grow-both
		}
		return html`<div class="${classMap(classes)}"></div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-divider': SchmancyDivider
	}
}

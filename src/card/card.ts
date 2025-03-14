import { TailwindElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement() {
	@property() type: 'elevated' | 'filled' | 'outlined' = 'elevated'
	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0
	protected render(): unknown {
		const classes = {
			'rounded-md': true,
			'shadow-xs': this.elevation === 1,
			'shadow-sm': this.elevation === 2,
			'shadow-md': this.elevation === 3,
			'shadow-lg': this.elevation === 4,
			'shadow-5': this.elevation === 5,
			'hover:shadow-xs': ['outlined', 'filled'].includes(this.type),
			'bg-surface-low shadow-xs hover:shadow-sm': this.type === 'elevated',
			'bg-surface-highest': this.type === 'filled',
			'bg-surface-default border border-solid border-1 border-outlineVariant': this.type === 'outlined',
		}
		return html`<div class="${this.classMap(classes)}">
			<slot> </slot>
		</div>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-card': SchmancyCard
	}
}

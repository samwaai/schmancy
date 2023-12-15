import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('schmancy-card')
export default class SchmancyCard extends TailwindElement() {
	@property() type: 'elevated' | 'filled' | 'outlined' = 'elevated'
	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0
	protected render(): unknown {
		const classes = {
			'rounded-md': true,
			'shadow-1': this.elevation === 1,
			'shadow-2': this.elevation === 2,
			'shadow-3': this.elevation === 3,
			'shadow-4': this.elevation === 4,
			'shadow-5': this.elevation === 5,
			'hover:shadow-1': ['outlined', 'filled'].includes(this.type),
			'bg-surface-low shadow-1 hover:shadow-2': this.type === 'elevated',
			'bg-surface-highest': this.type === 'filled',
			'bg-surface-default border-1 border-outlinetype ': this.type === 'outlined',
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

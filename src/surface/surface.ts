import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
/**
 * @element schmancy-surface
 * @slot - default content
 */
@customElement('schmancy-surface')
export class SchmancySurface extends TailwindElement(css`
	:host {
		display: block;
	}
`) {
	@property({ type: Boolean }) fill = false
	@property() rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'
	@property() type:
		| 'surface'
		| 'surfaceVariant'
		| 'containerLowest'
		| 'containerLow'
		| 'container'
		| 'containerHigh'
		| 'containerHighest' = 'surface'
	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0
	protected render(): unknown {
		const classes = {
			'rounded-none': this.rounded === 'none',
			'rounded-t-[16px]': this.rounded === 'top',
			'rounded-l-[16px]': this.rounded === 'left',
			'rounded-r-[16px]': this.rounded === 'right',
			'rounded-b-[16px]': this.rounded === 'bottom',
			'rounded-[16px]': this.rounded === 'all',

			'w-full h-full overflow-auto': this.fill,
			'shadow-1': this.elevation === 1,
			'shadow-2': this.elevation === 2,
			'shadow-3': this.elevation === 3,
			'shadow-4': this.elevation === 4,

			'bg-surface-default': this.type === 'surface',
			'bg-surface-variant': this.type === 'surfaceVariant',
			'bg-surface-lowest': this.type === 'containerLowest',
			'bg-surface-low': this.type === 'containerLow',
			'bg-surface-container': this.type === 'container',
			'bg-surface-high': this.type === 'containerHigh',
			'bg-surface-highest': this.type === 'containerHighest',
		}
		return html`
			<div class="${this.classMap(classes)}">
				<slot></slot>
			</div>
		`
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-surface': SchmancySurface
	}
}

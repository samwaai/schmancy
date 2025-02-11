import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancySurfaceTypeContext } from './context'

/**
 * @element schmancy-surface
 * @slot - default content
 */
@customElement('schmancy-surface')
export class SchmancySurface extends TailwindElement(css`
	:host([fill='all']) {
		height: -webkit-fill-available;
		width: -webkit-fill-available;
	}
	:host([fill='width']) {
		width: -webkit-fill-available;
	}
	:host([fill='height']) {
		height: -webkit-fill-available;
	}
	:host {
		display: block;
	}
`) {
	/**
	 * Fill the width and/or height of the parent container.
	 * @default 'auto'
	 *
	 */
	@property({ type: String, reflect: true }) fill: 'all' | 'width' | 'height' | 'auto' = 'auto'
	@property() rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'

	@provide({ context: SchmancySurfaceTypeContext })
	@property()
	type:
		| 'surface'
		| 'surfaceDim'
		| 'surfaceBright'
		| 'containerLowest'
		| 'containerLow'
		| 'container'
		| 'containerHigh'
		| 'containerHighest' = 'surface'

	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	protected render(): unknown {
		const classes = {
			'relative inset-0 block box-border': true,
			'rounded-none': this.rounded === 'none',
			'rounded-t-[8px]': this.rounded === 'top',
			'rounded-l-[8px]': this.rounded === 'left',
			'rounded-r-[8px]': this.rounded === 'right',
			'rounded-b-[8px]': this.rounded === 'bottom',
			'rounded-[8px]': this.rounded === 'all',

			'w-full': this.fill === 'width' || this.fill === 'all',
			'h-full': this.fill === 'height' || this.fill === 'all',
			'shadow-xs': this.elevation === 1,
			'shadow-sm': this.elevation === 2,
			'shadow-md': this.elevation === 3,
			'shadow-lg': this.elevation === 4,
			'text-surface-on':
				this.type === 'surface' ||
				this.type === 'surfaceDim' ||
				this.type === 'surfaceBright' ||
				this.type === 'containerLowest' ||
				this.type === 'containerLow' ||
				this.type === 'container' ||
				this.type === 'containerHigh' ||
				this.type === 'containerHighest',
			'bg-surface-default': this.type === 'surface',
			'bg-surface-dim': this.type === 'surfaceDim',
			'bg-surface-bright': this.type === 'surfaceBright',
			'bg-surface-lowest': this.type === 'containerLowest',
			'bg-surface-low': this.type === 'containerLow',
			'bg-surface-container': this.type === 'container',
			'bg-surface-high': this.type === 'containerHigh',
			'bg-surface-highest': this.type === 'containerHighest',
		}
		return html`
			<section class="${this.classMap(classes)}">
				<slot></slot>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-surface': SchmancySurface
	}
}

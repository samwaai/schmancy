import { provide } from '@lit/context'
import TailwindElement from '@schmancy/mixin/tailwind/tailwind.mixin'
import { TSurfaceColor } from '@schmancy/types/surface'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { SchmancySurfaceTypeContext } from './context'
/**
 * @element schmancy-surface
 * @slot - default content
 */
@customElement('schmancy-surface')
export class SchmancySurface extends TailwindElement(css`
	:host {
		display: block;
	}
	:host([fill]) {
		height: -webkit-fill-available;
		width: -webkit-fill-available;
	}
`) {
	@property({ type: Boolean }) fill = false
	@property() rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'

	@provide({ context: SchmancySurfaceTypeContext })
	@property()
	type: TSurfaceColor = 'surface'
	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	connectedCallback(): void {
		super.connectedCallback()
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
			'bg-surface-dim': this.type === 'surfaceDim',
			'bg-surface-bright': this.type === 'surfaceBright',
			'bg-surface-lowest': this.type === 'containerLowest',
			'bg-surface-low': this.type === 'containerLow',
			'bg-surface-container': this.type === 'container',
			'bg-surface-high': this.type === 'containerHigh',
			'bg-surface-highest': this.type === 'containerHighest',
		}
		this.shadowRoot.host.classList.add(...Object.keys(classes).filter(key => classes[key]))
	}
	protected render(): unknown {
		return html` <slot></slot> `
	}
}
declare global {
	interface HTMLElementTagNameMap {
		'schmancy-surface': SchmancySurface
	}
}

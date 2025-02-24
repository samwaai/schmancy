import { createContext, provide } from '@lit/context'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { TSurfaceColor } from '@schmancy/types'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js' // Import classMap

export const SchmancySurfaceTypeContext = createContext<TSurfaceColor>('surface')

export type SchmancySurfaceFill = 'all' | 'width' | 'height' | 'auto'
/**
 * `<schmancy-surface>` component
 *
 * This component renders a styled container that adapts its dimensions based on the `fill` property.
 * It supports various rounding options, elevation levels, and applies background and text color classes
 * based on the specified surface variant. Additionally, when the `scroller` property is true, the component
 * enables internal scrolling by applying overflow and scroll-behavior styles.
 *
 * @element schmancy-surface
 * @slot - Default slot for projecting child content.
 *
 * @example
 * <schmancy-surface fill="all" rounded="all" elevation="3" type="surfaceBright" scroller>
 *   <p>Your scrollable content here</p>
 * </schmancy-surface>
 */
@customElement('schmancy-surface')
export class SchmancySurface extends TailwindElement(css`
	:host([fill='all']) {
		height: 100%;
		width: 100%;
	}
	:host([fill='width']) {
		width: 100%;
	}
	:host([fill='height']) {
		height: 100%;
	}
	:host {
		display: block;
	}
`) {
	/**
	 * Fill the width and/or height of the parent container.
	 * Options: 'all', 'width', 'height', 'auto'.
	 * @default 'auto'
	 */
	@property({ type: String, reflect: true })
	fill: 'all' | 'width' | 'height' | 'auto' = 'auto'

	/**
	 * Specifies the rounding style of the component's corners.
	 * Options: 'none', 'top', 'left', 'right', 'bottom', 'all'.
	 * @default 'none'
	 */
	@property()
	rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'

	/**
	 * Specifies the surface type for styling.
	 * Provided to descendant components via context.
	 * Options: 'surface', 'surfaceDim', 'surfaceBright', 'containerLowest',
	 * 'containerLow', 'container', 'containerHigh', 'containerHighest'.
	 * @default 'surface'
	 */
	@provide({ context: SchmancySurfaceTypeContext })
	@property()
	type: TSurfaceColor = 'surface'

	/**
	 * Defines the elevation level (shadow depth) of the surface.
	 * Valid values: 0, 1, 2, 3, 4, 5.
	 * @default 0
	 */
	@property({ type: Number, reflect: true })
	elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	protected render(): unknown {
		const classes = {
			relative: true,
			'inset-0': true,
			block: true,
			'box-border': true,
			// Rounding classes
			'rounded-none': this.rounded === 'none',
			'rounded-t-[8px]': this.rounded === 'top',
			'rounded-l-[8px]': this.rounded === 'left',
			'rounded-r-[8px]': this.rounded === 'right',
			'rounded-b-[8px]': this.rounded === 'bottom',
			'rounded-[8px]': this.rounded === 'all',
			// Fill classes
			'w-full': this.fill === 'width' || this.fill === 'all',
			'h-full': this.fill === 'height' || this.fill === 'all',
			// Elevation shadow classes
			'shadow-xs': this.elevation === 1,
			'shadow-sm': this.elevation === 2,
			'shadow-md': this.elevation === 3,
			'shadow-lg': this.elevation === 4,
			'shadow-xl': this.elevation === 5,
			// Text color based on the surface variant for optimal readability
			'text-surface-on':
				this.type === 'surface' ||
				this.type === 'surfaceDim' ||
				this.type === 'surfaceBright' ||
				this.type === 'containerLowest' ||
				this.type === 'containerLow' ||
				this.type === 'container' ||
				this.type === 'containerHigh' ||
				this.type === 'containerHighest',
			// Background color classes based on the surface variant
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
			<section class=${classMap(classes)}>
				<schmancy-scroll class="h-full w-full">
					<slot></slot>
				</schmancy-scroll>
			</section>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-surface': SchmancySurface
	}
}

import { provide } from '@lit/context'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { TSurfaceColor } from '@schmancy/types'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js' // Utility for conditionally applying CSS classes
import { SchmancySurfaceTypeContext } from './context'

/**
 * Defines the fill options for the surface component.
 */
export type SchmancySurfaceFill = 'all' | 'width' | 'height' | 'auto'

/**
 * `<schmancy-surface>` component.
 *
 * This component renders a styled surface element that adapts its dimensions based on the
 * provided fill mode. It supports various rounding options, elevation levels, and applies
 * background and text color classes based on the specified surface variant.
 *
 * **Note:** The property for defining the surface variant is named `surface` and is not
 * changed to `type` to maintain API consistency.
 *
 * @element schmancy-surface
 * @slot - Default slot for projecting child elements.
 *
 * @example
 * <schmancy-surface fill="all" rounded="all" elevation="3" surface="surfaceBright">
 *   <p>Your content here</p>
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
	 * Determines how the component should fill the available space.
	 *
	 * - `all`: Fills both width and height.
	 * - `width`: Fills only the width.
	 * - `height`: Fills only the height.
	 * - `auto`: No automatic filling.
	 *
	 * @attr fill
	 * @default 'auto'
	 */
	@property({ type: String, reflect: true }) fill: SchmancySurfaceFill = 'auto'

	/**
	 * Specifies the rounding style of the component's corners.
	 *
	 * Options:
	 * - `none`: No rounding.
	 * - `top`, `left`, `right`, `bottom`: Rounds only one edge.
	 * - `all`: Rounds all corners.
	 *
	 * @attr rounded
	 * @default 'none'
	 */
	@property() rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'

	/**
	 * Specifies the type variant.
	 *
	 * **Note:** The property name is `type` and is kept as-is to maintain API consistency.
	 * This value is also provided via context to descendant components.
	 *
	 * @attr type
	 * @default 'type'
	 */
	@provide({ context: SchmancySurfaceTypeContext })
	@property()
	type: TSurfaceColor = 'surface'

	/**
	 * Defines the elevation level (shadow depth) of the surface.
	 *
	 * Valid values: 0, 1, 2, 3, 4, 5.
	 *
	 * @attr elevation
	 * @default 0
	 */
	@property({ type: Number, reflect: true }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	/**
	 * Renders the component's template.
	 *
	 * CSS classes are conditionally applied using the `classMap` directive based on the
	 * current property values.
	 *
	 * @returns The template for the component.
	 */
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
			'shadow-xl': this.elevation === 5, // Added for elevation level 5
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

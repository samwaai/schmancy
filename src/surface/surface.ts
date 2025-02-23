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
 * This component provides a styled surface that adapts its dimensions based on the
 * provided fill attribute and applies additional styling such as elevation and rounding.
 * It uses a context provider to share the surface type with descendant components.
 *
 * @element schmancy-surface
 * @slot - Default slot for projecting child content.
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
	 * Specifies how the component should fill the available space.
	 * Options:
	 * - `all`: Fill both width and height.
	 * - `width`: Fill only the width.
	 * - `height`: Fill only the height.
	 * - `auto`: No automatic filling.
	 *
	 * @attr fill
	 * @default 'auto'
	 */
	@property({ type: String, reflect: true }) fill: SchmancySurfaceFill = 'auto'

	/**
	 * Determines the rounding style for the component's corners.
	 * Options include:
	 * - `none`: No rounding.
	 * - `top`, `left`, `right`, `bottom`: Round only one side.
	 * - `all`: Round all corners.
	 *
	 * @attr rounded
	 * @default 'none'
	 */
	@property() rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'

	/**
	 * Provides the surface type to descendant components via context.
	 * This property also defines the background and text colors.
	 *
	 * @attr surface
	 * @default 'surface'
	 */
	@provide({ context: SchmancySurfaceTypeContext })
	@property()
	surface: TSurfaceColor = 'surface'

	/**
	 * Sets the elevation level (shadow depth) of the surface.
	 * Valid values are 0 to 5.
	 *
	 * @attr elevation
	 * @default 0
	 */
	@property({ type: Number }) elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	/**
	 * Renders the component template.
	 * The component dynamically applies CSS classes based on property values
	 * using the `classMap` directive.
	 *
	 * @returns The rendered template.
	 */
	protected render(): unknown {
		// Map properties to Tailwind CSS classes
		const classes = {
			relative: true,
			'inset-0': true,
			block: true,
			'box-border': true,
			// Apply rounding based on the `rounded` property
			'rounded-none': this.rounded === 'none',
			'rounded-t-[8px]': this.rounded === 'top',
			'rounded-l-[8px]': this.rounded === 'left',
			'rounded-r-[8px]': this.rounded === 'right',
			'rounded-b-[8px]': this.rounded === 'bottom',
			'rounded-[8px]': this.rounded === 'all',
			// Apply fill classes based on the `fill` property
			'w-full': this.fill === 'width' || this.fill === 'all',
			'h-full': this.fill === 'height' || this.fill === 'all',
			// Apply shadow classes based on the `elevation` property
			'shadow-xs': this.elevation === 1,
			'shadow-sm': this.elevation === 2,
			'shadow-md': this.elevation === 3,
			'shadow-lg': this.elevation === 4,
			// Text color based on the surface type (for readability)
			'text-surface-on':
				this.surface === 'surface' ||
				this.surface === 'surfaceDim' ||
				this.surface === 'surfaceBright' ||
				this.surface === 'containerLowest' ||
				this.surface === 'containerLow' ||
				this.surface === 'container' ||
				this.surface === 'containerHigh' ||
				this.surface === 'containerHighest',
			// Background color based on the surface type
			'bg-surface-default': this.surface === 'surface',
			'bg-surface-dim': this.surface === 'surfaceDim',
			'bg-surface-bright': this.surface === 'surfaceBright',
			'bg-surface-lowest': this.surface === 'containerLowest',
			'bg-surface-low': this.surface === 'containerLow',
			'bg-surface-container': this.surface === 'container',
			'bg-surface-high': this.surface === 'containerHigh',
			'bg-surface-highest': this.surface === 'containerHighest',
		}

		// Render the section element with the dynamically generated classes
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

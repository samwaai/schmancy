import { createContext, provide } from '@lit/context'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { TSurfaceColor } from '@schmancy/types'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

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
	:host {
		display: block;
		box-sizing: border-box;
	}
	
	/* Fill styles */
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
	
	/* Rounded corner styles using M3 shape tokens */
	:host([rounded='none']) {
		border-radius: 0;
	}
	:host([rounded='top']) {
		border-radius: var(--schmancy-sys-shape-corner-small) var(--schmancy-sys-shape-corner-small) 0 0;
	}
	:host([rounded='left']) {
		border-radius: var(--schmancy-sys-shape-corner-small) 0 0 var(--schmancy-sys-shape-corner-small);
	}
	:host([rounded='right']) {
		border-radius: 0 var(--schmancy-sys-shape-corner-small) var(--schmancy-sys-shape-corner-small) 0;
	}
	:host([rounded='bottom']) {
		border-radius: 0 0 var(--schmancy-sys-shape-corner-small) var(--schmancy-sys-shape-corner-small);
	}
	:host([rounded='all']) {
		border-radius: var(--schmancy-sys-shape-corner-small);
	}
	
	/* Elevation styles with M3 surface tint support */
	:host([elevation='1']) {
		box-shadow: var(--schmancy-sys-elevation-1);
		/* Apply surface tint for elevated surfaces */
		position: relative;
	}
	:host([elevation='2']) {
		box-shadow: var(--schmancy-sys-elevation-2);
		position: relative;
	}
	:host([elevation='3']) {
		box-shadow: var(--schmancy-sys-elevation-3);
		position: relative;
	}
	:host([elevation='4']) {
		box-shadow: var(--schmancy-sys-elevation-4);
		position: relative;
	}
	:host([elevation='5']) {
		box-shadow: var(--schmancy-sys-elevation-5);
		position: relative;
	}

	/* M3 Surface tint overlay for elevated surfaces */
	:host([elevation]:not([elevation='0']))::after {
		content: '';
		position: absolute;
		inset: 0;
		border-radius: inherit;
		pointer-events: none;
		background: var(--schmancy-sys-color-surface-tint);
		/* Tint opacity increases with elevation */
		opacity: calc(var(--elevation, 0) * 0.02);
	}
	:host([elevation='1'])::after { --elevation: 1; }
	:host([elevation='2'])::after { --elevation: 2; }
	:host([elevation='3'])::after { --elevation: 3; }
	:host([elevation='4'])::after { --elevation: 4; }
	:host([elevation='5'])::after { --elevation: 5; }
	
	/* Surface type styles - background and text colors */
	/* Note: surface-low/high/lowest/highest map to M3 containerLow/High/Lowest/Highest */
	:host([type='surface']) {
		background-color: var(--schmancy-sys-color-surface-default);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='surfaceDim']) {
		background-color: var(--schmancy-sys-color-surface-dim);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='surfaceBright']) {
		background-color: var(--schmancy-sys-color-surface-bright);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='containerLowest']) {
		/* M3 containerLowest */
		background-color: var(--schmancy-sys-color-surface-lowest);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='containerLow']) {
		/* M3 containerLow */
		background-color: var(--schmancy-sys-color-surface-low);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='container']) {
		/* M3 container */
		background-color: var(--schmancy-sys-color-surface-container);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='containerHigh']) {
		/* M3 containerHigh */
		background-color: var(--schmancy-sys-color-surface-high);
		color: var(--schmancy-sys-color-surface-on);
	}
	:host([type='containerHighest']) {
		/* M3 containerHighest */
		background-color: var(--schmancy-sys-color-surface-highest);
		color: var(--schmancy-sys-color-surface-on);
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
	@property({ reflect: true })
	rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' = 'none'

	/**
	 * Specifies the surface type for styling.
	 * Provided to descendant components via context.
	 * Options: 'surface', 'surfaceDim', 'surfaceBright', 'containerLowest',
	 * 'containerLow', 'container', 'containerHigh', 'containerHighest'.
	 * @default 'container'
	 */
	@provide({ context: SchmancySurfaceTypeContext })
	@property({ reflect: true })
	type: TSurfaceColor = 'container'

	/**
	 * Defines the elevation level (shadow depth) of the surface.
	 * Valid values: 0, 1, 2, 3, 4, 5.
	 * @default 0
	 */
	@property({ type: Number, reflect: true })
	elevation: 0 | 1 | 2 | 3 | 4 | 5 = 0

	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-surface': SchmancySurface
	}
}
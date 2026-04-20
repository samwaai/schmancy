import { createContext, provide } from '@lit/context'
import { TailwindElement } from '@mixins/tailwind.mixin'
import { SurfaceMixin } from '@mixins/surface.mixin'
import { TSurfaceColor } from '@schmancy/types'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export const SchmancySurfaceTypeContext = createContext<TSurfaceColor>('surface')

// Re-export types for backwards compatibility
export type { SchmancySurfaceFill, SchmancySurfaceRounded, SchmancySurfaceElevation } from '@mixins/surface.mixin'

/**
 * `<schmancy-surface>` component
 *
 * This component renders a styled container that adapts its dimensions based on the `fill` property.
 * It supports various rounding options, elevation levels, and applies background and text color classes
 * based on the specified surface variant. Additionally, when the `scroller` property is true, the component
 * enables internal scrolling by applying overflow and scroll-behavior styles.
 *
 * SurfaceMixin automatically provides surfaceStyles CSS.
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
export class SchmancySurface extends SurfaceMixin(
	TailwindElement(css`
		:host {
			display: block;
			box-sizing: border-box;
			overflow: visible;
		}
	`),
) {
	/**
	 * Specifies the surface type for styling.
	 * Provided to descendant components via context.
	 * @default 'container'
	 */
	@provide({ context: SchmancySurfaceTypeContext })
	@property({ reflect: true })
	override type: TSurfaceColor = 'subtle'

	protected render(): unknown {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-surface': SchmancySurface
	}
}

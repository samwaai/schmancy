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
 * Themed container — the root surface primitive. Sets background, text color, rounding, elevation, and (optionally) internal scroll. Provides a `SchmancySurfaceTypeContext` so descendants can adapt to the enclosing surface variant.
 *
 * @element schmancy-surface
 * @summary Wrap a region of a page when you need it to pick up theme tokens (background + on-color + elevation). Nest surfaces to express Material Design's hierarchical color stacking.
 * @example
 * <schmancy-surface fill="all" rounded="all" elevation="3" type="surfaceBright" scroller>
 *   <p>Your scrollable content here</p>
 * </schmancy-surface>
 * @platform div - Styled `<div>` with theme-driven background/color/elevation. Degrades to a plain `<div>` if the tag never registers — text stays readable, just loses theming.
 * @slot - Default slot for projecting child content.
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

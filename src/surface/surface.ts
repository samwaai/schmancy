import { createContext, provide } from '@lit/context'
import { SchmancyElement } from '@mixins/index'
import { SurfaceMixin } from '@mixins/surface.mixin'
import { TSurfaceColor } from '@schmancy/types'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

export const SchmancySurfaceTypeContext = createContext<TSurfaceColor>('surface')

export type { SchmancySurfaceRounded, SchmancySurfaceElevation } from '@mixins/surface.mixin'

/**
 * `<schmancy-surface>` component
 *
 * Styled container that supports rounding, elevation, and background/text color variants.
 * Sizing is the consumer's responsibility — use Tailwind utilities (`class="w-full h-full"`)
 * on the element directly.
 *
 * SurfaceMixin automatically provides surfaceStyles CSS.
 *
 * @element schmancy-surface
 * @slot - Default slot for projecting child content.
 *
 * @example
 * <schmancy-surface class="w-full h-full" rounded="all" elevation="3" type="surfaceBright" scroller>
 *   <p>Your scrollable content here</p>
 * </schmancy-surface>
 */
@customElement('schmancy-surface')
export class SchmancySurface extends SurfaceMixin(SchmancyElement) {
	static styles = [css`
		:host {
			display: block;
			box-sizing: border-box;
			overflow: visible;
		}
	`];
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

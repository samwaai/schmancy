import type { Constructor } from './constructor'
import { CSSResultGroup, CSSResultOrNative, LitElement } from 'lit'
import { property } from 'lit/decorators.js'
import type { TSurfaceColor } from '../src/types/surface'
import { surfaceStyles } from '../src/surface/surface.styles'

export type SchmancySurfaceRounded = 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all'
export type SchmancySurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5

export declare class ISurfaceMixin {
	rounded: SchmancySurfaceRounded
	elevation: SchmancySurfaceElevation
	type: TSurfaceColor
	clickable: boolean
}

/**
 * SurfaceMixin - Adds surface styling properties AND styles to any LitElement
 *
 * Uses Lit's finalizeStyles hook to inject surfaceStyles CSS for all surface type selectors.
 * This is the recommended pattern for mixins that need to add styles.
 *
 * Provides these reflected properties:
 * - `rounded`: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all' - Corner rounding
 * - `elevation`: 0-5 - Shadow depth level
 * - `type`: TSurfaceColor - Surface color variant (26+ options)
 *
 * Usage:
 * ```typescript
 * import { SurfaceMixin } from '@mixins/surface.mixin'
 *
 * @customElement('my-component')
 * class MyComponent extends SurfaceMixin(TailwindElement(css`
 *   :host { display: block; }
 * `)) {
 *   // Component now has type, fill, rounded, elevation properties
 *   // AND surfaceStyles are automatically included
 * }
 * ```
 */
export const SurfaceMixin = <T extends Constructor<LitElement>>(superClass: T) => {
	class SurfaceMixinClass extends superClass {
		/**
		 * Override finalizeStyles to inject surfaceStyles.
		 * This is the Lit-recommended way for mixins to add styles.
		 */
		protected static finalizeStyles(styles?: CSSResultGroup): CSSResultOrNative[] {
			// Get parent's finalized styles using LitElement's method
			const parentStyles = (superClass as unknown as typeof LitElement).finalizeStyles(styles)
			// Append surfaceStyles at the end (higher specificity)
			return [...parentStyles, surfaceStyles as CSSResultOrNative]
		}

		/**
		 * Specifies the rounding style of the component's corners.
		 * @default 'none'
		 */
		@property({ reflect: true })
		rounded: SchmancySurfaceRounded = 'none'

		/**
		 * Defines the elevation level (shadow depth) of the surface.
		 * @default 0
		 */
		@property({ type: Number, reflect: true })
		elevation: SchmancySurfaceElevation = 0

		/**
		 * Specifies the surface type for styling.
		 * @default 'container'
		 */
		@property({ reflect: true })
		type: TSurfaceColor = 'subtle'

		/**
		 * Makes the surface interactive with hover, active states and cursor pointer.
		 * @default false
		 */
		@property({ type: Boolean, reflect: true })
		clickable = false
	}
	return SurfaceMixinClass as Constructor<ISurfaceMixin> & T
}

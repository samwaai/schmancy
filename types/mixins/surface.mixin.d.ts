import type { Constructor } from './constructor';
import { LitElement } from 'lit';
import type { TSurfaceColor } from '../src/types/surface';
export type SchmancySurfaceFill = 'all' | 'width' | 'height' | 'auto';
export type SchmancySurfaceRounded = 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all';
export type SchmancySurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;
export declare class ISurfaceMixin {
    fill: SchmancySurfaceFill;
    rounded: SchmancySurfaceRounded;
    elevation: SchmancySurfaceElevation;
    type: TSurfaceColor;
    clickable: boolean;
}
/**
 * SurfaceMixin - Adds surface styling properties AND styles to any LitElement
 *
 * Uses Lit's finalizeStyles hook to inject surfaceStyles CSS for all surface type selectors.
 * This is the recommended pattern for mixins that need to add styles.
 *
 * Provides these reflected properties:
 * - `fill`: 'all' | 'width' | 'height' | 'auto' - Controls element dimensions
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
export declare const SurfaceMixin: <T extends Constructor<LitElement>>(superClass: T) => Constructor<ISurfaceMixin> & T;

import { TSurfaceColor } from '@schmancy/types';
export declare const SchmancySurfaceTypeContext: {
    __context__: TSurfaceColor;
};
export type { SchmancySurfaceFill, SchmancySurfaceRounded, SchmancySurfaceElevation } from '@mixins/surface.mixin';
declare const SchmancySurface_base: import("../../mixins").Constructor<import("@mixins/surface.mixin").ISurfaceMixin> & import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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
export declare class SchmancySurface extends SchmancySurface_base {
    /**
     * Specifies the surface type for styling.
     * Provided to descendant components via context.
     * @default 'container'
     */
    type: TSurfaceColor;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-surface': SchmancySurface;
    }
}

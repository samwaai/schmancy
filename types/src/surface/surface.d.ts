import { TSurfaceColor } from '@schmancy/types';
export declare const SchmancySurfaceTypeContext: {
    __context__: TSurfaceColor;
};
export type { SchmancySurfaceFill, SchmancySurfaceRounded, SchmancySurfaceElevation } from '@mixins/surface.mixin';
declare const SchmancySurface_base: import("../../mixins").Constructor<import("@mixins/surface.mixin").ISurfaceMixin> & import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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

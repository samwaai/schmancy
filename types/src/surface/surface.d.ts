import { TSurfaceColor } from '@schmancy/types';
export declare const SchmancySurfaceTypeContext: {
    __context__: TSurfaceColor;
};
export type SchmancySurfaceFill = 'all' | 'width' | 'height' | 'auto';
declare const SchmancySurface_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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
export declare class SchmancySurface extends SchmancySurface_base {
    /**
     * Fill the width and/or height of the parent container.
     * Options: 'all', 'width', 'height', 'auto'.
     * @default 'auto'
     */
    fill: 'all' | 'width' | 'height' | 'auto';
    /**
     * Specifies the rounding style of the component's corners.
     * Options: 'none', 'top', 'left', 'right', 'bottom', 'all'.
     * @default 'none'
     */
    rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all';
    /**
     * Specifies the surface type for styling.
     * Provided to descendant components via context.
     * Options: 'surface', 'surfaceDim', 'surfaceBright', 'containerLowest',
     * 'containerLow', 'container', 'containerHigh', 'containerHighest',
     * 'glass', 'transparent', 'glassOforim', 'primary', 'primaryContainer',
     * 'secondary', 'secondaryContainer', 'tertiary', 'tertiaryContainer',
     * 'error', 'errorContainer'.
     * @default 'container'
     */
    type: TSurfaceColor;
    /**
     * Defines the elevation level (shadow depth) of the surface.
     * Valid values: 0, 1, 2, 3, 4, 5.
     * @default 0
     */
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-surface': SchmancySurface;
    }
}
export {};

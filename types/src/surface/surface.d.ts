import { TSurfaceColor } from '@schmancy/types';
/**
 * Defines the fill options for the surface component.
 */
export type SchmancySurfaceFill = 'all' | 'width' | 'height' | 'auto';
declare const SchmancySurface_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * `<schmancy-surface>` component.
 *
 * This component renders a styled surface element that adapts its dimensions based on the
 * provided fill mode. It supports various rounding options, elevation levels, and applies
 * background and text color classes based on the specified surface variant.
 *
 * **Note:** The property for defining the surface variant is named `surface` and is not
 * changed to `type` to maintain API consistency.
 *
 * @element schmancy-surface
 * @slot - Default slot for projecting child elements.
 *
 * @example
 * <schmancy-surface fill="all" rounded="all" elevation="3" surface="surfaceBright" scroller>
 *   <p>Your content here</p>
 * </schmancy-surface>
 */
export declare class SchmancySurface extends SchmancySurface_base {
    /**
     * Determines how the component should fill the available space.
     *
     * - `all`: Fills both width and height.
     * - `width`: Fills only the width.
     * - `height`: Fills only the height.
     * - `auto`: No automatic filling.
     *
     * @attr fill
     * @default 'auto'
     */
    fill: SchmancySurfaceFill;
    /**
     * Specifies the rounding style of the component's corners.
     *
     * Options:
     * - `none`: No rounding.
     * - `top`, `left`, `right`, `bottom`: Rounds only one edge.
     * - `all`: Rounds all corners.
     *
     * @attr rounded
     * @default 'none'
     */
    rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all';
    /**
     * Specifies the type variant.
     *
     * **Note:** The property name is `type` and is kept as-is to maintain API consistency.
     * This value is also provided via context to descendant components.
     *
     * @attr type
     * @default 'type'
     */
    type: TSurfaceColor;
    /**
     * Defines the elevation level (shadow depth) of the surface.
     *
     * Valid values: 0, 1, 2, 3, 4, 5.
     *
     * @attr elevation
     * @default 0
     */
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    /**
     * When set to true, the surface becomes scrollable.
     *
     * @attr scroller
     * @type {boolean}
     * @default false
     */
    scroller: boolean;
    /**
     * Renders the component's template.
     *
     * CSS classes are conditionally applied using the `classMap` directive based on the
     * current property values.
     *
     * @returns The template for the component.
     */
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-surface': SchmancySurface;
    }
}
export {};

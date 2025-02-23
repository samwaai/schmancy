import { SchmancySurfaceFill } from '@schmancy/surface';
import { TSurfaceColor } from '@schmancy/types/surface';
declare const List_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * `<schmancy-list>` component.
 *
 * A list component that wraps its content within a customizable surface.
 * It allows you to set the surface type and fill style, and can optionally
 * enable scrolling behavior using the `scroller` property.
 *
 * @element schmancy-list
 * @slot - The default slot for list items.
 *
 * @example
 * <schmancy-list surface="container" scroller>
 *   <schmancy-list-item>List Item 1</schmancy-list-item>
 * </schmancy-list>
 */
export declare class List extends List_base {
    /**
     * Defines the type or color of the surface used by the component.
     * This value is provided to descendant components via context.
     *
     * @attr surface
     * @type {TSurfaceColor}
     * @default 'surface'
     */
    surface: TSurfaceColor;
    /**
     * Determines the fill style of the underlying surface.
     *
     * @attr fill
     * @type {SchmancySurfaceFill}
     * @default 'auto'
     */
    fill: SchmancySurfaceFill;
    /**
     * When set to true, the component is rendered with scrollable behavior.
     * This is achieved by toggling the 'scroller' CSS class.
     *
     * @attr scroller
     * @type {boolean}
     * @default false
     */
    scroller: boolean;
    /**
     * Defines the elevation level of the surface.
     *
     * @attr elevation
     * @type {number}
     * @default 0
     */
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    /**
     * Lifecycle method called when component properties are updated.
     * Monitors changes to the `scroller` property and toggles the corresponding CSS class.
     *
     * @param changedProperties A map of the properties that have changed.
     */
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    /**
     * Renders the component's template.
     * The list content is wrapped inside a `<schmancy-surface>` element to apply consistent styling.
     *
     * @returns The HTML template for the component.
     */
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-list': List;
    }
}
export {};

import { SchmancySurfaceFill } from '@schmancy/surface';
import { TSurfaceColor } from '@schmancy/types/surface';
declare const List_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Wrapped list container — holds schmancy-list-item children on a themed surface. Optionally scrollable.
 *
 * @element schmancy-list
 * @summary Use for vertical lists of similarly-shaped items: settings entries, menu items, contact lists, notification lists. Pair with schmancy-list-item children.
 * @example
 * <schmancy-list surface="container" scroller>
 *   <schmancy-list-item>First</schmancy-list-item>
 *   <schmancy-list-item>Second</schmancy-list-item>
 *   <schmancy-list-item>Third</schmancy-list-item>
 * </schmancy-list>
 * @platform ul - Styled list container. Degrades to a plain ul/div if the tag never registers.
 * @slot - The default slot for list items.
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
     * Defines the elevation level of the surface.
     *
     * @attr elevation
     * @type {number}
     * @default 0
     */
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    /**
     * Renders the component's template.
     * The list content is wrapped inside a `<schmancy-surface>` element.
     * The scroller property is delegated to the surface so that it controls
     * the scrollable behavior.
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

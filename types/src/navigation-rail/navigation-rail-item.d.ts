declare const SchmancyNavigationRailItem_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * `<schmancy-navigation-rail-item>` component
 *
 * Individual navigation item for use within a navigation rail.
 * Represents a single destination or action with an icon and optional label.
 *
 * @element schmancy-navigation-rail-item
 * @slot icon - Slot for the navigation item icon
 * @slot - Default slot for custom content (takes precedence over icon/label props)
 *
 * @example
 * <schmancy-navigation-rail-item icon="home" label="Home" active></schmancy-navigation-rail-item>
 */
export declare class SchmancyNavigationRailItem extends SchmancyNavigationRailItem_base {
    /**
     * Icon name for the navigation item
     */
    icon: string;
    /**
     * Label text for the navigation item
     */
    label: string;
    /**
     * Whether this item is currently active/selected
     * @default false
     */
    active: boolean;
    /**
     * Badge text to display (e.g., notification count)
     */
    badge: string;
    /**
     * Whether the parent rail is extended
     * @default false
     */
    extended: boolean;
    /**
     * Handle click events
     */
    private handleClick;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-navigation-rail-item': SchmancyNavigationRailItem;
    }
}
export {};

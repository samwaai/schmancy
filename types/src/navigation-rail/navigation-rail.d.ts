declare const SchmancyNavigationRail_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * `<schmancy-navigation-rail>` component
 *
 * A vertical navigation component typically positioned on the left side of an application.
 * Navigation rails provide access to between 3-7 primary destinations with a compact footprint.
 *
 * @element schmancy-navigation-rail
 * @slot - Default slot for navigation rail items
 *
 * @example
 * <schmancy-navigation-rail>
 *   <schmancy-navigation-rail-item icon="home" label="Home"></schmancy-navigation-rail-item>
 *   <schmancy-navigation-rail-item icon="search" label="Search"></schmancy-navigation-rail-item>
 * </schmancy-navigation-rail>
 */
export declare class SchmancyNavigationRail extends SchmancyNavigationRail_base {
    /**
     * Whether the navigation rail is extended to show labels
     * @default false
     */
    extended: boolean;
    /**
     * Alignment of items within the rail
     * @default 'center'
     */
    align: 'start' | 'center' | 'end';
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-navigation-rail': SchmancyNavigationRail;
    }
}
export {};

declare const SchmancyDrawerAppbar_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Top app bar region inside schmancy-nav-drawer — the horizontal strip above the content area that typically holds the page title, hamburger trigger, and contextual actions.
 *
 * @element schmancy-nav-drawer-appbar
 * @summary Always nested inside schmancy-nav-drawer. Holds the page-level title + top-right actions. On mobile, the drawer's hamburger button renders inside this region.
 * @example
 * <schmancy-nav-drawer-appbar>
 *   <schmancy-typography type="title" token="lg">Dashboard</schmancy-typography>
 *   <schmancy-icon-button slot="trailing" aria-label="Notifications">
 *     <schmancy-icon>notifications</schmancy-icon>
 *   </schmancy-icon-button>
 * </schmancy-nav-drawer-appbar>
 * @platform header - Styled horizontal bar. Degrades to a plain header element if the tag never registers.
 * @slot - The default slot
 */
export declare class SchmancyDrawerAppbar extends SchmancyDrawerAppbar_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar;
    }
}
export {};

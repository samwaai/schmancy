declare const SchmancyNavigationDrawerContent_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Main content region inside schmancy-nav-drawer — typically hosts the router outlet or the page's body content.
 *
 * @element schmancy-nav-drawer-content
 * @summary Always nested inside schmancy-nav-drawer. Scrollable by default; propagates scroll events up so the drawer can collapse app-bar on scroll.
 * @example
 * <schmancy-nav-drawer-content>
 *   <schmancy-area name="main"></schmancy-area>
 * </schmancy-nav-drawer-content>
 * @platform main scroll - Scrollable `<main>`. Degrades to a plain scrollable div if the tag never registers.
 */
export declare class SchmancyNavigationDrawerContent extends SchmancyNavigationDrawerContent_base {
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-content': SchmancyNavigationDrawerContent;
    }
}
export {};

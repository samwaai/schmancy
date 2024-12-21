declare const SchmancyNavigationDrawerContent_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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

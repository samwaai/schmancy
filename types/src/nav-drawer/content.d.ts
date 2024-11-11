declare const SchmancyNavigationDrawerContent_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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

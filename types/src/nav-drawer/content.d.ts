declare const SchmancyNavigationDrawerContent_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyNavigationDrawerContent extends SchmancyNavigationDrawerContent_base {
    connectedCallback(): void;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-content': SchmancyNavigationDrawerContent;
    }
}
export {};

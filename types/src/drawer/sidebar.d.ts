declare const SchmancyDrawerSidebar_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export declare class SchmancyDrawerSidebar extends SchmancyDrawerSidebar_base {
    private lg;
    private sidebarOpen;
    private resizeSubscription;
    connectedCallback(): void;
    disconnectedCallback(): void;
    manageVisibility(width?: number): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-drawer-sidebar': SchmancyDrawerSidebar;
    }
}
export {};

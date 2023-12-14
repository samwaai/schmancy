declare const SchmancyDrawerContent_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export declare class SchmancyDrawerContent extends SchmancyDrawerContent_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-drawer-content': SchmancyDrawerContent;
    }
}
export {};

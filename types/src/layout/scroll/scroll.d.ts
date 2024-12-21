declare const SchmancyScroll_base: import("../../../mixins").Constructor<CustomElementConstructor> & import("../../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../../mixins").Constructor<import("lit").LitElement> & import("../../../mixins").Constructor<import("../../../mixins").IBaseMixin>;
export declare class SchmancyScroll extends SchmancyScroll_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-scroll': SchmancyScroll;
    }
}
export {};

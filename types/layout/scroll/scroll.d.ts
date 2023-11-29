declare const SchmancyScroll_base: import("../..").Constructor<CustomElementConstructor> & import("../..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("../..").Constructor<import("lit").LitElement> & import("../..").Constructor<import("../..").IBaseMixin>;
export declare class SchmancyScroll extends SchmancyScroll_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-scroll': SchmancyScroll;
    }
}
export {};

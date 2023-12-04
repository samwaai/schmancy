import '@schmancy/index';
declare const SchmancyDemo_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SchmancyDemo extends SchmancyDemo_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-demo': SchmancyDemo;
    }
}
export {};

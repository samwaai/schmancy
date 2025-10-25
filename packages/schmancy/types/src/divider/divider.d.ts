declare const SchmancyDivider_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyDivider extends SchmancyDivider_base {
    outline: 'default' | 'variant';
    orientation: 'horizontal' | 'vertical';
    grow: 'start' | 'end' | 'both';
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-divider': SchmancyDivider;
    }
}
export {};

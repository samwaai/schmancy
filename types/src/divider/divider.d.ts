declare const SchmancyDivider_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyDivider extends SchmancyDivider_base {
    outline: 'default' | 'variant';
    orientation: 'horizontal' | 'vertical';
    grow: 'start' | 'end' | 'both';
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-divider': SchmancyDivider;
    }
}
export {};

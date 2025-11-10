declare const SchmancyDivider_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyDivider extends SchmancyDivider_base {
    outline: 'default' | 'variant';
    vertical: boolean;
    grow: 'start' | 'end' | 'both';
    /**
     * @deprecated Use `vertical` property instead. Will be removed in next major version.
     */
    set orientation(value: 'horizontal' | 'vertical');
    get orientation(): 'horizontal' | 'vertical';
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-divider': SchmancyDivider;
    }
}
export {};

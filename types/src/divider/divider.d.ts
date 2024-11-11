declare const SchmancyDivider_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancyDivider extends SchmancyDivider_base {
    outline: 'default' | 'variant';
    orientation: 'horizontal' | 'vertical';
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-divider': SchmancyDivider;
    }
}
export {};

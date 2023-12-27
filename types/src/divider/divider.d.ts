declare const SchmancyDivider_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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

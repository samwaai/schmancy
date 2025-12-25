declare const SchmancyProgress_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyProgress extends SchmancyProgress_base {
    value: number;
    max: number;
    indeterminate: boolean;
    size: 'xs' | 'sm' | 'md' | 'lg';
    color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';
    glass: boolean;
    private get percentage();
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-progress': SchmancyProgress;
    }
}
export {};

declare const SchmancyProgress_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyProgress extends SchmancyProgress_base {
    value: number;
    max: number;
    indeterminate: boolean;
    size: 'sm' | 'md' | 'lg';
    color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success';
    glass: boolean;
    private get percentage();
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-progress': SchmancyProgress;
    }
}
export {};

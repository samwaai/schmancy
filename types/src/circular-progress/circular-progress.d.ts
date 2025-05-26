import '../busy';
export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
declare const SchmancyCircularProgress_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyCircularProgress extends SchmancyCircularProgress_base {
    indeterminate: boolean;
    size: CircularProgressSize;
    private get spinnerSize();
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-circular-progress': SchmancyCircularProgress;
    }
}
export {};

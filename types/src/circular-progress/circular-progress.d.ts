import '../busy';
export type CircularProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | string;
declare const SchmancyCircularProgress_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyCircularProgress extends SchmancyCircularProgress_base {
    indeterminate: boolean;
    size: CircularProgressSize;
    private get spinnerSize();
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-circular-progress': SchmancyCircularProgress;
    }
}
export {};

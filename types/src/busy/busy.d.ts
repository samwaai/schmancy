declare const SchmancyBusy_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyBusy extends SchmancyBusy_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-busy': SchmancyBusy;
    }
}
export {};

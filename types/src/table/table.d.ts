declare const SchmancyTable_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SchmancyTable extends SchmancyTable_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-table': SchmancyTable;
    }
}
export {};

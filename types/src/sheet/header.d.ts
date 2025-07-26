declare const SchmancySheetHeader_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancySheetHeader extends SchmancySheetHeader_base {
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet-header': SchmancySheetHeader;
    }
}
export {};

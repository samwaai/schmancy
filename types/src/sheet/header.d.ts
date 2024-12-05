declare const SchmancySheetHeader_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export default class SchmancySheetHeader extends SchmancySheetHeader_base {
    title: string;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet-header': SchmancySheetHeader;
    }
}
export {};

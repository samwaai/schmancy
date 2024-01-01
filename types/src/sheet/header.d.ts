declare const SchmancySheetHeader_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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

declare const SchmancyCountriesSelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyCountriesSelect extends SchmancyCountriesSelect_base {
    value?: string;
    chip: string;
    required: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select-countries': SchmancyCountriesSelect;
    }
}
export {};

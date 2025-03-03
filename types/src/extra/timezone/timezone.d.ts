declare const SchmancyTimezonesSelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyTimezonesSelect extends SchmancyTimezonesSelect_base {
    value?: string;
    chip: string;
    required: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select-timezones': SchmancyTimezonesSelect;
    }
}
export {};

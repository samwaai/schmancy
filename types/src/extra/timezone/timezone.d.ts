declare const SchmancyTimezonesSelect_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyTimezonesSelect extends SchmancyTimezonesSelect_base {
    static formAssociated: boolean;
    private internals?;
    value?: string;
    chip: string;
    required: boolean;
    label: string;
    hint: string;
    placeholder: string;
    name: string;
    private autocomplete;
    constructor();
    get form(): HTMLFormElement;
    checkValidity(): boolean;
    reportValidity(): boolean;
    updated(changedProps: Map<string, unknown>): void;
    private handleChange;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select-timezones': SchmancyTimezonesSelect;
    }
}
export {};

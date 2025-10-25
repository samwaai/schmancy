declare const SchmancyTimezonesSelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Timezone selector component with autocomplete filtering.
 *
 * @prop {string} name - Name attribute for form submission
 * @prop {string} value - Selected timezone value
 * @prop {string} label - Label text for the field
 * @prop {boolean} required - Whether the field is required
 */
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
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select-timezones': SchmancyTimezonesSelect;
    }
}
export {};

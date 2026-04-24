declare const SchmancyCountriesSelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Country picker — type-ahead autocomplete over the ISO 3166-1 country list. Form-associated.
 *
 * @element schmancy-select-countries
 * @summary Drop-in replacement for schmancy-autocomplete when the options are specifically "every country". Pre-seeds the list from countries.data.
 * @example
 * <schmancy-select-countries name="country" label="Shipping country" required></schmancy-select-countries>
 * @platform combobox change - Composes schmancy-autocomplete with a static options list. Value is the 2-letter ISO code.
 * @fires change - `SchmancyAutocompleteChangeEvent` with `{ value: string }` (the ISO code).
 */
export declare class SchmancyCountriesSelect extends SchmancyCountriesSelect_base {
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
        'schmancy-select-countries': SchmancyCountriesSelect;
    }
}
export {};

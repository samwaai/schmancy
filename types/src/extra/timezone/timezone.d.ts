declare const SchmancyTimezonesSelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Timezone picker — type-ahead autocomplete over the IANA tz database. Form-associated.
 *
 * @element schmancy-select-timezones
 * @summary Drop-in replacement for schmancy-autocomplete when the options are IANA timezone names. Value is the IANA identifier ("America/Los_Angeles").
 * @example
 * <schmancy-select-timezones name="tz" label="Timezone" value="America/New_York"></schmancy-select-timezones>
 * @platform combobox change - Composes schmancy-autocomplete with a static IANA timezones list.
 * @fires change - `SchmancyAutocompleteChangeEvent` with `{ value: string }` (the IANA tz name).
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

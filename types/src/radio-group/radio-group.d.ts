export type SchmancyRadioGroupOption = {
    label: string;
    value: string;
};
export type SchmancyRadioGroupChangeEvent = CustomEvent<{
    value: string;
}>;
declare const RadioGroup_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Radio-button group — single-select from a static list of mutually-exclusive options. Form-associated.
 *
 * @element schmancy-radio-group
 * @summary Use for 2–5 mutually-exclusive options where all should stay visible ("Shipping: standard / express / overnight"). Prefer schmancy-select when the list grows.
 * @example
 * <schmancy-radio-group
 *   name="shipping"
 *   label="Shipping"
 *   .options=${[
 *     { label: 'Standard (5 days)', value: 'standard' },
 *     { label: 'Express (2 days)', value: 'express' },
 *     { label: 'Overnight', value: 'overnight' },
 *   ]}
 * ></schmancy-radio-group>
 * @platform radiogroup change - Renders schmancy-radio-button children. Degrades to a fieldset with native `<input type="radio" name="…">` siblings if the tag never registers.
 * @fires change - `SchmancyRadioGroupChangeEvent` with the selected `value`.
 */
export declare class RadioGroup extends RadioGroup_base {
    label: string;
    name: string;
    value: string;
    options: SchmancyRadioGroupOption[];
    required: boolean;
    private selection$;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleSelection;
    private updateChildRadioButtons;
    updated(changedProperties: Map<string, any>): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-radio-group': RadioGroup;
    }
}
export {};

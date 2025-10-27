declare const RadioButton_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Radio button component for use within radio groups.
 *
 * @prop {string} name - Name attribute for grouping radio buttons
 * @prop {string} value - Value of this radio button
 * @prop {boolean} checked - Whether the radio button is selected
 * @prop {boolean} disabled - Whether the radio button is disabled
 */
export declare class RadioButton extends RadioButton_base {
    value: string;
    checked: boolean;
    disabled: boolean;
    name: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-radio-button': RadioButton;
    }
}
export {};

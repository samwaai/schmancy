declare const RadioButton_base: import("@mixins/index").Constructor<import("../../mixins/formField.mixin").IFormFieldMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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

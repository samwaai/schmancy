declare const RadioButton_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class RadioButton extends RadioButton_base {
    value: string;
    checked: boolean;
    disabled: boolean;
    name: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-radio-button': RadioButton;
    }
}
export {};

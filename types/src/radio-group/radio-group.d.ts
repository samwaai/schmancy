export type SchmancyRadioGroupOption = {
    label: string;
    value: string;
};
export type SchmancyRadioGroupChangeEvent = CustomEvent<{
    value: string;
}>;
declare const RadioGroup_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-radio-group': RadioGroup;
    }
}
export {};

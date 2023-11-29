export type SchmancyRadioGroupOption = {
    label: string;
    value: string;
};
export type SchmancyRadioGroupChangeEvent = CustomEvent<{
    value: string;
}>;
declare const RadioGroup_base: any;
export declare class RadioGroup extends RadioGroup_base {
    label: string;
    name: string;
    selected: string;
    options: SchmancyRadioGroupOption[];
    required: boolean;
    private selection$;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleSelection;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-radio-group': RadioGroup;
    }
}
export {};

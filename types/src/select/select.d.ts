import SchmancyOption from '@schmancy/option/option';
export type SchmancySelectChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancySelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancySelect extends SchmancySelect_base {
    required: boolean;
    placeholder: string;
    value: string;
    multi: boolean;
    label: string;
    valueLabel: string;
    ul: HTMLUListElement;
    overlay: HTMLElement;
    options: SchmancyOption[];
    firstUpdated(): void;
    updateDisplayLabel(): void;
    handleOptionClick(value: string): void;
    showOptions(): Promise<void>;
    hideOptions(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select': SchmancySelect;
    }
}
export {};

export type SchmancySelectChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancySelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancySelect extends SchmancySelect_base {
    required: boolean;
    placeholder: string;
    value: string;
    selectedValues: string[];
    multi: boolean;
    label: string;
    private isOpen;
    private valueLabel;
    private ul;
    private options;
    private cleanupPositioner?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    private syncSelection;
    private setupOptionsAccessibility;
    private positionDropdown;
    private handleKeyDown;
    private focusOption;
    private openDropdown;
    private closeDropdown;
    private handleOptionSelect;
    private dispatchChange;
    render(): import("lit-html").TemplateResult<1>;
}
export {};

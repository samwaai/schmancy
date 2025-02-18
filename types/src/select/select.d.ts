import { TemplateResult } from 'lit';
export type SchmancySelectChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancySelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancySelect extends SchmancySelect_base {
    name: string | undefined;
    required: boolean;
    placeholder: string;
    value: string;
    selectedValues: string[];
    multi: boolean;
    label: string;
    private isOpen;
    private valueLabel;
    private isValid;
    validationMessage: string;
    private ul;
    private inputRef;
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
    /**
     * Native form methods:
     * - checkValidity()
     * - reportValidity()
     * - setCustomValidity()
     */
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select': SchmancySelect;
    }
}
export {};

import { PropertyValues, TemplateResult } from 'lit';
export type SchmancySelectChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancySelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancySelect extends SchmancySelect_base {
    static formAssociated: boolean;
    private internals?;
    name: string | undefined;
    required: boolean;
    placeholder: string;
    value: string | string[];
    multi: boolean;
    label: string;
    hint: string;
    private isOpen;
    private valueLabel;
    private isValid;
    validationMessage: string;
    private ul;
    private inputRef;
    private options;
    private cleanupPositioner?;
    constructor();
    get form(): HTMLFormElement;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changedProps: PropertyValues): void;
    private syncSelection;
    private setupOptionsAccessibility;
    private positionDropdown;
    private handleKeyDown;
    private focusOption;
    private openDropdown;
    private closeDropdown;
    private handleOptionSelect;
    private dispatchChange;
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    reset(): void;
    render(): TemplateResult;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select': SchmancySelect;
    }
}
export {};

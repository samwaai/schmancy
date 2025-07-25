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
    disabled: boolean;
    placeholder: string;
    value: string | string[];
    multi: boolean;
    label: string;
    hint: string;
    validateOn: 'always' | 'touched' | 'dirty' | 'submitted';
    size: 'sm' | 'md' | 'lg';
    private isOpen;
    private valueLabel;
    private isValid;
    validationMessage: string;
    private defaultValue;
    private ul;
    private inputRef;
    private options;
    private cleanupPositioner?;
    _userInteracted: boolean;
    private _touched;
    private _dirty;
    private _submitted;
    private _focusedOptionId;
    private formSubmitHandler;
    private formResetHandler;
    constructor();
    get form(): HTMLFormElement;
    connectedCallback(): void;
    disconnectedCallback(): void;
    firstUpdated(): void;
    updated(changedProps: PropertyValues): void;
    /**
     * Determines if validation errors should be shown based on current state
     * and validation strategy
     */
    private shouldShowValidation;
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
export declare const select: typeof SchmancySelect;
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-select': SchmancySelect;
    }
}
export {};

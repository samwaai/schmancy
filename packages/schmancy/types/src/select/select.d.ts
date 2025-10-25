import { PropertyValues, TemplateResult } from 'lit';
export type SchmancySelectChangeEvent = CustomEvent<{
    value: string | string[];
}>;
declare const SchmancySelect_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Select dropdown component with single and multi-select support.
 *
 * @prop {string} name - Name attribute for form submission
 * @prop {string} label - Label text displayed above the select
 * @prop {string} placeholder - Placeholder text when no value is selected
 * @prop {boolean} required - Whether the field is required
 * @prop {boolean} multi - Enable multi-select mode
 * @prop {string} value - Selected value (single select mode)
 * @prop {string[]} values - Selected values (multi-select mode)
 */
export declare class SchmancySelect extends SchmancySelect_base {
    static formAssociated: boolean;
    private internals?;
    name: string | undefined;
    required: boolean;
    disabled: boolean;
    placeholder: string;
    get value(): string | string[];
    set value(val: string | string[]);
    get values(): string[];
    set values(vals: string[]);
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
    private _options$;
    private _selectedValue$;
    private _selectedValues$;
    private _optionSelect$;
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
    private _setupReactivePipelines;
    private handleOptionSelect;
    private _fireChangeEvent;
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

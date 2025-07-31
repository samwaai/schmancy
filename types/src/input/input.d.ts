import { LitElement, PropertyValueMap } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-input': SchmancyInput;
        'sch-input': SchmancyInput;
    }
}
type EventDetails = {
    value: string;
};
/**
 * Custom events the component may emit:
 * - 'input': on every keystroke
 * - 'change': on native blur/change
 * - 'enter': specifically when user presses Enter
 */
export type SchmancyInputInputEvent = CustomEvent<EventDetails>;
export type SchmancyInputChangeEvent = CustomEvent<EventDetails>;
export type SchmancyInputEnterEvent = CustomEvent<EventDetails>;
/**
 * Size variants for the input.
 * - sm: Small, compact input (40px height)
 * - md: Medium input (50px height, default)
 * - lg: Large, spacious input (60px height)
 */
export type InputSize = 'sm' | 'md' | 'lg';
declare const SchmancyInput_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Enhanced version of the SchmancyInput component with improved form integration
 * and compatibility with legacy API.
 *
 * This component uses the native form association API and maintains parity with
 * native input behaviors while providing a stylish, accessible interface.
 *
 * @prop {string} label - Label text for the form field (inherited from FormFieldMixin)
 * @prop {boolean} required - Whether the field is required (inherited from FormFieldMixin)
 * @prop {boolean} disabled - Whether the field is disabled (inherited from FormFieldMixin)
 * @prop {boolean} readonly - Whether the field is read-only (inherited from FormFieldMixin)
 * @prop {boolean} error - Whether the field is in an error state (inherited from FormFieldMixin)
 * @prop {string} validationMessage - The validation message to display (inherited from FormFieldMixin)
 * @prop {string} hint - Optional hint text to display below the field (inherited from FormFieldMixin)
 */
export default class SchmancyInput extends SchmancyInput_base {
    /** Auto-incrementing counter for generating unique IDs */
    static _idCounter: number;
    /** Override value to be string only for input element */
    value: string;
    /**
     * The type of input. (e.g. 'text', 'password', 'email', etc.)
     */
    type: HTMLInputElement['type'];
    placeholder: string;
    /** Pattern validation attribute. */
    pattern?: string;
    /** If true, we visually show a pointer cursor even if readOnly. */
    clickable: boolean;
    /** Whether browser spellcheck is enabled. */
    spellcheck: boolean;
    /**
     * Text alignment within the input.
     * - 'left' | 'center' | 'right'
     */
    align: 'left' | 'center' | 'right';
    /** inputmode attribute (affects on-screen keyboards in mobile). */
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    minlength?: number;
    maxlength?: number;
    min?: string;
    max?: string;
    step?: number;
    /** If true, auto-focus this input on first render. */
    autofocus: boolean;
    /** Autocomplete/autofill hints. */
    autocomplete: AutoFill;
    /**
     * tabIndex for focusing by tab key. Typically 0 or -1.
     */
    tabIndex: number;
    /**
     * The size of the input.
     * - 'sm': Small, compact size
     * - 'md': Medium size (default)
     * - 'lg': Large size
     */
    size: InputSize;
    /**
     * Controls when validation should show.
     * - 'always' - Always show validation
     * - 'touched' - Only show after field has been focused and then blurred
     * - 'dirty' - Only show after value has changed
     * - 'submitted' - Only show after form submission
     */
    validateOn: 'always' | 'touched' | 'dirty' | 'submitted';
    /**
     * For datalist support
     */
    list?: string;
    private inputElement;
    private inputRef;
    /**
     * For integration with browser's autofill support
     */
    private isAutofilled;
    /**
     * Track user interaction state for validation
     */
    private touched;
    private dirty;
    private submitted;
    /**
     * Store the default value for reset behavior
     */
    private defaultValue;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private formResetObserver?;
    /**
     * If user did not provide an ID, auto-generate one so <label for="...">
     * and various aria-* attributes can reference it.
     */
    protected willUpdate(changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    protected updated(changedProps: Map<string, unknown>): void;
    /**
     * Connect to the closest form element and set up form integration
     */
    connectedCallback(): void;
    /**
     * Set up form integration with ElementInternals
     */
    private setupFormIntegration;
    /**
     * Set up external label association for native HTML label support
     */
    private setupExternalLabelAssociation;
    disconnectedCallback(): void;
    /**
     * Reset the input to its default state
     */
    private resetToDefault;
    /**
     * Determines if validation errors should be shown based on current state
     * and validation strategy
     */
    private shouldShowValidation;
    /**
     * Validate input based on required, pattern, etc.
     * This mimics native validation behavior
     */
    private validateInput;
    /**
     * Check validity without showing validation UI
     */
    checkValidity(): boolean;
    /**
     * Show validation UI and check validity
     */
    reportValidity(): boolean;
    /**
     * Set a custom validation error message
     */
    setCustomValidity(message: string): void;
    firstUpdated(): void;
    /**
     * Set up input event handling for value changes
     */
    private setupInputEvents;
    /**
     * Set up focus/blur event handling
     */
    private setupFocusBlurEvents;
    /**
     * Set up autofill detection
     */
    private setupAutofillDetection;
    /**
     * Set up enter key event handling
     */
    private setupEnterKeyEvents;
    /** Selects all text within the input. */
    select(): void;
    /** Returns the native validity state of the inner <input>. */
    getValidity(): ValidityState | undefined;
    /**
     * Sets the selection range. Mirrors native input.setSelectionRange
     */
    setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void;
    /**
     * Returns the selected text within the input (start position)
     */
    get selectionStart(): number | null;
    /**
     * Returns the selected text within the input (end position)
     */
    get selectionEnd(): number | null;
    /**
     * Returns the direction of selection
     */
    get selectionDirection(): 'forward' | 'backward' | 'none' | null;
    /**
     * Sets the range of text to be selected.
     */
    setRangeText(replacement: string, start?: number, end?: number, selectMode?: 'select' | 'start' | 'end' | 'preserve'): void;
    /**
     * Override to forward focus to the internal <input>.
     * Also dispatch a 'focus' event for external listeners.
     */
    focus(options?: FocusOptions): void;
    /**
     * Override to forward clicks to the internal <input>.
     * Also dispatch a 'click' event for external listeners.
     */
    click(): void;
    /** Forward blur to the internal <input>. */
    blur(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
/**
 * Register the component with the legacy tag name for backward compatibility
 * @prop {string} label - Label text for the form field (inherited from FormFieldMixin)
 * @prop {boolean} required - Whether the field is required (inherited from FormFieldMixin)
 * @prop {boolean} disabled - Whether the field is disabled (inherited from FormFieldMixin)
 * @prop {boolean} readonly - Whether the field is read-only (inherited from FormFieldMixin)
 * @prop {boolean} error - Whether the field is in an error state (inherited from FormFieldMixin)
 * @prop {string} validationMessage - The validation message to display (inherited from FormFieldMixin)
 * @prop {string} hint - Optional hint text to display below the field (inherited from FormFieldMixin)
 */
export declare class SchmancyInputCompat extends SchmancyInput {
}
export {};

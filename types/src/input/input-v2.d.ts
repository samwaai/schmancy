import { LitElement, PropertyValueMap } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'sch-input': SchmancyInputV2;
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
export type SchmancyInputInputEventV2 = CustomEvent<EventDetails>;
export type SchmancyInputChangeEventV2 = CustomEvent<EventDetails>;
export type SchmancyInputEnterEventV2 = CustomEvent<EventDetails>;
/**
 * Size variants for the input.
 * - sm: Small, compact input (40px height)
 * - md: Medium input (50px height, default)
 * - lg: Large, spacious input (60px height)
 */
export type InputSize = 'sm' | 'md' | 'lg';
declare const SchmancyInputV2_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Enhanced version of the SchmancyInput component with improved form integration
 * and compatibility with legacy API.
 *
 * This component uses the native form association API and maintains parity with
 * native input behaviors while providing a stylish, accessible interface.
 */
export default class SchmancyInputV2 extends SchmancyInputV2_base {
    /** Auto-incrementing counter for generating unique IDs */
    static _idCounter: number;
    id: string;
    /**
     * The label for the control. If populated, we render a `<label for="...">`.
     * If empty, we add an `aria-label` to the <input> for better screenreader support.
     */
    label: string;
    /**
     * The type of input. (e.g. 'text', 'password', 'email', etc.)
     */
    type: HTMLInputElement['type'];
    /**
     * Name attribute (for form submissions). By default, a unique fallback.
     */
    name: string;
    placeholder: string;
    /** Current value of the input. */
    value: string;
    /** Pattern validation attribute. */
    pattern?: string;
    /** Whether the control is required for form validation. */
    required: boolean;
    /** Whether the control is disabled. */
    disabled: boolean;
    /** Whether the input is read-only. */
    readonly: boolean;
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
     * A small hint text or error message to display under the input.
     */
    hint?: string;
    /**
     * If true, we style the input as an error state, and possibly display
     * the hint as an error message.
     */
    error: boolean;
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
    /**
     * The validation message to display (mimics native input.validationMessage)
     */
    validationMessage: string;
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
    static formAssociated: boolean;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private internals?;
    private formResetObserver?;
    constructor();
    /**
     * If user did not provide an ID, auto-generate one so <label for="...">
     * and various aria-* attributes can reference it.
     */
    protected willUpdate(changedProps: PropertyValueMap<any> | Map<PropertyKey, unknown>): void;
    /** The form this element is associated with, if any. */
    get form(): HTMLFormElement;
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
     * Update validity state based on current error state
     */
    private updateValidityState;
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
export {};

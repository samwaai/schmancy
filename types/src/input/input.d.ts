import { LitElement, PropertyValueMap } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-input': SchmancyInput;
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
declare const SchmancyInput_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyInput extends SchmancyInput_base {
    /** If user does NOT set `id`, we'll autogenerate one. */
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
    private inputElement;
    private inputRef;
    static formAssociated: boolean;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private internals?;
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
     * Native form methods:
     * - checkValidity()
     * - reportValidity()
     * - setCustomValidity()
     */
    checkValidity(): boolean;
    reportValidity(): boolean;
    setCustomValidity(message: string): void;
    firstUpdated(): void;
    /** Selects all text within the input. */
    select(): void;
    /** Returns the native validity state of the inner <input>. */
    getValidity(): ValidityState | undefined;
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

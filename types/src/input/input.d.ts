import { LitElement } from 'lit';
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-input': SchmancyInput;
    }
}
/**
 * An autocomplete type (expand or customize as needed).
 */
type AutoFill = 'off' | 'on' | 'name' | 'username' | 'email' | 'tel' | 'url' | 'new-password' | 'current-password' | 'one-time-code';
type EventDetails = {
    value: string;
};
export type SchmancyInputChangeEvent = CustomEvent<EventDetails>;
declare const SchmancyInput_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * `schmancy-input` – A custom input component.
 */
export default class SchmancyInput extends SchmancyInput_base {
    /**
     * The label of the control.
     * @attr
     * @type {string}
     * @default ''
     */
    label: string;
    /**
     * The type of the control.
     * @attr
     * @default 'text'
     */
    type: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | 'date' | 'datetime-local' | 'time' | 'month' | 'week' | 'color' | 'file';
    clickable: boolean;
    /**
     * The name of the control.
     * @attr
     * @default 'name_' + Date.now()
     */
    name: string;
    /**
     * The placeholder of the control.
     * @attr
     * @default ''
     */
    placeholder: string;
    /**
     * The value of the control.
     * @attr
     * @default ''
     */
    value: string;
    /**
     * The pattern attribute of the control.
     * @attr
     */
    pattern?: string;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    spellcheck: boolean;
    align: 'left' | 'center' | 'right';
    /**
     * The inputmode attribute of the control.
     * @attr
     * @default undefined
     */
    inputmode?: 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url';
    /**
     * The minlength attribute of the control.
     * @attr
     */
    minlength?: number;
    /**
     * The maxlength attribute of the control.
     * @attr
     */
    maxlength?: number;
    /**
     * The min attribute of the control.
     * @attr
     */
    min?: string;
    /**
     * The max attribute of the control.
     * @attr
     */
    max?: string;
    /**
     * The step attribute of the control.
     * @attr
     */
    step?: number;
    /**
     * The autofocus attribute of the control.
     * @attr
     * @default false
     */
    autofocus: boolean;
    /**
     * The autocomplete attribute of the control.
     * @attr
     */
    autocomplete: AutoFill;
    /**
     * tabIndex for focusing by tab key.
     */
    tabIndex: number;
    hint?: string;
    error: boolean;
    inputElement: HTMLInputElement;
    inputRef: import("lit-html/directives/ref").Ref<HTMLInputElement>;
    /** Form-associated custom elements support. */
    static formAssociated: boolean;
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    private internals?;
    constructor();
    get form(): HTMLFormElement;
    /**
     * (Optional) Whenever value changes, sync with form internals for
     * form submission (if you're using form-associated custom elements).
     */
    protected updated(changedProps: Map<string, unknown>): void;
    /** Checks for validity of the control and shows the browser message if it's invalid. */
    reportValidity(): boolean;
    /** Checks for validity of the control and emits the invalid event if it is invalid. */
    checkValidity(): boolean;
    /** Sets a custom validity message. */
    setCustomValidity(message: string): void;
    firstUpdated(): void;
    /** Selects all text within the input. */
    select(): void;
    /** Returns the internal validity state object. */
    getValidity(): ValidityState | undefined;
    /**
     * Override focus so that focusing <schmancy-input> actually focuses
     * the internal <input>.
     */
    focus(options?: FocusOptions): void;
    /**
     * Same with click; bubble a click out if needed, but delegate to internal input.
     */
    click(): void;
    /**
     * Same with blur; bubble the event.
     */
    blur(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
export {};

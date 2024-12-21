import { LitElement } from 'lit';
declare const SchmancyTextarea_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export default class SchmancyTextarea extends SchmancyTextarea_base {
    protected static shadowRootOptions: {
        delegatesFocus: boolean;
        mode: ShadowRootMode;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static formAssociated: boolean;
    internals: ElementInternals | undefined;
    textareaRef: import("lit-html/directives/ref").Ref<HTMLTextAreaElement>;
    /**
     * The label of the control.
     * @attr
     * @type {string} label
     * @default ''
     * @public
     */
    label: string;
    /**
     * The name of the control.
     * @attr name
     * @type {string} name
     * @default 'name_' + Date.now()
     * @public
     */
    name: string;
    /**
     * The placeholder of the control.
     * @attr placeholder
     * @type {string}
     * @default ''
     * @public
     */
    placeholder: string;
    /**
     * The value of the control.
     * @attr {string} value - The value of the control.
     * @type {string}
     * @default ''
     * @public
     */
    value: string;
    /**
     * The minlength attribute of the control.
     * @attr
     */
    minlength: number | undefined;
    /**
     * The maxlength attribute of the control.
     * @attr
     */
    maxlength: number;
    /**
     * The number of columns (width) of the control.
     * @attr cols
     * @type {number}
     * @default 20
     * @public
     */
    cols: number;
    /**
     * The number of rows (height) of the control.
     * @attr rows
     * @type {number}
     * @default 2
     * @public
     */
    rows: number;
    /**
     * Specifies how the text in a text area is to be wrapped when submitted in a form.
     * @attr wrap
     * @type {'hard' | 'soft'}
     * @default 'soft'
     * @public
     */
    wrap: 'hard' | 'soft';
    /**
     * The dirname attribute of the control.
     * @attr dirname
     * @type {string}
     * @default undefined
     * @public
     */
    dirname: string | undefined;
    required: boolean;
    disabled: boolean;
    readonly: boolean;
    spellcheck: boolean;
    align: 'left' | 'center' | 'right';
    /**
     * The autofocus attribute of the control.
     * @attr
     * @type {boolean}
     * @default false
     * @public
     */
    autofocus: boolean;
    tabIndex: number;
    textareaElement: HTMLTextAreaElement;
    hint: string | undefined;
    error: boolean;
    constructor();
    firstUpdated(): void;
    get form(): HTMLFormElement;
    /** Checks for validity of the control and shows the browser message if it's invalid. */
    reportValidity(): boolean;
    /** Checks for validity of the control and emits the invalid event if it invalid. */
    checkValidity(): boolean;
    /** Sets a custom validity message. */
    setCustomValidity(message: string): void;
    /** Selects all text within the textarea. */
    select(): void;
    /** Sets the selection range. */
    setSelectionRange(start: number, end: number, direction?: 'forward' | 'backward' | 'none'): void;
    /** Returns the selected text within the textarea. */
    get selectionStart(): number | null;
    get selectionEnd(): number | null;
    get selectionDirection(): 'forward' | 'backward' | 'none' | null;
    /** Sets the range of text to be selected. */
    setRangeText(replacement: string): void;
    /** Adjusts the height of the textarea based on its content. */
    adjustHeight(): void;
    validity(): ValidityState | undefined;
    focus(options?: FocusOptions): void;
    click(): void;
    blur(): void;
    protected render(): unknown;
}
type EventDetails = {
    value: string;
};
export type SchmancyTextareaChangeEvent = CustomEvent<EventDetails>;
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-textarea': SchmancyTextarea;
    }
}
export {};

/**
 * Ergonomic wrapper around a native `<form>`. Children are reparented into a light-DOM `<form>` on connection so form-associated custom elements resolve `internals.form` via native DOM ancestry.
 *
 * - Form-associated custom elements (FACE) resolve their `internals.form`
 *   correctly via native DOM ancestry.
 * - `new FormData(form)` collects values from every FACE + native control
 *   without any manual walking.
 * - `form.reset()` triggers `formResetCallback()` on every FACE.
 * - `form.reportValidity()` runs native validation UI.
 * - `<button type="submit">` and `<schmancy-button type="submit">` both
 *   submit the form via the native submitter pipeline.
 *
 * This component exists only to translate the native `submit` / `reset`
 * events into the Schmancy event shape (`detail: FormData`). All heavy
 * lifting is the platform's.
 *
 * @element schmancy-form
 * @summary Always wrap form-associated schmancy components in schmancy-form (or a native `<form>`) so `new FormData(form)` just works.
 * @example
 * <schmancy-form @submit=${(e) => console.log(Object.fromEntries(e.detail))}>
 *   <schmancy-input name="email" type="email" required></schmancy-input>
 *   <schmancy-input name="password" type="password" required></schmancy-input>
 *   <schmancy-button type="submit" variant="filled">Sign in</schmancy-button>
 * </schmancy-form>
 * @platform form submit - Light-DOM native `<form>` element. Degrades to a `<form>` if the tag never registers — same semantics, just no CustomEvent translation.
 * @fires submit - `CustomEvent<FormData>` emitted when the form is submitted.
 * @fires reset - Emitted after the underlying form resets.
 */
export default class SchmancyForm extends HTMLElement {
    static readonly tagName: string;
    private _form;
    private _wrapped;
    /** ElementInternals for `:state(invalid)` / `:state(submitting)` broadcasting. */
    private readonly _internals;
    /** Skip built-in constraint validation on submit. Mirrors `<form novalidate>`. */
    get novalidate(): boolean;
    set novalidate(value: boolean);
    connectedCallback(): void;
    disconnectedCallback(): void;
    /**
     * On first connection, create the internal light-DOM `<form>` and move
     * existing children into it. Re-entry is a no-op.
     */
    private ensureForm;
    private _onSubmit;
    private _onReset;
    /** Programmatically submit via the native submitter pipeline. */
    submit(): boolean;
    /** Programmatically reset via native `form.reset()`. */
    reset(): void;
    reportValidity(): boolean;
    checkValidity(): boolean;
    /** Snapshot of current form values. Equivalent to `new FormData(this.form)`. */
    getFormData(): FormData;
    /** The underlying `<form>` element (escape hatch for advanced integration). */
    get form(): HTMLFormElement | null;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-form': SchmancyForm;
    }
}
export interface FormElement extends HTMLElement {
    name?: string;
    value?: string;
    disabled?: boolean;
    type?: string;
    defaultValue?: string;
}
export interface CheckableFormElement extends FormElement {
    checked?: boolean;
}
export interface ValidatableFormElement extends FormElement {
    reportValidity?: () => boolean;
    checkValidity?: () => boolean;
}
export interface FormEventMap {
    submit: CustomEvent<FormData>;
    reset: CustomEvent;
}

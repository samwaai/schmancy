import { LitElement } from 'lit';
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
/** Optional registry entry for controls that cannot (yet) extend FormFieldMixin. */
export interface FormControlConfig {
    tagName: string;
    hasValue?: boolean;
    hasChecked?: boolean;
    canSubmit?: boolean;
}
export interface FormEventMap {
    submit: CustomEvent<FormData>;
    reset: CustomEvent;
}
declare const SchmancyForm_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * The form component collects user input from interactive controls.
 *
 * Discovery priority:
 * 1. **FormFieldMixin brand** — any descendant that extends `FormFieldMixin`
 *    is auto-discovered and contributes via its `toFormEntries()` override.
 * 2. **Native form-associated custom elements** — detected via
 *    `constructor.formAssociated === true` and read by duck type.
 * 3. **Legacy registry + optional user overrides** — for controls that do
 *    not yet extend FormFieldMixin. Seeded with every existing Schmancy
 *    control for zero-config back-compat.
 * 4. **Native HTML form elements** (`<input>`, `<select>`, `<textarea>`,
 *    `<button>`) — read via standard DOM APIs.
 *
 * New form components should extend `FormFieldMixin` and override
 * `toFormEntries()` / `resetForm()` as needed — they will be picked up
 * automatically without touching schmancy-form.
 *
 * @element schmancy-form
 * @slot - Default slot for form content.
 * @fires submit - FormData emitted when the form is submitted.
 * @fires reset - Emitted when the form is reset.
 */
export default class SchmancyForm extends SchmancyForm_base {
    private $disconnecting;
    static readonly tagName: string;
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    /** User-supplied overrides for controls not covered by FormFieldMixin or the legacy registry. */
    private static userRegistry;
    /**
     * Register a custom form control with schmancy-form. Rarely needed —
     * FormFieldMixin descendants are auto-discovered, and every existing
     * Schmancy control is already in the legacy registry. Use for third-party
     * form controls whose value cannot be read by duck-type heuristics.
     */
    static registerControl(config: FormControlConfig): void;
    private static getConfig;
    /** Skip form validation on submit. */
    novalidate: boolean;
    constructor();
    disconnectedCallback(): void;
    submit(): boolean;
    reset(): void;
    getFormData(): FormData;
    reportValidity(): boolean;
    private getFormElements;
    private handleSubmitRequest;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-form': SchmancyForm;
    }
}
export {};

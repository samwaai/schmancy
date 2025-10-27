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
}
export interface FormControlConfig {
    tagName: string;
    hasValue?: boolean;
    hasChecked?: boolean;
    canSubmit?: boolean;
}
declare const SchmancyFormV2_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * The form is a component used to collect user input from
 * interactive controls.
 *
 * @element sch-form
 *
 * @slot - Default slot for the form.
 *
 * @fires submit - Emitted when the form is submitted.
 * @fires reset - Emitted when the form is reset.
 */
export default class SchmancyFormV2 extends SchmancyFormV2_base {
    private $disconnecting;
    static readonly tagName = "sch-form";
    private static formControlRegistry;
    static registerFormControl(config: FormControlConfig): void;
    private static hasValue;
    private static hasChecked;
    private static canSubmit;
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        clonable?: boolean;
        customElementRegistry?: CustomElementRegistry;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    /** Specifies if form data validation should be skipped on submit.
     * @attr novalidate
     * @type {boolean}
     * @public
     */
    novalidate: boolean;
    constructor();
    disconnectedCallback(): void;
    /** Submits the form. */
    submit(): boolean;
    /** Resets the form. */
    reset(): void;
    private getFormElements;
    getFormData(): FormData;
    /** Checks for validity of the form. */
    reportValidity(): boolean;
    private handleSubmitRequest;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-form': SchmancyFormV2;
    }
}
export {};

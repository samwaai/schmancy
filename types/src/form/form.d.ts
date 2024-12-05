import { LitElement } from 'lit';
export interface FormEventMap {
    submit: CustomEvent<FormData>;
    reset: CustomEvent;
}
declare const SchmancyForm_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * The form is a component used to collect user input from
 * interactive controls.
 *
 * @element schmancy-form
 *
 * @slot - Default slot for the form.
 *
 * @fires submit - Emitted when the form is submitted.
 * @fires reset - Emitted when the form is reset.
 */
export default class SchmancyForm extends SchmancyForm_base {
    private $disconnecting;
    static readonly tagName = "schmancy-form";
    tabIndex: number;
    protected static shadowRootOptions: {
        mode: string;
        delegatesFocus: boolean;
        serializable?: boolean;
        slotAssignment?: SlotAssignmentMode;
    };
    static styles: import("lit").CSSResult;
    private _controlsWithChecked;
    private _controlsWithValue;
    private _controlsThatSubmit;
    /** Specifies if form data validation should be skipped on submit.
     * @attr novalidate
     * @type {boolean}
     * @public
     */
    novalidate: boolean;
    constructor();
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
        'schmancy-form': SchmancyForm;
    }
}
export {};

declare const SchForm_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * A form component that enforces native browser validation
 * for all contained form elements.
 *
 * @example
 * ```html
 * <sch-form @submit=${handleSubmit}>
 *   <sch-input label="Name" required></sch-input>
 *   <schmancy-button type="submit">Submit</schmancy-button>
 * </sch-form>
 * ```
 */
export declare class SchForm extends SchForm_base {
    /**
     * If true, form validation will be skipped
     */
    novalidate: boolean;
    /**
     * The form's submission method (get or post)
     */
    method: 'get' | 'post';
    /**
     * The URL to submit the form to
     */
    action: string;
    /**
     * The form's encoding type
     */
    enctype: 'application/x-www-form-urlencoded' | 'multipart/form-data' | 'text/plain';
    /**
     * Reference to the internal form element
     */
    formElement: HTMLFormElement;
    /**
     * Handle form submission
     * This is the key method that ensures browser validation works
     */
    private handleSubmit;
    /**
     * Reset the form
     */
    reset(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-form': SchForm;
    }
}
export {};

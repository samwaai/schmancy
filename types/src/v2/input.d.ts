declare const SchInput_base: import("../../mixins").Constructor<import("@mixins/formField.mixin").IFormFieldMixin> & import("../../mixins").Constructor<import("../../mixins").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * A simplified input component that works with browser validation.
 *
 * @example
 * ```html
 * <sch-input
 *   label="Email"
 *   name="email"
 *   required
 *   type="email"
 * ></sch-input>
 * ```
 */
export default class SchInput extends SchInput_base {
    /**
     * The type of input (text, email, password, etc.)
     */
    type: string;
    /**
     * Placeholder text
     */
    placeholder: string;
    /**
     * Minimum input length
     */
    minlength?: number;
    /**
     * Maximum input length
     */
    maxlength?: number;
    /**
     * Pattern for validation
     */
    pattern?: string;
    /**
     * Whether to enable autocomplete
     */
    autocomplete: string;
    /**
     * Reference to the internal input element
     */
    private inputRef;
    /**
     * Handle input change
     */
    private handleInput;
    /**
     * Focus the input
     */
    focus(options?: FocusOptions): void;
    /**
     * Blur the input
     */
    blur(): void;
    /**
     * Let the browser handle validation
     */
    checkValidity(): boolean;
    /**
     * Use the browser's built-in validation UI
     */
    reportValidity(): boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-input': SchInput;
    }
}
export {};

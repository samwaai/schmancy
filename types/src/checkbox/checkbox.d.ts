export type schmancyCheckBoxChangeEvent = CustomEvent<{
    value: boolean;
}>;
declare const SchmancyCheckbox_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-checkbox
 * @slot - The label for the checkbox.
 * @fires valueChange - Event fired when the checkbox value changes.
 **/
export declare class SchmancyCheckbox extends SchmancyCheckbox_base {
    /**
     * @attr {boolean} value - The value of the checkbox.
     */
    value: boolean;
    /**
     * @attr {boolean} disabled - The disabled state of the checkbox.
     */
    disabled: boolean;
    /**
     * @attr {boolean} required - The required state of the checkbox.
     */
    required: boolean;
    /**
     * @attr {string} name - The name of the checkbox.
     */
    name: string;
    /**
     * @attr {string} id - The id of the checkbox.
     */
    id: string;
    /**
     * @attr {sm | md | lg } size - The size of the checkbox.
     */
    size: 'sm' | 'md' | 'lg';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-checkbox': SchmancyCheckbox;
    }
}
export {};

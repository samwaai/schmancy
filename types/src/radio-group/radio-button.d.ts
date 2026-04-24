declare const RadioButton_base: import("@mixins/index").Constructor<import("@mixins/index").IFormFieldMixin> & import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Single radio button — always rendered as a child of `<schmancy-radio-group>`, never standalone.
 *
 * @element schmancy-radio-button
 * @summary Low-level primitive. Use schmancy-radio-group and pass `.options` for the common path; only instantiate schmancy-radio-button directly when you need per-button custom rendering.
 * @example
 * <schmancy-radio-group name="plan">
 *   <schmancy-radio-button value="free">Free</schmancy-radio-button>
 *   <schmancy-radio-button value="pro" checked>Pro</schmancy-radio-button>
 * </schmancy-radio-group>
 * @platform radio change - Schmancy-skinned `<input type="radio">` semantics. Degrades to native radio if the tag never registers.
 *
 * @prop {string} name - Name attribute for grouping radio buttons
 * @prop {string} value - Value of this radio button
 * @prop {boolean} checked - Whether the radio button is selected
 * @prop {boolean} disabled - Whether the radio button is disabled
 */
export declare class RadioButton extends RadioButton_base {
    value: string;
    checked: boolean;
    disabled: boolean;
    name: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-radio-button': RadioButton;
    }
}
export {};

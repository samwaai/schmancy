declare const SchmancyOption_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * `schmancy-option` is an option element for schmancy-select and schmancy-autocomplete components.
 *
 * @fires click - When the option is clicked
 */
export default class SchmancyOption extends SchmancyOption_base {
    /**
     * The value of the option, will be used when selected.
     */
    value: string;
    /**
     * The human-readable label for the option.
     */
    label: string;
    /**
     * Whether the option is currently selected.
     */
    selected: boolean;
    /**
     * Whether the option is disabled.
     */
    disabled: boolean;
    /**
     * Optional group this option belongs to (for option grouping).
     */
    group: string;
    /**
     * Optional icon or image to display before the label.
     */
    icon: string;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private handleClick;
    private handleKeyDown;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-option': SchmancyOption;
    }
}
export {};

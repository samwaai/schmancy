declare const SchmancyDropdownContent_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Content container for the schmancy-dropdown component.
 *
 * @element schmancy-dropdown-content
 * @slot - Default slot for dropdown content
 */
export declare class SchmancyDropdownContent extends SchmancyDropdownContent_base {
    /**
     * Width of the dropdown content
     */
    width: string;
    /**
     * Maximum height of the dropdown content
     */
    maxHeight: string;
    /**
     * Whether to render with a shadow
     */
    shadow: boolean;
    /**
     * Border radius style
     */
    radius: 'none' | 'sm' | 'md' | 'lg' | 'full';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-dropdown-content': SchmancyDropdownContent;
    }
}
export {};

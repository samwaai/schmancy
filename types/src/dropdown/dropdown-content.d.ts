declare const SchmancyDropdownContent_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Content panel for a schmancy-dropdown — a styled positioned surface. Always nested inside schmancy-dropdown and placed alongside the trigger slot.
 *
 * @element schmancy-dropdown-content
 * @summary Nest this inside schmancy-dropdown (not in the trigger slot). Use the `content` CSS part to customize backgrounds / shadows / padding without shadow-root piercing.
 * @example
 * <schmancy-dropdown>
 *   <schmancy-button slot="trigger">Open</schmancy-button>
 *   <schmancy-dropdown-content>
 *     Panel contents…
 *   </schmancy-dropdown-content>
 * </schmancy-dropdown>
 * @platform div - Positioned panel with theme-aware styling. Degrades to an inline div if the tag never registers.
 * @slot - Default slot for dropdown content.
 * @csspart content - The inner wrapper element; style to override panel backgrounds, shadows, padding, or borders without shadow-root piercing.
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

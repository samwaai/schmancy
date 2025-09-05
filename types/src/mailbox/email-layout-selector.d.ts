declare const SchmancyEmailLayoutSelector_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Email layout selector component for choosing email templates
 *
 * Features:
 * - Grid-based layout selection
 * - Visual icons for each layout type
 * - Clean, compact interface
 *
 * @example
 * ```html
 * <schmancy-email-layout-selector
 *   @layout-select=${(e) => applyLayout(e.detail.layout)}
 * ></schmancy-email-layout-selector>
 * ```
 *
 * @fires layout-select - When a layout is selected
 */
export declare class SchmancyEmailLayoutSelector extends SchmancyEmailLayoutSelector_base {
    /** Emit layout selection event */
    private selectLayout;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-email-layout-selector': SchmancyEmailLayoutSelector;
    }
}
export {};

declare const SchmancyEmailLayoutSelector_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Email layout selector component for choosing email templates
 *
 * Simple horizontal row of 5 layout options using Schmancy components only.
 *
 * @fires layout-select - When a layout is selected with {detail: {layout: string}}
 */
export declare class SchmancyEmailLayoutSelector extends SchmancyEmailLayoutSelector_base {
    private layouts;
    private selectLayout;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-email-layout-selector': SchmancyEmailLayoutSelector;
    }
}
export {};

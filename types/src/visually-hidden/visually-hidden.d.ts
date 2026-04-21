declare const SchmancyVisuallyHidden_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Hides content visually while keeping it in the accessibility tree. Use for
 * screen-reader-only labels, supplemental descriptions, and live-region text
 * that sighted users don't need to see.
 *
 * Uses the WCAG-recommended clip pattern rather than `display: none` or
 * `visibility: hidden` so assistive tech still reads the content.
 *
 * @element schmancy-visually-hidden
 * @slot - Content hidden from sighted users but exposed to assistive tech.
 */
export declare class SchmancyVisuallyHidden extends SchmancyVisuallyHidden_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-visually-hidden': SchmancyVisuallyHidden;
    }
}
export {};

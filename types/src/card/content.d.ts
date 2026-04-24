declare const SchmancyCardContent_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Content region of a schmancy-card — holds the card's headline, supporting text, and inline controls.
 *
 * @element schmancy-card-content
 * @summary Always nested inside schmancy-card. The padded content block between the media and action rows.
 * @example
 * <schmancy-card-content>
 *   <h3>Card title</h3>
 *   <p>Supporting text that describes the card's subject.</p>
 * </schmancy-card-content>
 * @platform div - Styled `<div>` with padding. Degrades to a plain div if the tag never registers.
 */
export default class SchmancyCardContent extends SchmancyCardContent_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-content': SchmancyCardContent;
    }
}
export {};

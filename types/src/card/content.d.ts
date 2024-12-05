declare const SchmancyCardContent_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-card-content
 * @slot headline
 * @slot subhead
 * @slot default - The content of the card
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

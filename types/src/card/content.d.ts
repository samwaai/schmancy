declare const SchmancyCardContent_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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

declare const SchmancyCardContent_base: import("@schmancy/mixin/shared/constructor").Constructor<CustomElementConstructor> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin/shared/constructor").Constructor<import("lit").LitElement> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/shared/baseElement").IBaseMixin>;
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

declare const SchmancyCardMedia_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
/**
 * @element schmancy-card-action
 * @slot - The content of the action
 */
export default class SchmancyCardMedia extends SchmancyCardMedia_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-action': SchmancyCardMedia;
    }
}
export {};

declare const SchmancyCardMedia_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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

declare const SchmancyCard_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
export default class SchmancyCard extends SchmancyCard_base {
    type: 'elevated' | 'filled' | 'outlined';
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card': SchmancyCard;
    }
}
export {};

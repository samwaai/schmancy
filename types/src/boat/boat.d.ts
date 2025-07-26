type BoatState = 'hidden' | 'minimized' | 'expanded';
declare const SchmancyBoat_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export default class SchmancyBoat extends SchmancyBoat_base {
    state: BoatState;
    toggleState(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat;
    }
}
export {};

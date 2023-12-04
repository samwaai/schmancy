declare const SchmancyTab_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancyTab extends SchmancyTab_base {
    label: any;
    active: boolean;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tab': SchmancyTab;
    }
}
export {};

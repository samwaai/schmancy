declare const SchmancyMenuItem_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
export default class SchmancyMenuItem extends SchmancyMenuItem_base {
    connectedCallback(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu-item': SchmancyMenuItem;
    }
}
export {};

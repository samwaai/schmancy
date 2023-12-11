declare const SchmancyContainer_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyContainer extends SchmancyContainer_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-container': SchmancyContainer;
    }
}
export {};

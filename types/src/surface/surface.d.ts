declare const SchmancySurface_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
/**
 * @element schmancy-surface
 * @slot - default content
 */
export declare class SchmancySurface extends SchmancySurface_base {
    fill: boolean;
    rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all';
    type: 'surface' | 'surfaceDim' | 'surfaceBright' | 'containerLowest' | 'containerLow' | 'container' | 'containerHigh' | 'containerHighest';
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    get classes(): Record<string, boolean>;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-surface': SchmancySurface;
    }
}
export {};

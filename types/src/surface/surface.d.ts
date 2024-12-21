declare const SchmancySurface_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
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

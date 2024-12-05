declare const SchmancySurface_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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

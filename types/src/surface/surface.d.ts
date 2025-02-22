declare const SchmancySurface_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-surface
 * @slot - default content
 */
export declare class SchmancySurface extends SchmancySurface_base {
    /**
     * Fill the width and/or height of the parent container.
     * @default 'auto'
     *
     */
    fill: 'all' | 'width' | 'height' | 'auto';
    rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all';
    type: 'surface' | 'surfaceDim' | 'surfaceBright' | 'containerLowest' | 'containerLow' | 'container' | 'containerHigh' | 'containerHighest';
    elevation: 0 | 1 | 2 | 3 | 4 | 5;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-surface': SchmancySurface;
    }
}
export {};

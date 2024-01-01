import { TSurfaceColor } from '@schmancy/types/surface';
declare const SchmancySurface_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @element schmancy-surface
 * @slot - default content
 */
export declare class SchmancySurface extends SchmancySurface_base {
    fill: boolean;
    rounded: 'none' | 'top' | 'left' | 'right' | 'bottom' | 'all';
    type: TSurfaceColor;
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

import { TSchmancyDrawerSidebarMode } from '@schmancy/drawer/context';
declare const SchmancyDrawerAppbar_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @element schmancy-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot title - The title slot
 * @slot actions - The actions slot
 */
export declare class SchmancyDrawerAppbar extends SchmancyDrawerAppbar_base {
    sidebarMode: TSchmancyDrawerSidebarMode;
    sidebarOpen: any;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-drawer-appbar': SchmancyDrawerAppbar;
    }
}
export {};

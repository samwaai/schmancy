import { TSchmancyDrawerNavbarMode } from '@schmancy/nav-drawer/context';
declare const SchmancyDrawerAppbar_base: import("@schmancy/mixin/shared/constructor").Constructor<CustomElementConstructor> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin/shared/constructor").Constructor<import("lit").LitElement> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/shared/baseElement").IBaseMixin>;
/**
 * @element schmancy-nav-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot - The default slot
 */
export declare class SchmancyDrawerAppbar extends SchmancyDrawerAppbar_base {
    sidebarMode: TSchmancyDrawerNavbarMode;
    sidebarOpen: any;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar;
    }
}
export {};

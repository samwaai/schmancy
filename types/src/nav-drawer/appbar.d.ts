import { TSchmancyDrawerNavbarMode } from '@schmancy/nav-drawer/context';
declare const SchmancyDrawerAppbar_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-nav-drawer-appbar
 * @slot toggler - The toggler slot
 * @slot - The default slot
 */
export declare class SchmancyDrawerAppbar extends SchmancyDrawerAppbar_base {
    sidebarMode: TSchmancyDrawerNavbarMode;
    sidebarOpen: any;
    toggler: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-appbar': SchmancyDrawerAppbar;
    }
}
export {};

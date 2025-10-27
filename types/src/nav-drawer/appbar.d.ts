import { TSchmancyDrawerNavbarMode } from '@schmancy/nav-drawer/context';
declare const SchmancyDrawerAppbar_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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

import { TSchmancyDrawerSidebarMode } from '@schmancy/drawer/context';
declare const SchmancyAppbarTop_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyAppbarTop extends SchmancyAppbarTop_base {
    sidebarMode: TSchmancyDrawerSidebarMode;
    sidebarOpen: any;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-appbar-top': SchmancyAppbarTop;
    }
}
export {};

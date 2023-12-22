import { TSchmancyDrawerSidebarMode } from './context';
declare const SchmancyDrawerSidebar_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export declare class SchmancyDrawerSidebar extends SchmancyDrawerSidebar_base {
    mode: TSchmancyDrawerSidebarMode;
    private state;
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-drawer-sidebar': SchmancyDrawerSidebar;
    }
}
export {};

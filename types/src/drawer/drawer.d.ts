import { TSchmancyDrawerSidebarMode, TSchmancyDrawerSidebarState } from './context';
declare const SchmancyDrawer_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
export declare class SchmancyDrawer extends SchmancyDrawer_base {
    mode: TSchmancyDrawerSidebarMode;
    minWidth: number;
    open: TSchmancyDrawerSidebarState;
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-drawer': SchmancyDrawer;
    }
}
export {};

import { TSchmancyDrawerNavbarMode } from './context';
declare const SchmancyNavigationDrawerSidebar_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyNavigationDrawerSidebar extends SchmancyNavigationDrawerSidebar_base {
    mode: TSchmancyDrawerNavbarMode;
    private state;
    overlay: HTMLElement;
    width: string;
    connectedCallback(): void;
    updated(changedProperties: Map<string, any>): void;
    openOverlay(): void;
    closeOverlay(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-navbar': SchmancyNavigationDrawerSidebar;
    }
}
export {};

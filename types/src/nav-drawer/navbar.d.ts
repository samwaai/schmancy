import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawerSidebar_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Sidebar region inside schmancy-nav-drawer — the persistent-on-desktop / modal-on-mobile nav rail.
 *
 * @element schmancy-nav-drawer-navbar
 * @summary Always nested inside schmancy-nav-drawer. On desktop: pinned left sidebar. On mobile: modal overlay triggered by the hamburger button in schmancy-nav-drawer-appbar.
 * @example
 * <schmancy-nav-drawer-navbar>
 *   <schmancy-list>
 *     <schmancy-list-item href="/dashboard">Dashboard</schmancy-list-item>
 *     <schmancy-list-item href="/settings">Settings</schmancy-list-item>
 *   </schmancy-list>
 * </schmancy-nav-drawer-navbar>
 * @platform nav - Sidebar `<nav>` with responsive open/close behavior. Degrades to a plain sidebar div if the tag never registers.
 */
export declare class SchmancyNavigationDrawerSidebar extends SchmancyNavigationDrawerSidebar_base {
    mode: TSchmancyDrawerNavbarMode;
    drawerState: TSchmancyDrawerNavbarState;
    overlay: HTMLElement;
    nav: HTMLElement;
    width: string;
    private _initialized;
    /**
     * firstUpdated()
     * Set initial styles based on the current mode and consumed state.
     */
    firstUpdated(): void;
    /**
     * updated()
     * Trigger animations when either the consumed mode or state changes.
     */
    updated(changedProperties: Map<string, any>): void;
    /**
     * Animate the overlay to fade in.
     */
    openOverlay(): void;
    /**
     * Animate the overlay to fade out, then hide it.
     */
    closeOverlay(): void;
    showNavDrawer(): void;
    hideNavDrawer(): void;
    /**
     * Handle overlay click events by dispatching a custom event
     * to close the navigation drawer.
     */
    private handleOverlayClick;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-navbar': SchmancyNavigationDrawerSidebar;
    }
}
export {};

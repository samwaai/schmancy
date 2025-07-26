import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawerSidebar_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer-navbar': SchmancyNavigationDrawerSidebar;
    }
}
export {};

import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawer_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Responsive navigation drawer — a left sidebar that becomes a hamburger-triggered modal overlay on narrow viewports. Composes schmancy-nav-drawer-navbar (the nav rail), schmancy-nav-drawer-appbar (the top bar), and schmancy-nav-drawer-content (the main region).
 *
 * @element schmancy-nav-drawer
 * @summary The app-shell layout primitive. Wrap your whole app in this when you want "persistent sidebar on desktop, drawer on mobile" behavior. Mode auto-switches at the breakpoint.
 * @example
 * <schmancy-nav-drawer>
 *   <schmancy-nav-drawer-navbar>
 *     <!-- nav items, typically schmancy-list-item links -->
 *   </schmancy-nav-drawer-navbar>
 *   <schmancy-nav-drawer-appbar>App title</schmancy-nav-drawer-appbar>
 *   <schmancy-nav-drawer-content>
 *     <!-- router outlet / page content -->
 *   </schmancy-nav-drawer-content>
 * </schmancy-nav-drawer>
 * @platform div - Flex layout with viewport-width mode switching. Degrades to a stack of plain divs if the tag never registers.
 * @slot - The content slot
 * @fires schmancy-drawer-state - When the drawer open/close state changes on mobile.
 */
export declare class SchmancyNavigationDrawer extends SchmancyNavigationDrawer_base {
    fullscreen: boolean;
    /**
     * The breakpoint for the sidebar based on Tailwind CSS breakpoints.
     * Accepts: "sm", "md", "lg", or "xl".
     */
    breakpoint: 'sm' | 'md' | 'lg' | 'xl';
    private static BREAKPOINTS;
    mode: TSchmancyDrawerNavbarMode;
    open: TSchmancyDrawerNavbarState;
    firstUpdated(): void;
    private updateState;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer': SchmancyNavigationDrawer;
    }
}
export {};

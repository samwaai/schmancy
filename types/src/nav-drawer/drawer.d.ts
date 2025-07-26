import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawer_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-nav-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
export declare class SchmancyNavigationDrawer extends SchmancyNavigationDrawer_base {
    fullscreen: boolean;
    /**
     * The breakpoint for the sidebar based on Tailwind CSS breakpoints.
     * Accepts: "sm", "md", "lg", or "xl".
     *
     * The following default values are used:
     * - sm: 640px
     * - md: 768px (default)
     * - lg: 1024px
     * - xl: 1280px
     *
     * @attr breakpoint
     * @type {"sm" | "md" | "lg" | "xl"}
     */
    breakpoint: 'sm' | 'md' | 'lg' | 'xl';
    /**
     * Mapping of Tailwind breakpoint tokens to their numeric pixel values.
     */
    private static BREAKPOINTS;
    /**
     * The mode of the sidebar.
     */
    mode: TSchmancyDrawerNavbarMode;
    /**
     * The open/close state of the sidebar.
     */
    open: TSchmancyDrawerNavbarState;
    /**
     * A flag indicating that the initial state has been set.
     */
    private _initialized;
    /**
     * In firstUpdated, we can safely read attribute-set properties.
     * We also initialize our state and subscribe to events.
     */
    firstUpdated(): void;
    /**
     * Helper method to update state based on a given width.
     */
    private updateState;
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer': SchmancyNavigationDrawer;
    }
}
export {};

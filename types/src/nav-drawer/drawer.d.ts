import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawer_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-nav-drawer
 * @slot - The content slot
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

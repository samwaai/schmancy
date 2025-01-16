import { nothing } from 'lit';
import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawer_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-nav-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
export declare class SchmancyNavigationDrawer extends SchmancyNavigationDrawer_base {
    fullscreen: boolean;
    /**
     * The minimum width of the sidebar
     * @attr	breakpoint
     * @type {number}
     * @memberof SchmancyNavigationDrawer
     */
    breakpoint: number;
    /**
     * The mode of the sidebar
     * @type {TSchmancyDrawerNavbarMode}
     * @memberof SchmancyNavigationDrawer
     * @protected
     */
    mode: TSchmancyDrawerNavbarMode;
    open: TSchmancyDrawerNavbarState;
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-nav-drawer': SchmancyNavigationDrawer;
    }
}
export {};

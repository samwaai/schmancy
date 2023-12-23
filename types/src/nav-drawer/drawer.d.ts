import { nothing } from 'lit';
import { TSchmancyDrawerNavbarMode, TSchmancyDrawerNavbarState } from './context';
declare const SchmancyNavigationDrawer_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-nav-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
export declare class SchmancyNavigationDrawer extends SchmancyNavigationDrawer_base {
    /**
     * The minimum width of the sidebar
     * @attr	min-width
     * @type {number}
     * @memberof SchmancyNavigationDrawer
     */
    minWidth: number;
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

import { nothing } from 'lit';
import { TSchmancyContentDrawerSheetMode, TSchmancyContentDrawerSheetState } from './context';
declare const SchmancyContentDrawer_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-content-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
export declare class SchmancyContentDrawer extends SchmancyContentDrawer_base {
    /**
     * The minimum width of the sheet
     * @attr	min-width
     * @type {number}
     * @memberof SchmancyContentDrawer
     */
    minWidth: number;
    /**
     * The mode of the sheet
     * @type {TSchmancyContentDrawerSheetMode}
     * @memberof SchmancyContentDrawer
     * @protected
     */
    mode: TSchmancyContentDrawerSheetMode;
    open: TSchmancyContentDrawerSheetState;
    schmancyContentDrawerID: string;
    assignedElements: HTMLElement[];
    firstUpdated(): void;
    protected render(): import("lit-html").TemplateResult<1> | typeof nothing;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer': SchmancyContentDrawer;
    }
}
export {};

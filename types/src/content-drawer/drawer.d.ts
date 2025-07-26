import { SchmancyContentDrawerMinWidth, TSchmancyContentDrawerSheetMode, TSchmancyContentDrawerSheetState } from './context';
declare const SchmancyContentDrawer_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-content-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
export declare class SchmancyContentDrawer extends SchmancyContentDrawer_base {
    /**
     * The minimum width of the sheet
     * @attr	minWidth
     * @type {number}
     * @memberof SchmancyContentDrawer
     */
    minWidth: typeof SchmancyContentDrawerMinWidth.__context__;
    /**
     * The state of the sheet
     * @attr open
     * @type {TSchmancyContentDrawerSheetState}
     */
    open: TSchmancyContentDrawerSheetState;
    /**
     * The mode of the sheet
     * @type {TSchmancyContentDrawerSheetMode}
     * @memberof SchmancyContentDrawer
     * @protected
     */
    mode: TSchmancyContentDrawerSheetMode;
    schmancyContentDrawerID: string;
    maxHeight: string;
    assignedElements: HTMLElement[];
    firstUpdated(): void;
    getOffsetTop(element: any): number;
    protected render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer': SchmancyContentDrawer;
    }
}
export {};

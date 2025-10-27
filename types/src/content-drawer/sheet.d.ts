import { Observable } from 'rxjs';
import { SchmancyContentDrawerMinWidth, TSchmancyContentDrawerSheetMode, TSchmancyContentDrawerSheetState } from './context';
declare const SchmancyContentDrawerSheet_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyContentDrawerSheet extends SchmancyContentDrawerSheet_base {
    minWidth: any;
    mode: TSchmancyContentDrawerSheetMode;
    state: TSchmancyContentDrawerSheetState;
    schmancyContentDrawerID: any;
    sheet: HTMLElement;
    defaultSlot: HTMLElement[];
    drawerMinWidth: typeof SchmancyContentDrawerMinWidth.__context__;
    maxHeight: any;
    connectedCallback(): void;
    updated(changedProperties: Map<string, any>): void;
    /**
     * Open the sheet by sliding it into view.
     */
    open(): void;
    /**
     * Close everything (modal sheet + the sheet itself).
     */
    closeAll(): void;
    /**
     * Dismiss the "modal sheet."
     * This just returns an Observable that completes immediately.
     */
    closeModalSheet(): Observable<boolean>;
    /**
     * Slide the sheet out of view + hide it.
     * Return an Observable so we can merge it with other close operations.
     */
    closeSheet(): Observable<void>;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet;
    }
}
export {};

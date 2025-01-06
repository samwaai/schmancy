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
    open(): void;
    closeAll(): void;
    closeModalSheet(): import("rxjs").Observable<boolean>;
    closeSheet(): import("@packages/anime-beta-master").Animation;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet;
    }
}
export {};

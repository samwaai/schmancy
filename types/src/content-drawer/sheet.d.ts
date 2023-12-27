import { TSchmancyContentDrawerSheetMode, TSchmancyContentDrawerSheetState } from './context';
declare const SchmancyContentDrawerSheet_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export declare class SchmancyContentDrawerSheet extends SchmancyContentDrawerSheet_base {
    mode: TSchmancyContentDrawerSheetMode;
    state: TSchmancyContentDrawerSheetState;
    schmancyContentDrawerID: any;
    sheet: HTMLElement;
    defaultSlot: HTMLElement[];
    updated(changedProperties: Map<string, any>): void;
    open(): void;
    closeAll(): void;
    closeModalSheet(): import("rxjs").Observable<boolean>;
    closeSheet(): any;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet;
    }
}
export {};

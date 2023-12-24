import { TSchmancyContentDrawerSheetMode } from './context';
declare const SchmancyContentDrawerSheet_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
export declare class SchmancyContentDrawerSheet extends SchmancyContentDrawerSheet_base {
    mode: TSchmancyContentDrawerSheetMode;
    private state;
    schmancyContentDrawerID: any;
    overlay: HTMLElement;
    sheet: HTMLElement;
    defaultSlot: HTMLElement[];
    updated(changedProperties: Map<string, any>): void;
    open(): void;
    close(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-content-drawer-sheet': SchmancyContentDrawerSheet;
    }
}
export {};

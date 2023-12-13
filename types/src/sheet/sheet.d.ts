import { SchmancySheetPosition } from './sheet.service';
declare const SchmancySheet_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancySheet extends SchmancySheet_base {
    mode: 'modal' | 'standard';
    uid: string;
    open: boolean;
    position: SchmancySheetPosition;
    persist: boolean;
    allowOverlyDismiss: boolean;
    sheet: HTMLElement | undefined;
    sheetAsync: Promise<HTMLElement> | undefined;
    sheetContents: HTMLElement | undefined;
    assignedElements: HTMLElement[];
    focusAttribute: string;
    sheetHeight: number;
    sheetWidth: number;
    dragPosition: number | undefined;
    onOpenChange(_old_value: boolean, new_value: boolean): void;
    connectedCallback(): Promise<void>;
    pxToVw(pxValue: number): number;
    pxToVh(pxValue: number): number;
    firstUpdated(): Promise<void>;
    disconnectedCallback(): void;
    setIsSheetShown(isShown: boolean): void;
    closeSheet(): void;
    private getFocusElement;
    focus(): void;
    blur(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet': SchmancySheet;
    }
}
export {};

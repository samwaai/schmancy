import { SchmancySheetPosition } from './sheet.service';
declare const SchmancySheet_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancySheet extends SchmancySheet_base {
    uid: string;
    open: boolean;
    header: 'hidden' | 'visible';
    position: SchmancySheetPosition;
    persist: boolean;
    lock: boolean;
    handleHistory: boolean;
    title: string;
    private sheetRef;
    private assignedElements;
    focusAttribute: string;
    private lastFocusedElement;
    onOpenChange(_oldValue: boolean, newValue: boolean): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupEventListeners;
    private announcePresence;
    private setBackgroundInert;
    setIsSheetShown(isShown: boolean): void;
    closeSheet(): void;
    private getFocusElement;
    focus(): void;
    private handleOverlayClick;
    private handleHeaderDismiss;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet': SchmancySheet;
    }
}
export {};

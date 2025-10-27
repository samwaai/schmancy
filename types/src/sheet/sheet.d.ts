import { SchmancySheetPosition } from './sheet.service';
declare const SchmancySheet_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancySheet extends SchmancySheet_base {
    uid: string;
    open: boolean;
    position: SchmancySheetPosition;
    persist: boolean;
    lock: boolean;
    handleHistory: boolean;
    private lastFocusedElement;
    private overlayEl;
    private contentEl;
    onOpenChange(_oldValue: boolean, newValue: boolean): void;
    private animateIn;
    private animateOut;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private setupEventListeners;
    private setBackgroundInert;
    closeSheet(): void;
    focus(): void;
    private handleOverlayClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet': SchmancySheet;
    }
}
export {};

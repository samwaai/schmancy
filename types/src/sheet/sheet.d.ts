import { SchmancySheetPosition } from './sheet.service';
declare const SchmancySheet_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Side-docked or bottom-docked panel — a dialog variant that slides in from an edge. Driven imperatively by the `sheet` service; rarely instantiated directly.
 *
 * @element schmancy-sheet
 * @summary Prefer `sheet.open({ component, position })` over placing this element declaratively — the service handles stacking, focus, close on outside-click, ESC, and router integration.
 * @example
 * import { sheet, SchmancySheetPosition } from '@mhmo91/schmancy'
 * sheet.open({
 *   component: new MyEditorElement(),
 *   position: SchmancySheetPosition.Side,
 *   title: 'Edit item',
 * })
 * @platform dialog close - Positioned-fixed panel with backdrop. Degrades to a `<dialog>` if the tag never registers — loses slide animation, keeps focus trap + dismiss.
 * @attr position - `'side' | 'bottom'`. Which edge the sheet docks to.
 * @attr open - Boolean; sheet is visible when true.
 * @fires close - When the sheet is dismissed (backdrop click, close button, ESC).
 */
export default class SchmancySheet extends SchmancySheet_base {
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

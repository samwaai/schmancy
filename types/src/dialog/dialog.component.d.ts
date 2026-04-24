declare const SchmancyDialog_base: import("@mixins/index").Constructor<import("./dialog-base.mixin").IDialogBaseMixin> & CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Modal dialog — content-only (just a styled panel) or confirm mode (title + message + confirm/cancel buttons). Prefer the imperative `$dialog` service for most use cases; use the element directly only when you want a declaratively-positioned dialog.
 *
 * @element schmancy-dialog
 * @summary Blocks interaction with the rest of the page until dismissed. For quick confirmations, prefer `$dialog.confirm({ ... })` over this element. For arbitrary dialog content driven imperatively, prefer `$dialog.component(MyComponent)`.
 * @platform dialog close - Positioned overlay in light DOM. Degrades to a styled `<dialog>` if the tag never registers — loses custom animations but keeps focus trap + ESC close.
 * @slot default - Content slot for dialog body (used in content mode)
 * @slot content - Named slot for custom content in confirm mode
 * @fires confirm - In confirm mode, when the confirm button is clicked.
 * @fires cancel - In confirm mode, when the cancel button or ESC is activated.
 *
 * @example Content mode (no buttons):
 * <schmancy-dialog>
 *   <my-custom-content></my-custom-content>
 * </schmancy-dialog>
 *
 * @example Confirm mode (with buttons):
 * <schmancy-dialog
 *   title="Delete item?"
 *   message="This action cannot be undone."
 *   confirm-text="Delete"
 *   cancel-text="Keep"
 * ></schmancy-dialog>
 */
export declare class SchmancyDialog extends SchmancyDialog_base {
    /**
     * Unique identifier for the dialog instance
     */
    uid: string;
    /**
     * Dialog title (enables confirm mode when set)
     */
    title: string | undefined;
    /**
     * Dialog subtitle
     */
    subtitle: string | undefined;
    /**
     * Dialog message
     */
    message: string | undefined;
    /**
     * Text for confirm button (enables confirm mode when set with cancelText)
     */
    confirmText: string | undefined;
    /**
     * Text for cancel button
     */
    cancelText: string | undefined;
    /**
     * Dialog variant (affects button colors in confirm mode)
     */
    variant: 'default' | 'danger';
    /**
     * Whether to hide action buttons (force content mode)
     */
    hideActions: boolean;
    /**
     * Slotted children in the named "content" slot (confirm mode custom content)
     */
    private _contentSlotElements;
    /**
     * Ref to the confirm mode wrapper div
     */
    private _confirmDialogRef;
    /**
     * Ref to the content mode section element
     */
    private _contentDialogRef;
    /**
     * Ref to the backdrop element for animations
     */
    private _backdropRef;
    /**
     * Ref to the drag handle element for swipe gestures
     */
    private _dragHandleRef;
    /**
     * Stable per-instance id used for ARIA labelledby/describedby wiring
     */
    private readonly _a11yId;
    private get _titleId();
    private get _descId();
    /**
     * Return the dialog element for positioning/size measurement.
     * In content mode, returns the first slotted child (the actual component).
     * In confirm mode, returns the wrapper div.
     */
    protected getDialogElement(): HTMLElement | null;
    /**
     * Return the backdrop element for animations
     */
    protected getBackdropElement(): HTMLElement | null;
    /**
     * Return the drag handle element for swipe gestures
     */
    protected getDragHandleElement(): HTMLElement | null;
    /**
     * Check if dialog is in confirm mode (has buttons)
     */
    private get isConfirmMode();
    /**
     * Handle component connection to DOM
     */
    connectedCallback(): void;
    /**
     * Announce this dialog's presence to the service
     */
    private announcePresence;
    /**
     * Handle confirm action
     */
    private handleConfirm;
    /**
     * Handle cancel/close action
     */
    private handleClose;
    /**
     * Render drag handle for mobile bottom sheet
     */
    private renderDragHandle;
    render(): import("lit-html").TemplateResult<1>;
    /**
     * Static helper for confirm dialogs
     */
    static confirm(options: {
        title?: string;
        subtitle?: string;
        message?: string;
        confirmText?: string;
        cancelText?: string;
        variant?: 'default' | 'danger';
        position?: {
            x: number;
            y: number;
        } | MouseEvent | TouchEvent;
        width?: string;
    }): Promise<boolean>;
    /**
     * Simple shorthand - just pass message and optionally an event
     */
    static ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean>;
}
export { SchmancyDialog as ConfirmDialog };
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-dialog': SchmancyDialog;
    }
}

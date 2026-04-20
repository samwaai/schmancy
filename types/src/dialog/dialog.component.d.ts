declare const SchmancyDialog_base: import("@mixins/index").Constructor<import("./dialog-base.mixin").IDialogBaseMixin> & CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Unified dialog component that handles both content-only and confirm modes.
 *
 * @element schmancy-dialog
 * @slot default - Content slot for dialog body (used in content mode)
 * @slot content - Named slot for custom content in confirm mode
 *
 * @example Content mode (no buttons):
 * ```html
 * <schmancy-dialog>
 *   <my-custom-content></my-custom-content>
 * </schmancy-dialog>
 * ```
 *
 * @example Confirm mode (with buttons):
 * ```html
 * <schmancy-dialog
 *   title="Confirm Action"
 *   message="Are you sure?"
 *   confirm-text="Yes"
 *   cancel-text="No"
 * ></schmancy-dialog>
 * ```
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

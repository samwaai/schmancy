declare const ConfirmDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A minimal, positioned confirm dialog component
 *
 * @element confirm-dialog
 * @fires confirm - When the confirm button is clicked
 * @fires cancel - When the cancel button is clicked or outside is clicked
 */
export declare class ConfirmDialog extends ConfirmDialog_base {
    /**
     * Whether the dialog is open
     */
    open: boolean;
    /**
     * Dialog title
     */
    title: string;
    /**
     * Dialog message
     */
    message: string;
    /**
     * Text for confirm button
     */
    confirmText: string;
    /**
     * Text for cancel button
     */
    cancelText: string;
    /**
     * Dialog variant (affects button colors)
     */
    variant: 'default' | 'danger';
    /**
     * Internal position state
     */
    private _position;
    /**
     * Last clicked position for initial placement
     */
    private _clickPosition;
    /**
     * Show the dialog at specific coordinates
     */
    showAt(x: number, y: number): void;
    /**
     * Hide the dialog
     */
    hide(): void;
    /**
     * Find the best position for the dialog based on click coordinates
     */
    private _calculateOptimalPosition;
    /**
     * Setup event listeners when dialog opens
     */
    private _setupListeners;
    /**
     * Handle confirm action
     */
    private _handleConfirm;
    /**
     * Handle cancel action
     */
    private _handleCancel;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'confirm-dialog': ConfirmDialog;
    }
}
export {};

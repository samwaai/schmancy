declare const ConfirmDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A confirm dialog web component with custom content support
 *
 * @element confirm-dialog
 * @slot content - Optional slot for custom content
 */
export declare class ConfirmDialog extends ConfirmDialog_base {
    /**
     * Dialog title
     */
    title: any;
    /**
     * Dialog message
     */
    message: any;
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
     * Current position of the dialog
     */
    private position;
    /**
     * Current active promise resolver
     */
    private resolvePromise?;
    /**
     * Simple API: Show the dialog at a specific position
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    show(positionOrEvent?: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent): Promise<boolean>;
    /**
     * Simple API: Hide the dialog
     */
    hide(confirmed?: boolean): void;
    /**
     * Calculate optimal position based on click coordinates
     * with viewport boundary checks to prevent dialogs from appearing off-screen
     */
    private calculatePosition;
    /**
     * Handle lifecycle callback when dialog is first rendered
     */
    firstUpdated(): void;
    /**
     * Handle confirm action
     */
    private handleConfirm;
    /**
     * Handle cancel action
     */
    private handleCancel;
    render(): import("lit-html").TemplateResult<1>;
    /**
     * Static helper for even simpler API
     */
    static confirm(options: {
        title?: string;
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
     * Even simpler shorthand method - just pass message and optionally an event
     */
    static ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean>;
}
declare global {
    interface HTMLElementTagNameMap {
        'confirm-dialog': ConfirmDialog;
    }
}
export {};

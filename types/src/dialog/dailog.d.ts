declare const ConfirmDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A minimal confirm dialog web component with a super-simple API
 *
 * @element confirm-dialog
 */
export declare class ConfirmDialog extends ConfirmDialog_base {
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
    show(positionOrEvent: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent): Promise<boolean>;
    /**
     * Simple API: Hide the dialog
     */
    hide(confirmed?: boolean): void;
    /**
     * Calculate optimal position based on click coordinates
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
        position: {
            x: number;
            y: number;
        } | MouseEvent | TouchEvent;
    }): Promise<boolean>;
    /**
     * Even simpler shorthand method - just pass the event and message
     */
    static ask(event: MouseEvent | TouchEvent, message: string): Promise<boolean>;
}
declare global {
    interface HTMLElementTagNameMap {
        'confirm-dialog': ConfirmDialog;
    }
}
export {};

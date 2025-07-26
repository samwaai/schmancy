declare const ConfirmDialog_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
     * Dialog subtitle
     */
    subtitle: any;
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
     * Confirm button color
     */
    confirmColor?: 'primary' | 'error' | 'warning' | 'success';
    /**
     * Current position of the dialog
     */
    private position;
    /**
     * Current active promise resolver
     */
    private resolvePromise?;
    /**
     * Store cleanup function for position auto-updates
     */
    private cleanupAutoUpdate?;
    /**
     * Store resize subscription
     */
    private resizeSubscription?;
    /**
     * Virtual element to use as reference for positioning
     */
    private virtualReference?;
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
     * Set up position auto-updating when dialog content changes or window resizes
     */
    private setupPositioning;
    /**
     * Update dialog position using Floating UI
     */
    private updatePosition;
    /**
     * Handle component disconnection from DOM
     */
    disconnectedCallback(): void;
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
    /**
     * Get the CSS class for the confirm button based on color
     */
    private getConfirmButtonClass;
    render(): any;
    /**
     * Static helper for even simpler API
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

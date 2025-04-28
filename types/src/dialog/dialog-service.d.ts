import { TemplateResult } from 'lit';
/**
 * Dialog service options interface with component support
 */
export interface DialogOptions {
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
    position: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent;
    content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult);
    width?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}
/**
 * Dialog service for centralized dialog management.
 * Provides a simple API for showing dialogs with optional custom components.
 */
export declare class DialogService {
    private static instance;
    private static DEFAULT_OPTIONS;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): DialogService;
    /**
     * Show a confirmation dialog
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    confirm(options: DialogOptions): Promise<boolean>;
    /**
     * Show a simple confirmation dialog with just a message
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean>;
    /**
     * Show a danger confirmation dialog
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    danger(options: Omit<DialogOptions, 'variant'>): Promise<boolean>;
    /**
     * Show a dialog with custom component content
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    component(content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, 'content' | 'message'>): Promise<boolean>;
    /**
     * Get a centered position for the dialog
     */
    private getCenteredPosition;
}
/**
 * Global dialog utility - provides a quick way to show dialogs
 */
export declare const $dialog: {
    /**
     * Show a confirmation dialog
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    confirm: (options: DialogOptions) => Promise<boolean>;
    /**
     * Show a simple confirmation dialog with just a message
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    ask: (message: string, event?: MouseEvent | TouchEvent) => Promise<boolean>;
    /**
     * Show a danger confirmation dialog
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    danger: (options: Omit<DialogOptions, "variant">) => Promise<boolean>;
    /**
     * Show a dialog with custom component content
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    component: (content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, "content" | "message">) => Promise<boolean>;
};
export default DialogService;

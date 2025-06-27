import { TemplateResult } from 'lit';
/**
 * Dialog service options interface with component support
 */
export interface DialogOptions {
    title?: string;
    subtitle?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
    confirmColor?: 'primary' | 'error' | 'warning' | 'success';
    position?: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent;
    content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult);
    width?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
    hideActions?: boolean;
    targetContainer?: HTMLElement;
}
/**
 * Dialog service for centralized dialog management.
 * Provides a simple API for showing dialogs with optional custom components.
 */
export declare class DialogService {
    private static instance;
    private static DEFAULT_OPTIONS;
    private activeDialogs;
    private activeRawDialogs;
    private dialogSubject;
    private dismissSubject;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): DialogService;
    /**
     * Sets up the main dialog opening logic using RxJS pipes
     */
    private setupDialogOpeningLogic;
    /**
     * Sets up the dialog dismissal logic
     */
    private setupDialogDismissLogic;
    /**
     * Show a confirmation dialog
     * @returns Promise that resolves to true (confirm) or false (cancel)
     */
    confirm(options: DialogOptions): Promise<boolean>;
    /**
     * Show a dialog with custom component content
     * Always renders content directly without any headers or action buttons
     * @returns Promise that resolves when dialog is closed
     */
    component(content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, 'content' | 'message'>): Promise<boolean>;
    /**
     * Dismiss the most recently opened dialog (either confirm or component type)
     * @returns true if a dialog was dismissed, false if no dialogs were open
     */
    dismiss(): boolean;
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
     * @returns Promise that resolves when dialog is closed
     */
    component: (content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, "content" | "message">) => Promise<boolean>;
    /**
     * Show a simple dialog without title or actions, just content
     * This is an alias for component() since all component dialogs are now simple by design
     * @returns Promise that resolves when dialog is closed
     */
    simple: (content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, "content" | "message" | "title" | "confirmText" | "cancelText">) => Promise<boolean>;
    /**
     * Dismiss the most recently opened dialog
     * @returns true if a dialog was dismissed, false if no dialogs were open
     */
    dismiss: () => boolean;
};
export default DialogService;

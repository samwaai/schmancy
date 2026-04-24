import { TemplateResult } from 'lit';
/**
 * Dialog service options interface
 */
export interface DialogOptions {
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
    content?: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult);
    onConfirm?: () => void;
    onCancel?: () => void;
    hideActions?: boolean;
    targetContainer?: HTMLElement;
}
/**
 * Prompt dialog options
 */
export interface PromptOptions {
    title?: string;
    message?: string;
    label?: string;
    placeholder?: string;
    defaultValue?: string;
    inputType?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    confirmText?: string;
    cancelText?: string;
    position?: {
        x: number;
        y: number;
    } | MouseEvent | TouchEvent;
}
/**
 * Dialog service for centralized dialog management.
 * Uses a single unified SchmancyDialog component for all dialog types.
 */
export declare class DialogService {
    private static instance;
    private static DEFAULT_OPTIONS;
    private activeDialogs;
    private dialogSubject;
    private dismissSubject;
    private lastClickPosition;
    private clickTrackingInitialized;
    private constructor();
    private setupClickPositionTracking;
    static getInstance(): DialogService;
    private setupDialogOpeningLogic;
    private setupDialogDismissLogic;
    confirm(options: DialogOptions): Promise<boolean>;
    component(content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, 'content' | 'message'>): Promise<boolean>;
    dismiss(): boolean;
    close(): boolean;
    ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean>;
    danger(options: Omit<DialogOptions, 'variant'>): Promise<boolean>;
    /**
     * Shows a prompt dialog with an input field.
     * Returns the input value if confirmed, null if cancelled.
     */
    prompt(options: PromptOptions): Promise<string | null>;
    private getDefaultPosition;
}
/**
 * Global dialog utility. Imperative modal API — open any element as a dialog,
 * or use the built-in `confirm` / `ask` / `danger` prompts. Returns Promises
 * that resolve when the user picks an action.
 *
 * @service
 * @summary Imperative modal dialogs and built-in confirm/ask/danger prompts.
 * @method confirm(options: DialogOptions) - Built-in confirm prompt. Returns Promise<boolean>.
 * @method ask(message, event?) - One-line yes/no prompt anchored to the triggering event.
 * @method danger(options) - Destructive-action confirm styled with the error palette.
 * @method component(element, options?) - Open any element as a modal.
 * @method dismiss(id?) - Dismiss a dialog by id, or the topmost dialog.
 */
export declare const $dialog: {
    confirm: (options: DialogOptions) => Promise<boolean>;
    ask: (message: string, event?: MouseEvent | TouchEvent) => Promise<boolean>;
    danger: (options: Omit<DialogOptions, "variant">) => Promise<boolean>;
    prompt: (options: PromptOptions) => Promise<string | null>;
    component: (content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, "content" | "message">) => Promise<boolean>;
    dismiss: () => boolean;
    close: () => boolean;
};
export default DialogService;

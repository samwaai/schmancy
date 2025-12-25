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
 * Dialog service for centralized dialog management.
 * Uses a single unified SchmancyDialog component for all dialog types.
 */
export declare class DialogService {
    private static instance;
    private static DEFAULT_OPTIONS;
    private activeDialogs;
    private dialogSubject;
    private dismissSubject;
    private constructor();
    static getInstance(): DialogService;
    private setupDialogOpeningLogic;
    private setupDialogDismissLogic;
    confirm(options: DialogOptions): Promise<boolean>;
    component(content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, 'content' | 'message'>): Promise<boolean>;
    dismiss(): boolean;
    close(): boolean;
    ask(message: string, event?: MouseEvent | TouchEvent): Promise<boolean>;
    danger(options: Omit<DialogOptions, 'variant'>): Promise<boolean>;
    private getCenteredPosition;
}
/**
 * Global dialog utility
 */
export declare const $dialog: {
    confirm: (options: DialogOptions) => Promise<boolean>;
    ask: (message: string, event?: MouseEvent | TouchEvent) => Promise<boolean>;
    danger: (options: Omit<DialogOptions, "variant">) => Promise<boolean>;
    component: (content: TemplateResult | HTMLElement | (() => HTMLElement | TemplateResult), options?: Omit<DialogOptions, "content" | "message">) => Promise<boolean>;
    dismiss: () => boolean;
    close: () => boolean;
};
export default DialogService;

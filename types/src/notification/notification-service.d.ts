import { NotificationOptions } from './notification-container';
/**
 * Notification service for centralized notification management.
 * Provides a simple API for showing notifications.
 */
export declare class NotificationService {
    private static instance;
    private constructor();
    /**
     * Get the singleton instance
     */
    static getInstance(): NotificationService;
    /**
     * Show a notification
     * @returns The ID of the created notification
     */
    notify(options: NotificationOptions): string;
    /**
     * Show an info notification
     */
    info(message: string, options?: Partial<Omit<NotificationOptions, 'message' | 'type'>>): string;
    /**
     * Show a success notification
     */
    success(message: string, options?: Partial<Omit<NotificationOptions, 'message' | 'type'>>): string;
    /**
     * Show a warning notification
     */
    warning(message: string, options?: Partial<Omit<NotificationOptions, 'message' | 'type'>>): string;
    /**
     * Show an error notification
     */
    error(message: string, options?: Partial<Omit<NotificationOptions, 'message' | 'type'>>): string;
}
/**
 * Global notification utility - provides a quick way to show notifications
 */
export declare const $notify: {
    /**
     * Show a notification
     */
    show: (options: NotificationOptions) => string;
    /**
     * Show an info notification
     */
    info: (message: string, options?: Partial<Omit<NotificationOptions, "message" | "type">>) => string;
    /**
     * Show a success notification
     */
    success: (message: string, options?: Partial<Omit<NotificationOptions, "message" | "type">>) => string;
    /**
     * Show a warning notification
     */
    warning: (message: string, options?: Partial<Omit<NotificationOptions, "message" | "type">>) => string;
    /**
     * Show an error notification
     */
    error: (message: string, options?: Partial<Omit<NotificationOptions, "message" | "type">>) => string;
};
export default NotificationService;

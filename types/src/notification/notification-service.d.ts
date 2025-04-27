import { NotificationOptions } from './notification-container';
/**
 * Notification service for centralized notification management.
 * Provides a simple API for showing notifications.
 */
export declare class NotificationService {
    private static instance;
    private static DEFAULT_OPTIONS;
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
    /**
     * Show a notification with a custom duration
     */
    customDuration(message: string, duration: number, options?: Partial<Omit<NotificationOptions, 'message' | 'duration'>>): string;
    /**
     * Show a persistent notification (won't auto-dismiss)
     */
    persistent(message: string, options?: Partial<Omit<NotificationOptions, 'message' | 'duration'>>): string;
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
    /**
     * Show a notification with a custom duration
     * @param message The notification message
     * @param duration Duration in milliseconds before auto-dismissing (0 for no auto-dismiss)
     * @param options Additional notification options
     */
    customDuration: (message: string, duration: number, options?: Partial<Omit<NotificationOptions, "message" | "duration">>) => string;
    /**
     * Show a persistent notification that won't auto-dismiss
     */
    persistent: (message: string, options?: Partial<Omit<NotificationOptions, "message" | "duration">>) => string;
};
export default NotificationService;

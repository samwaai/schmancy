import { NotificationType } from './notification';
export interface NotificationItem {
    id: string;
    title: string;
    message: string;
    type: NotificationType;
    duration: number;
    closable: boolean;
    playSound: boolean;
}
export interface NotificationOptions {
    id?: string;
    title?: string;
    message: string;
    type?: NotificationType;
    duration?: number;
    closable?: boolean;
    playSound?: boolean;
}
declare const SchmancyNotificationContainer_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Container component for displaying stacked notifications.
 *
 * @element sch-notification-container
 */
export default class SchmancyNotificationContainer extends SchmancyNotificationContainer_base {
    position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    maxVisibleNotifications: number;
    playSound: boolean;
    audioVolume: number;
    private _notifications;
    private _audioService;
    connectedCallback(): void;
    addNotification(options: NotificationOptions): string;
    removeNotification(id: string): void;
    private _handleClose;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-notification-container': SchmancyNotificationContainer;
    }
}
export {};

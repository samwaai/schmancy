import { SchmancyNotification } from './notification';
export type TNotification = 'success' | 'error' | 'warning' | 'info';
export type TNotificationConfig = {
    duration?: number;
    referenceElement?: HTMLElement;
};
export declare function notify(type: TNotification, message: string, config?: TNotificationConfig): Promise<SchmancyNotification>;
export declare const $notify: {
    success: (message: string, config?: TNotificationConfig) => Promise<SchmancyNotification>;
    error: (message: string, config?: TNotificationConfig) => Promise<SchmancyNotification>;
    warning: (message: string, config?: TNotificationConfig) => Promise<SchmancyNotification>;
    info: (message: string, config?: TNotificationConfig) => Promise<SchmancyNotification>;
};

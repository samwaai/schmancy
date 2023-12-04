import { SchmancyNotification } from './notification';
export type TNotification = 'success' | 'error' | 'warning' | 'info';
export type TNotificationConfig = {
    action?: typeof Function;
    duration?: number;
};
export declare const $notify: {
    success: (message: string, config?: TNotificationConfig) => SchmancyNotification;
    error: (message: string, config?: TNotificationConfig) => SchmancyNotification;
    warning: (message: string, config?: TNotificationConfig) => SchmancyNotification;
    info: (message: string, config?: TNotificationConfig) => SchmancyNotification;
};

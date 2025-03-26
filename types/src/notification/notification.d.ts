import { PropertyValues } from 'lit';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';
declare const SchmancyNotification_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @fires close - When notification is closed
 */
export default class SchmancyNotification extends SchmancyNotification_base {
    title: string;
    message: string;
    type: NotificationType;
    closable: boolean;
    duration: number;
    id: string;
    playSound: boolean;
    private _visible;
    private _progress;
    private _hovered;
    private _closing;
    private _autoCloseTimer?;
    private _progressTimer?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    updated(changedProps: PropertyValues): void;
    private _startAutoCloseTimer;
    private _clearTimers;
    private _pauseTimers;
    private _resumeTimers;
    private _playSound;
    private _handleMouseEnter;
    private _handleMouseLeave;
    close(): void;
    render(): import("lit-html").TemplateResult<1>;
    private _getTypeStyles;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-notification': SchmancyNotification;
    }
}
export {};

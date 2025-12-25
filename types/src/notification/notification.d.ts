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
    showProgress: boolean;
    startPosition: {
        x: number;
        y: number;
    };
    private _visible;
    private _progress;
    private _hovered;
    private _closing;
    private paused$;
    private startTime;
    private pausedAt;
    private elapsedBeforePause;
    connectedCallback(): void;
    private animateIn;
    private setupAutoClose;
    private setupProgressUpdates;
    private _playSound;
    private _handleMouseEnter;
    private _handleMouseLeave;
    close(): Promise<void>;
    private _getEmoji;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-notification': SchmancyNotification;
    }
}
export {};

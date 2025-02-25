export type NotificationType = 'success' | 'error' | 'warning' | 'info';
declare const SchmancyNotification_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyNotification extends SchmancyNotification_base {
    type: NotificationType;
    render(): import("lit-html").TemplateResult<1>;
    private handleClose;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-notification': SchmancyNotification;
    }
}
export {};

declare const SchmancyNotification_base: any;
export declare class SchmancyNotification extends SchmancyNotification_base {
    type: 'success' | 'error' | 'warning' | 'info';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-notification': SchmancyNotification;
    }
}
export {};

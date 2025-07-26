declare const SchmancyNotificationOutlet_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyNotificationOutlet extends SchmancyNotificationOutlet_base {
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-notification-outlet': SchmancyNotificationOutlet;
    }
}
export {};

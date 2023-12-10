declare const SchmancyNotificationOutlet_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyNotificationOutlet extends SchmancyNotificationOutlet_base {
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-notification-outlet': SchmancyNotificationOutlet;
    }
}
export {};

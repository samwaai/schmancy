declare const SchmancyNotification_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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

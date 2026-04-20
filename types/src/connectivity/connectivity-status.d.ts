declare const SchmancyConnectivityStatus_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-connectivity-status
 * A beautiful connectivity status component that monitors online/offline state
 * and shows subtle animated banners when connectivity changes.
 *
 * @example
 * <!-- Add once to your app root -->
 * <schmancy-connectivity-status></schmancy-connectivity-status>
 */
export declare class SchmancyConnectivityStatus extends SchmancyConnectivityStatus_base {
    private bannerRef;
    private surfaceRef;
    private iconRef;
    private messageRef;
    connectedCallback(): void;
    private updateBanner;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-connectivity-status': SchmancyConnectivityStatus;
    }
}
export {};

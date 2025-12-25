declare const SchmancyQRScanner_base: CustomElementConstructor & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export declare class SchmancyQRScanner extends SchmancyQRScanner_base {
    continuous: boolean;
    private hasPermission;
    private error;
    private showSuccess;
    private stream;
    private destroy$;
    private videoElement;
    connectedCallback(): void;
    private startCamera;
    private stopCamera;
    private startScanning;
    private scanFrame;
    private handleScanResult;
    private showSuccessFlash;
    private playSuccessSound;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-qr-scanner': SchmancyQRScanner;
    }
}
export {};

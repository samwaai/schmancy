declare const SchmancyContainer_base: import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement>;
export declare class SchmancyContainer extends SchmancyContainer_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-container': SchmancyContainer;
    }
}
export {};

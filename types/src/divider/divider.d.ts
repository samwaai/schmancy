declare const SchmancyDivider_base: import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement>;
export default class SchmancyDivider extends SchmancyDivider_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-divider': SchmancyDivider;
    }
}
export {};

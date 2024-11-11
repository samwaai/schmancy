declare const SchmancyMenuItem_base: CustomElementConstructor & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancyMenuItem extends SchmancyMenuItem_base {
    connectedCallback(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu-item': SchmancyMenuItem;
    }
}
export {};

declare const SchmancyMenuItem_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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

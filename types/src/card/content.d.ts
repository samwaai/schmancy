declare const SchmancyCardContent_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-card-content
 */
export default class SchmancyCardContent extends SchmancyCardContent_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-content': SchmancyCardContent;
    }
}
export {};

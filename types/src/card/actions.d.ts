declare const SchmancyCardMedia_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-card-action
 * @slot - The content of the action
 */
export default class SchmancyCardMedia extends SchmancyCardMedia_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-action': SchmancyCardMedia;
    }
}
export {};

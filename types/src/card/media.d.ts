declare const SchmancyCardMedia_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @element schmancy-card-media
 */
export default class SchmancyCardMedia extends SchmancyCardMedia_base {
    src: string;
    fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-media': SchmancyCardMedia;
    }
}
export {};

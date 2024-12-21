declare const SchmancyCardMedia_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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

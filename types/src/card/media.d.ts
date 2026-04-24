declare const SchmancyCardMedia_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Media region of a schmancy-card — the image / thumbnail at the top of the card.
 *
 * @element schmancy-card-media
 * @summary Always nested inside schmancy-card. Pass `src` + `alt` props or slot an `<img>` / `<video>` for custom media.
 * @example
 * <schmancy-card-media src="/thumb.jpg" alt="Product photo"></schmancy-card-media>
 * @platform img - Renders an `<img>` (or wraps a slotted media element). Degrades to a styled `<img>` if the tag never registers.
 */
export default class SchmancyCardMedia extends SchmancyCardMedia_base {
    src: string;
    fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    alt: string;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-media': SchmancyCardMedia;
    }
}
export {};

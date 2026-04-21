declare const SchmancySkeleton_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Placeholder shimmer surface shown while content loads. Renders a
 * shape-configurable rectangle with a reduced-motion-aware shimmer.
 *
 * @element schmancy-skeleton
 * @attr shape - 'rect' | 'circle' | 'text'. Default 'rect'.
 * @attr width  - CSS length (e.g. `100%`, `12rem`).
 * @attr height - CSS length; for `shape=text` defaults to 1em.
 * @attr radius - CSS length for corner radius; ignored for `shape=circle`.
 * @csspart surface - The shimmering surface element.
 */
export declare class SchmancySkeleton extends SchmancySkeleton_base {
    shape: 'rect' | 'circle' | 'text';
    width: string;
    height: string;
    radius: string;
    connectedCallback(): void;
    protected updated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-skeleton': SchmancySkeleton;
    }
}
export {};

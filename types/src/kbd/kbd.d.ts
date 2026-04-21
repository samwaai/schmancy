declare const SchmancyKbd_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Renders a keyboard shortcut hint (e.g. `⌘ K`, `Ctrl+C`). Semantically a
 * `<kbd>` element for screen readers; visually styled as a pressed key.
 *
 * Compose multiple instances for combinations:
 * ```html
 * <schmancy-kbd>⌘</schmancy-kbd> + <schmancy-kbd>K</schmancy-kbd>
 * ```
 *
 * @element schmancy-kbd
 * @slot - The key label (e.g. `⌘`, `Shift`, `K`).
 * @attr size - 'sm' | 'md'. Default 'md'.
 * @csspart base - The inner native `<kbd>` element.
 */
export declare class SchmancyKbd extends SchmancyKbd_base {
    size: 'sm' | 'md';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-kbd': SchmancyKbd;
    }
}
export {};

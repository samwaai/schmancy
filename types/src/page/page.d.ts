import '../layout/scroll/scroll';
declare const SchmancyPage_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Native mobile-like page container.
 * Prevents double-tap zoom, pull-to-refresh, rubber-banding.
 *
 * @element schmancy-page
 *
 * @example
 * html`
 *   <schmancy-page rows="1fr_2fr_auto">
 *     <header>App Bar</header>
 *     <main>Scrollable content</main>
 *     <footer>Navigation</footer>
 *   </schmancy-page>
 * `
 */
export declare class SchmancyPage extends SchmancyPage_base {
    /** Custom grid-template-rows using underscores (e.g. "1fr_2fr_auto") */
    rows: string;
    showScrollbar: boolean;
    noSelect: boolean;
    connectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-page': SchmancyPage;
    }
}
export {};

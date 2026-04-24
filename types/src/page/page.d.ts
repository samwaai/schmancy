import '../layout/scroll/scroll';
declare const SchmancyPage_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Mobile-first page container — fills remaining viewport height, suppresses double-tap zoom / pull-to-refresh / rubber-banding. Lays children in a CSS grid whose row template is `rows`.
 *
 * @element schmancy-page
 * @summary The root of any app view — wraps header / main / footer children in a full-viewport grid. Use rows="auto_1fr_auto" to make the middle child scroll while header/footer stay pinned.
 * @example
 * <schmancy-page rows="auto_1fr_auto">
 *   <schmancy-nav-drawer-appbar>Title</schmancy-nav-drawer-appbar>
 *   <main>Scrollable content</main>
 *   <schmancy-navigation-bar></schmancy-navigation-bar>
 * </schmancy-page>
 * @platform div - Full-height CSS-grid container. Degrades to a plain div if the tag never registers — children still flow vertically but without the height fill and gesture suppression.
 */
export declare class SchmancyPage extends SchmancyPage_base {
    /** Custom grid-template-rows using underscores (e.g. "1fr_2fr_auto") */
    rows: string;
    showScrollbar: boolean;
    noSelect: boolean;
    private heightDisconnecting$;
    private calculateHeight;
    private applyHeight;
    private setupHeightStream;
    connectedCallback(): void;
    disconnectedCallback(): void;
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-page': SchmancyPage;
    }
}
export {};

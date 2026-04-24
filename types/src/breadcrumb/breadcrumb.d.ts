declare const SchmancyBreadcrumb_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Breadcrumb trail — navigation history from root to current page. Renders schmancy-breadcrumb-item children with separators between.
 *
 * @element schmancy-breadcrumb
 * @summary Use for deep hierarchical navigation (file explorer paths, e-commerce category chains, admin settings trees). Last item is styled as the current page automatically.
 * @example
 * <schmancy-breadcrumb separator="›">
 *   <schmancy-breadcrumb-item href="/">Home</schmancy-breadcrumb-item>
 *   <schmancy-breadcrumb-item href="/docs">Docs</schmancy-breadcrumb-item>
 *   <schmancy-breadcrumb-item>Getting started</schmancy-breadcrumb-item>
 * </schmancy-breadcrumb>
 * @platform nav - Styled `<nav aria-label="Breadcrumb">`. Degrades to a plain nav if the tag never registers.
 * @slot - Default slot for `<schmancy-breadcrumb-item>` children.
 * @attr separator - Character or string rendered between items. Default `/`.
 * @csspart separator - The separator element.
 */
export declare class SchmancyBreadcrumb extends SchmancyBreadcrumb_base {
    separator: string;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
    private _insertSeparators;
}
declare const SchmancyBreadcrumbItem_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Single segment in a schmancy-breadcrumb trail — a link when `href` is set, or a plain span (the current page) when omitted.
 *
 * @element schmancy-breadcrumb-item
 * @summary Always nested inside schmancy-breadcrumb. Omit `href` on the current page — it gets aria-current="page" automatically.
 * @example
 * <schmancy-breadcrumb-item href="/products">Products</schmancy-breadcrumb-item>
 * @platform a - Renders an `<a>` or `<span>` depending on href. Degrades to a plain anchor/span if the tag never registers.
 * @slot - Label content.
 * @attr href - If set, renders as an anchor.
 * @attr current - Marks as `aria-current="page"`.
 */
export declare class SchmancyBreadcrumbItem extends SchmancyBreadcrumbItem_base {
    href: string;
    current: boolean;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-breadcrumb': SchmancyBreadcrumb;
        'schmancy-breadcrumb-item': SchmancyBreadcrumbItem;
    }
}
export {};

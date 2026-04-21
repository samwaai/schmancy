declare const SchmancyBreadcrumb_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Breadcrumb navigation container. Wraps a list of `schmancy-breadcrumb-item`
 * elements with the correct ARIA landmark and semantics.
 *
 * @element schmancy-breadcrumb
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
 * Individual breadcrumb item. Renders as a link when `href` is provided,
 * otherwise as a plain span (represents the current page).
 *
 * @element schmancy-breadcrumb-item
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

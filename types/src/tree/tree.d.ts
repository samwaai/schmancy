declare const SchmancyTree_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-tree
 * @slot root - The root element of the tree
 * @slot - The children of the tree
 */
export declare class SchmancyTree extends SchmancyTree_base {
    /**
     * Whether the tree’s children are visible
     */
    open: boolean;
    toggler: HTMLSlotElement;
    defaultSlot: HTMLSlotElement;
    chevron: HTMLElement;
    private readonly _a11yId;
    private get _contentId();
    /** ElementInternals — broadcasts `:state(open)` for consumer CSS. */
    private readonly _internals;
    updated(changed: Map<string, unknown>): void;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tree': SchmancyTree;
    }
}
export {};

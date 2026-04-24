declare const SchmancyTree_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Expandable tree node — a recursive disclosure widget. One root slot, one default slot for child nodes. Each node can itself contain schmancy-tree children.
 *
 * @element schmancy-tree
 * @summary Use for hierarchical navigation / file-explorer layouts. Each level is a schmancy-tree with a `root` slot (the parent label) and default slot (the children, which may be more schmancy-trees).
 * @example
 * <schmancy-tree>
 *   <schmancy-list-item slot="root">src/</schmancy-list-item>
 *   <schmancy-tree>
 *     <schmancy-list-item slot="root">components/</schmancy-list-item>
 *     <schmancy-list-item>button.ts</schmancy-list-item>
 *   </schmancy-tree>
 * </schmancy-tree>
 * @platform details toggle - Recursive `<details>`-like disclosure. Degrades to a plain nested list if the tag never registers — loses expand/collapse but stays navigable.
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

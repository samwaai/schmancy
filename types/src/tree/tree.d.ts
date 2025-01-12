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
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tree': SchmancyTree;
    }
}
export {};

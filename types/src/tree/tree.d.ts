declare const SchmancyTree_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tree': SchmancyTree;
    }
}
export {};

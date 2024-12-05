declare const SchmancyTree_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
/**
 * @element schmancy-tree
 * @slot root - The root element of the tree
 * @slot - The children of the tree
 */
export default class SchmancyTree extends SchmancyTree_base {
    open: boolean;
    active: boolean;
    toggler: HTMLSlotElement;
    defaultSlot: HTMLSlotElement;
    chevron: HTMLSpanElement;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tree': SchmancyTree;
    }
}
export {};

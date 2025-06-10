declare const SchmancyCodePreview_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-code-preview
 * A component that shows code and its rendered preview side by side
 * Takes the content as a slot and displays both the source and rendered result
 */
export declare class SchmancyCodePreview extends SchmancyCodePreview_base {
    /**
     * Programming language for syntax highlighting
     */
    language: string;
    /**
     * Show code on top or side-by-side
     */
    layout: 'vertical' | 'horizontal';
    private slotContent;
    connectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-code-preview': SchmancyCodePreview;
    }
}
export {};

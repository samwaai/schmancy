declare const SchmancyCode_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-code
 * Code highlighting component using highlight.js with default theme
 */
export declare class SchmancyCode extends SchmancyCode_base {
    /**
     * Programming language for syntax highlighting
     */
    language: string;
    /**
     * Code content to highlight
     */
    code: string;
    /**
     * Optional filename or title to display in header
     */
    filename?: string;
    /**
     * Show line numbers
     */
    lineNumbers: boolean;
    /**
     * Show copy button
     */
    copyButton: boolean;
    /**
     * Highlighted line numbers (comma-separated or ranges like "1-3,5,7-9")
     */
    highlightLines?: string;
    /**
     * Maximum height before scrolling
     */
    maxHeight?: string;
    private copied;
    private get highlightedCode();
    private escapeHtml;
    private getHighlightedLines;
    private addLineFeatures;
    private copyCode;
    private getLanguageLabel;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-code': SchmancyCode;
    }
}
export {};

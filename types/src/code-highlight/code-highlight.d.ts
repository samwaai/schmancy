declare const SchmancyCode_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-code
 * Code highlighting component using highlight.js with Schmancy dark theme
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
    private copied;
    private get highlightedCode();
    private addLineNumbers;
    private copyCode;
    private getLanguageLabel;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-code': SchmancyCode;
    }
}
export {};

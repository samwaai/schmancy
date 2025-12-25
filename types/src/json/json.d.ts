declare const SchmancyJson_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyJson extends SchmancyJson_base {
    data: Record<string, any>;
    highlightKeys: string[];
    compact: boolean;
    private highlightChanges;
    private copyJSON;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-json': SchmancyJson;
    }
}
export {};

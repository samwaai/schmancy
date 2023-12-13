declare const SchmancyListItem_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export declare class SchmancyListItem extends SchmancyListItem_base {
    readonly: boolean;
    private leading;
    private trailing;
    protected get imgClasses(): string[];
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-list-item': SchmancyListItem;
    }
}
export {};

export type SchmancyRangeChangeEvent = CustomEvent<{
    value: number;
}>;
declare const SchmancyRange_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-range
 * Range input (numeric slider).
 * @fires change - Fires on value change with { value: number }
 */
export declare class SchmancyRange extends SchmancyRange_base {
    min: number;
    max: number;
    step: number;
    value: number;
    label?: string;
    disabled: boolean;
    private get progress();
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-range': SchmancyRange;
    }
}
export {};

declare const SchmancyDivider_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Thin horizontal (or vertical) separator rule between sections of content.
 *
 * @element schmancy-divider
 * @summary Semantic separator between groups — list items, menu sections, content blocks. Uses outline theme token.
 * @example
 * <schmancy-list-item>First</schmancy-list-item>
 * <schmancy-divider></schmancy-divider>
 * <schmancy-list-item>Second</schmancy-list-item>
 * @platform hr - Styled horizontal rule. Degrades to a native `<hr>` if the tag never registers.
 */
export default class SchmancyDivider extends SchmancyDivider_base {
    outline: 'default' | 'variant';
    vertical: boolean;
    grow: 'start' | 'end' | 'both';
    /**
     * @deprecated Use `vertical` property instead. Will be removed in next major version.
     */
    set orientation(value: 'horizontal' | 'vertical');
    get orientation(): 'horizontal' | 'vertical';
    protected render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-divider': SchmancyDivider;
    }
}
export {};

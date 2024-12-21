import { TSurfaceColor } from '@schmancy/types/surface';
declare const List_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * @slot - The default slot.
 */
export declare class List extends List_base {
    /**
     * The type of list.
     * @attr type
     * @type {SchmancyListType}
     * @default 'surface'
     */
    surface: TSurfaceColor;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-list': List;
    }
}
export {};

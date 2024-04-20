import { TSurfaceColor } from '@schmancy/types/surface';
declare const List_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
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

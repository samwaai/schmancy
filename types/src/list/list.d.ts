import { TSurfaceColor } from '@schmancy/types/surface';
declare const List_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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

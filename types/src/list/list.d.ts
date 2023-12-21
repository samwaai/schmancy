import { SchmancyListType } from './context';
declare const List_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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
    type: SchmancyListType;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-list': List;
    }
}
export {};

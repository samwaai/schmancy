import { SchmancyListType } from './context';
declare const SchmancyListItem_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
/**
 * @element schmancy-list-item
 * @slot leading - leading content
 * @slot trailing - trailing content
 * @slot - default content
 */
export declare class SchmancyListItem extends SchmancyListItem_base {
    variant: SchmancyListType;
    rounded: boolean;
    readonly: boolean;
    selected: boolean;
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

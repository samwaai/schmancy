import { TSurfaceColor } from '@schmancy/types/surface';
declare const SchmancyListItem_base: import("@schmancy/mixin/shared/constructor").Constructor<CustomElementConstructor> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin/shared/constructor").Constructor<import("lit").LitElement> & import("@schmancy/mixin/shared/constructor").Constructor<import("@schmancy/mixin/shared/baseElement").IBaseMixin>;
/**
 * @element schmancy-list-item
 * @slot leading - leading content
 * @slot trailing - trailing content
 * @slot - default content
 */
export declare class SchmancyListItem extends SchmancyListItem_base {
    variant: TSurfaceColor;
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

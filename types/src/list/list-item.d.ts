import { TSurfaceColor } from '@schmancy/types/surface';
declare const SchmancyListItem_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Single row in a schmancy-list — supports leading icon/avatar, main content, trailing actions. Clickable via click event, or used as a schmancy-menu-item's visual base.
 *
 * @element schmancy-list-item
 * @summary Prefer nesting inside schmancy-list for consistent spacing/surface. Use `href` to make the row a navigation target (renders as `<a>`), or a click handler for in-app actions.
 * @example
 * <schmancy-list-item href="/profile">
 *   <schmancy-icon slot="leading">person</schmancy-icon>
 *   Profile
 *   <schmancy-icon slot="trailing">chevron_right</schmancy-icon>
 * </schmancy-list-item>
 * @platform li click - Styled `<li>` or `<a>` depending on `href`. Degrades to a plain list item if the tag never registers.
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

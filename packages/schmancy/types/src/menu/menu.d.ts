declare const SchmancyMenu_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Menu Component
 *
 * CRITICAL: The dialog ONLY renders the raw menu items passed via the default slot.
 * NO <ul> wrapper, NO classes, NO additional markup in the dialog call.
 * The dialog service handles positioning and display - we just pass the pure content.
 *
 * Usage:
 * <schmancy-menu>
 *   <schmancy-button slot="trigger">Open Menu</schmancy-button>
 *   <schmancy-menu-item>Item 1</schmancy-menu-item>
 *   <schmancy-menu-item>Item 2</schmancy-menu-item>
 * </schmancy-menu>
 */
export default class SchmancyMenu extends SchmancyMenu_base {
    private menuSlot;
    private showMenu;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu': SchmancyMenu;
    }
}
export {};

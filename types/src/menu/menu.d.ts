declare const SchmancyMenu_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Floating menu — a trigger button + a list of schmancy-menu-item children that open as a positioned dialog on click.
 *
 * @element schmancy-menu
 * @summary Use for dropdown menus attached to a button or icon — "More actions", "Account", row overflow menus in tables. Clicking a schmancy-menu-item inside auto-dismisses; custom components slotted inside must call `$dialog.dismiss()` themselves.
 * @example
 * <schmancy-menu>
 *   <schmancy-icon-button slot="trigger" aria-label="Actions">
 *     <schmancy-icon>more_vert</schmancy-icon>
 *   </schmancy-icon-button>
 *   <schmancy-menu-item @click=${() => edit()}>Edit</schmancy-menu-item>
 *   <schmancy-menu-item @click=${() => remove()}>Delete</schmancy-menu-item>
 * </schmancy-menu>
 * @platform menu close - Trigger + floating listbox dialog. Degrades to a native `<select>` or inline list if the tag never registers.
 * @slot trigger - Button to open menu (new naming)
 * @slot button - Button to open menu (backward compatible)
 * @slot default - Menu items or any custom component to display in dialog
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

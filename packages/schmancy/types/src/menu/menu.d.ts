declare const SchmancyMenu_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Menu Component
 *
 * CRITICAL: The dialog ONLY renders the raw menu items passed via the default slot.
 * NO <ul> wrapper, NO classes, NO additional markup in the dialog call.
 * The dialog service handles positioning and display - we just pass the pure content.
 *
 * @example Basic menu with auto-dismiss
 * ```typescript
 * <schmancy-menu>
 *   <schmancy-button slot="trigger">Actions</schmancy-button>
 *   <schmancy-menu-item @click=${() => editItem()}>Edit</schmancy-menu-item>
 *   <schmancy-menu-item @click=${() => deleteItem()}>Delete</schmancy-menu-item>
 * </schmancy-menu>
 * ```
 * Note: Dialog auto-dismisses when schmancy-menu-item is clicked
 *
 * @example Custom component (manual dismiss)
 * ```typescript
 * <schmancy-menu>
 *   <schmancy-icon-button slot="trigger">settings</schmancy-icon-button>
 *   <my-settings-form @submit=${() => $dialog.dismiss()}></my-settings-form>
 * </schmancy-menu>
 * ```
 * Note: Custom components must call $dialog.dismiss() manually
 *
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

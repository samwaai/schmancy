declare const SchmancyMenuItem_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Single item inside a schmancy-menu. Auto-dismisses the menu dialog on click — attach your action handler to `@click` and it just works.
 *
 * @element schmancy-menu-item
 * @summary Always nested inside schmancy-menu. The click handler runs before the dialog closes, so `@click=${() => doThing()}` is the full pattern.
 * @example
 * <schmancy-menu-item @click=${() => archive()}>
 *   <schmancy-icon slot="leading">archive</schmancy-icon>
 *   Archive
 * </schmancy-menu-item>
 * @platform menuitem click - Wraps schmancy-list-item with auto-dismiss. Degrades to a styled `<button role="menuitem">` if the tag never registers.
 * @slot - The item label and optional icons.
 */
export default class SchmancyMenuItem extends SchmancyMenuItem_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu-item': SchmancyMenuItem;
    }
}
export {};

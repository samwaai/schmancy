declare const SchmancyCardAction_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Action row of a schmancy-card — holds the card's buttons / links (typically aligned bottom-right).
 *
 * @element schmancy-card-action
 * @summary Always nested inside schmancy-card. Holds the primary + secondary CTAs for the card.
 * @example
 * <schmancy-card-action>
 *   <schmancy-button variant="text">Cancel</schmancy-button>
 *   <schmancy-button variant="filled">Save</schmancy-button>
 * </schmancy-card-action>
 * @platform div - Styled flex container. Degrades to a plain div if the tag never registers.
 * @slot - The content of the action
 */
export default class SchmancyCardAction extends SchmancyCardAction_base {
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-card-action': SchmancyCardAction;
    }
}
export {};

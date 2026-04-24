declare const SchmancyDropdown_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Anchored floating dropdown — a generic "show this content relative to that trigger" primitive. Unlike schmancy-menu (which uses the dialog service and is list-shaped), dropdown is a low-level popover anchored with Floating UI. Use when you want a custom-shaped overlay tied to a specific trigger element without the menu semantics.
 *
 * @element schmancy-dropdown
 * @summary Prefer schmancy-menu for action lists, schmancy-autocomplete for type-ahead, schmancy-tooltip for hover hints. Reach for schmancy-dropdown when none of those fit — custom filters, color pickers, inline forms anchored to a trigger.
 * @example
 * <schmancy-dropdown>
 *   <schmancy-button slot="trigger">Filters</schmancy-button>
 *   <schmancy-dropdown-content>
 *     <schmancy-form>…</schmancy-form>
 *   </schmancy-dropdown-content>
 * </schmancy-dropdown>
 * @platform div - Anchored via Floating UI (autoUpdate, flip, shift). Degrades to inline content if the tag never registers — loses positioning but content stays accessible.
 * @attr open - Boolean; whether the dropdown is visible.
 * @fires open - When the dropdown opens.
 * @fires close - When the dropdown closes.
 * @slot trigger - The element that triggers the dropdown
 * @slot - Default slot for the dropdown content
 */
export declare class SchmancyDropdown extends SchmancyDropdown_base {
    /**
     * Whether the dropdown is currently open
     */
    open: boolean;
    /**
     * Placement of the dropdown relative to the trigger
     */
    placement: 'top' | 'top-start' | 'top-end' | 'right' | 'right-start' | 'right-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'left' | 'left-start' | 'left-end';
    /**
     * Offset distance in pixels
     */
    distance: number;
    triggerContainer: HTMLElement;
    contentContainer: HTMLElement;
    contentElements: HTMLElement[];
    private portal;
    triggerElements: Array<HTMLElement>;
    private cleanupPositioner?;
    private portalSubscriptions;
    connectedCallback(): void;
    /**
     * Set up the portal element for teleporting content
     */
    private setupPortal;
    /**
     * Check if an event originated from within this component
     */
    private isEventFromSelf;
    disconnectedCallback(): void;
    /**
     * Toggle the dropdown open state
     */
    toggle(): void;
    updated(changedProps: Map<string, any>): void;
    /**
     * Setup floating UI positioning with teleportation
     */
    private setupPositioner;
    /**
     * Move slotted content to the portal
     */
    private teleportContentToPortal;
    /**
     * Handle trigger click to toggle dropdown
     */
    private handleTriggerClick;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-dropdown': SchmancyDropdown;
    }
}
export {};

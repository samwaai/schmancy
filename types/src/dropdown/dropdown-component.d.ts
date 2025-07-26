declare const SchmancyDropdown_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A dropdown component that displays content when triggered.
 *
 * @element schmancy-dropdown
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
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-dropdown': SchmancyDropdown;
    }
}
export {};

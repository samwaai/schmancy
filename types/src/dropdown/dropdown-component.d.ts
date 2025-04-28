declare const SchmancyDropdown_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
    content: HTMLElement;
    triggerElements: Array<HTMLElement>;
    private cleanupPositioner?;
    connectedCallback(): void;
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
     * Setup floating UI positioning
     */
    private setupPositioner;
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

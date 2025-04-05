declare const SchmancyTooltip_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-tooltip
 * A tooltip component that displays additional information when hovering or focusing an element.
 *
 * @slot - The default slot for the trigger element
 * @slot content - The content to display in the tooltip
 *
 * @csspart tooltip - The tooltip container element
 * @csspart arrow - The tooltip arrow element
 *
 * @example
 * <schmancy-tooltip>
 *   <div slot="content">Tooltip content here</div>
 *   <schmancy-button>Hover me</schmancy-button>
 * </schmancy-tooltip>
 */
export declare class SchmancyTooltip extends SchmancyTooltip_base {
    /**
     * The placement of the tooltip relative to the trigger element
     * @attr
     */
    placement: 'top' | 'right' | 'bottom' | 'left';
    /**
     * The offset distance from the trigger element in pixels
     * @attr
     */
    distance: number;
    /**
     * The delay before showing the tooltip in milliseconds
     * @attr
     */
    showDelay: number;
    /**
     * The delay before hiding the tooltip in milliseconds
     * @attr
     */
    hideDelay: number;
    /**
     * Whether the tooltip should be shown
     * @attr
     */
    open: boolean;
    /**
     * Whether to disable the tooltip
     * @attr
     */
    disabled: boolean;
    tooltip: HTMLElement;
    triggerContainer: HTMLElement;
    arrow: HTMLElement;
    triggerElements: HTMLElement[];
    private cleanupPositioner?;
    private showTimeoutId?;
    private hideTimeoutId?;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private updatePosition;
    /**
     * Setup the auto-updating position and trigger events
     */
    firstUpdated(): void;
    /**
     * Schedule showing the tooltip with the configured delay
     */
    private scheduleShow;
    /**
     * Schedule hiding the tooltip with the configured delay
     */
    private scheduleHide;
    /**
     * Show the tooltip
     */
    show(): void;
    /**
     * Hide the tooltip
     */
    hide(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tooltip': SchmancyTooltip;
    }
}
export {};

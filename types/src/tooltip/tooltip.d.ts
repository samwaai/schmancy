declare const SchmancyTooltip_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
/**
 * A tooltip component that displays a text tooltip when hovering over content.
 * Addresses shadow DOM limitations by teleporting the tooltip to document.body.
 *
 * @element schmancy-tooltip
 */
export declare class SchmancyTooltip extends SchmancyTooltip_base {
    text: string;
    position: 'top' | 'right' | 'bottom' | 'left';
    delay: number;
    disabled: boolean;
    private visible;
    private triggerElement;
    private tooltipElement;
    private cleanup;
    private showTimeoutId;
    connectedCallback(): void;
    firstUpdated(): void;
    private createTooltipElement;
    private setupEvents;
    disconnectedCallback(): void;
    private showTooltip;
    private hideTooltip;
    private initializePositioning;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-tooltip': SchmancyTooltip;
    }
}
export {};

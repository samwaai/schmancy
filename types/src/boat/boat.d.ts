type BoatState = 'hidden' | 'minimized' | 'expanded';
declare const SchmancyBoat_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind.mixin").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export default class SchmancyBoat extends SchmancyBoat_base {
    get state(): BoatState;
    set state(value: BoatState);
    get lowered(): boolean;
    set lowered(value: boolean);
    private stateChange$;
    private containerRef;
    private contentRef;
    private iconRef;
    private currentAnimation?;
    private readonly ANIMATION_CONFIG;
    private currentState;
    private isContentVisible;
    private isAnimating;
    private isLowered;
    connectedCallback(): void;
    private setupUnifiedPipeline;
    private animateTransition;
    private createAnimations;
    private getStyleForState;
    private getResponsiveWidth;
    private updateExpandedWidth;
    firstUpdated(): void;
    private applyInitialStyles;
    toggleState(): void;
    close(): void;
    disconnectedCallback(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat;
    }
}
export {};

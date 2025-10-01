type BoatState = 'hidden' | 'minimized' | 'expanded';
declare const SchmancyBoat_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyBoat extends SchmancyBoat_base {
    get state(): BoatState;
    set state(value: BoatState);
    id: string;
    get lowered(): boolean;
    set lowered(value: boolean);
    private containerRef;
    private contentRef;
    private iconRef;
    private headerRef;
    private currentAnimation?;
    private readonly ANIMATION_CONFIG;
    private currentState;
    private isContentVisible;
    private isAnimating;
    private isLowered;
    private isDragging;
    private position;
    private anchor;
    connectedCallback(): void;
    private initializePosition;
    private animateToState;
    private performTransition;
    private createAnimations;
    private getStyleForState;
    private getResponsiveWidth;
    private updateExpandedWidth;
    firstUpdated(): void;
    private applyInitialStyles;
    toggleState(): void;
    close(): void;
    private closeAndAddToNav;
    private animateToNavItem;
    private animateFromNavItem;
    private bringToFront;
    private calculateDragPosition;
    private savePosition;
    private setupDragPipeline;
    private updateContainerPosition;
    private updateAnchor;
    disconnectedCallback(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat;
    }
}
export {};

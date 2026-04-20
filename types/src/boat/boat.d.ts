type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
type BoatState = 'collapsed' | 'expanded';
declare const SchmancyBoat_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyBoat extends SchmancyBoat_base {
    id: string;
    icon?: string;
    label?: string;
    /** Override the expanded panel width (e.g. '320px', '24rem'). Defaults to responsive sizing. */
    expandedWidth?: string;
    /** When true, uses a lower elevation shadow in the minimized (FAB) state. */
    lowered: boolean;
    /** Corner the boat is anchored to. */
    corner: Corner;
    /** Whether the panel is open. */
    open: boolean;
    /**
     * State property.
     * Maps 'expanded' → open=true, 'collapsed' → open=false (FAB visible).
     */
    get state(): BoatState;
    set state(val: BoatState);
    private isDragging;
    private _position;
    private _currentCorner;
    private _containerRef;
    private _contentRef;
    private _headerRef;
    private _currentAnimation?;
    private get panelWidth();
    private get isBottomCorner();
    private get closedClipPath();
    private get openClipPath();
    private get elevation();
    private _applyContainerPosition;
    private _loadPosition;
    private _savePosition;
    private _validateBounds;
    private _reorientToNearestCorner;
    private _setupDrag;
    connectedCallback(): void;
    firstUpdated(): void;
    disconnectedCallback(): void;
    private _animateOpen;
    private _animateClose;
    toggle(): void;
    expand(): void;
    /** Alias for expand() — kept for backwards compatibility. */
    show(): void;
    close(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-boat': SchmancyBoat;
    }
}
export {};

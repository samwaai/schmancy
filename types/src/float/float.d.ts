type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
declare const SchmancyFloat_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyFloat extends SchmancyFloat_base {
    id: string;
    /** Override the expanded panel width (e.g. '320px', '24rem'). Defaults to responsive sizing. */
    expandedWidth?: string;
    /** When true, uses a lower elevation shadow in the collapsed state. */
    lowered: boolean;
    /** Corner the float is anchored to. */
    corner: Corner;
    /** Whether the body is expanded. */
    open: boolean;
    private isDragging;
    /** Lazy rendering: body content not in DOM until first expand. */
    private _hasOpened;
    private _position;
    private _currentCorner;
    private _containerRef;
    private _bodyRef;
    private _headRef;
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
    close(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-float': SchmancyFloat;
    }
}
export {};

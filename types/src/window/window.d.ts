import type { SnapCorner, WindowVisualState } from './window-registry.js';
declare const SchmancyWindow_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyWindow extends SchmancyWindow_base {
    id: string;
    /** Override the expanded panel width (e.g. '320px', '24rem'). Defaults to responsive sizing. */
    expandedWidth?: string;
    /** Override the expanded panel height (e.g. '400px', '50vh'). */
    expandedHeight?: string;
    /** When true, uses a lower elevation shadow in the collapsed state. */
    lowered: boolean;
    /** Corner the window is anchored to. */
    corner: SnapCorner;
    /** When true, window can be resized by the user. */
    resizable: boolean;
    /** When true, window stays at its dragged position instead of snapping to a corner. */
    freePosition: boolean;
    /** Visual state of the window (minimized, normal, maximized). */
    visualState: WindowVisualState;
    /** Minimum width in pixels. */
    minWidth: number;
    /** Minimum height in pixels. */
    minHeight: number;
    /** Whether the body is expanded. */
    open: boolean;
    private _currentAnimation?;
    /** Lazy rendering: body content not in DOM until first expand. */
    private _hasOpened;
    /** Whether this window is the focused window in the manager — drives visual ring */
    private _focused;
    private _position;
    private _currentCorner;
    private _appliedCorner;
    private _containerRef;
    private _bodyRef;
    private _headRef;
    private get panelWidth();
    private get isBottomCorner();
    private get closedClipPath();
    private get openClipPath();
    private get elevation();
    private _applyContainerPosition;
    private static readonly VALID_CORNERS;
    private _loadPosition;
    private _savePosition;
    private _validateBounds;
    private _reorientToNearestCorner;
    private _drag$;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private _initDOMState;
    private _animateOpen;
    private _animateClose;
    /** Apply drag visuals directly on DOM refs — avoids full Lit re-render for cursor + opacity */
    private _applyDragVisuals;
    private _handleFocus;
    private _handleHeadKeydown;
    toggle(): void;
    expand(): void;
    close(): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-window': SchmancyWindow;
    }
}
export {};

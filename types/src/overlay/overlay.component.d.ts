import { type TemplateResult } from 'lit';
import type { CloseReason, Content, OverlayLayout, OverlayTier, ShowOptions } from './overlay.types';
declare const SchmancyOverlay_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * The single overlay element. Custom `<div>` shell (not a native
 * `<dialog>`) — one backdrop mechanism for all layouts, one focus-trap
 * path, one animation orchestrator. The shell is always rendered; the
 * backdrop only renders when modal. The surface is positioned per tier:
 *
 * - Modal layouts (centered / sheet) → backdrop + surface, focus-trapped,
 *   library-managed z-index.
 * - Anchored 'css-anchor' tier → surface as `popover="auto"` with
 *   CSS Anchor Positioning; native top-layer + light-dismiss.
 * - Anchored 'popover-fui' tier → surface as `popover="auto"` + Floating
 *   UI position math; native top-layer + light-dismiss.
 * - Anchored 'fui-only' tier → surface positioned by Floating UI;
 *   manual click-outside + manual Esc.
 *
 * Public lifecycle: the service calls `open()` to mount content and
 * animate in, `close(reason)` to animate out and dismiss. The element
 * exposes `closed$` (Observable emitting reason + result once) and
 * `tier` / `layout` / `modal` as properties for the stack entry.
 */
export declare class SchmancyOverlay extends SchmancyOverlay_base {
    layout: OverlayLayout;
    dismissable: boolean;
    modal: boolean;
    tier: OverlayTier;
    private _active;
    private _backdrop?;
    private _surface;
    /** Close trigger for the service; emits the reason + detail payload. */
    private readonly _closed$;
    private _mounted;
    private _closing;
    private _resolvedAnchor?;
    private _rawAnchor?;
    private _anchorOriginAnchor?;
    private _positionerTeardown?;
    private _lastFocusedElement;
    private _inertedSiblings;
    private _lastReResolveAt;
    /** Service subscribes to this to know when the overlay dismissed. */
    get closed$(): import('rxjs').Observable<{
        reason: CloseReason;
        result?: unknown;
    }>;
    /**
     * Mount content and animate in. Called by the service after the
     * element is attached to the DOM. Resolves when the entrance
     * animation completes.
     */
    open(content: Content, options: ShowOptions): Promise<void>;
    /** Play exit animations then dismiss. */
    close(reason: CloseReason, result?: unknown): Promise<void>;
    protected render(): TemplateResult;
    private onBackdropClick;
    private setAnchorOriginVars;
    private wireFocusTrap;
    private releaseFocusTrap;
    private wireCloseTriggers;
    private wireResizeObserver;
    private maybeReResolve;
    private playEnterAnimations;
    private playExitAnimations;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-overlay': SchmancyOverlay;
    }
}
export {};

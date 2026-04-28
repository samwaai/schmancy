import { Observable } from 'rxjs';
import { type ResolvedAnchor } from './overlay.layout';
import type { OverlayPlacement, OverlayTier } from './overlay.types';
/**
 * Three-tier positioning ladder for anchored overlays. Public API of the
 * overlay doesn't change based on the tier — the strategy is picked
 * internally by feature-detection.
 *
 * Tier 1 — CSS Anchor Positioning (Popover + `anchor-name` / `position-anchor`)
 *   Zero-JS position tracking. Chromium-only today.
 *
 * Tier 2 — Popover API + Floating UI
 *   Native top-layer + light-dismiss + Esc from `popover="auto"`, Floating
 *   UI middleware for the position math. Safari 17+, Chrome 114+, Firefox 125+.
 *
 * Tier 3 — Floating UI only
 *   Fallback for browsers without the Popover API. Caller provides manual
 *   backdrop + click-outside + Esc wiring.
 */
/**
 * Feature-detection snapshot captured at module load. Frozen so consumers
 * can safely destructure and compare.
 */
export declare const CAPS: Readonly<{
    popover: boolean;
    cssAnchor: boolean;
}>;
/**
 * Pick the positioning tier for an anchor.
 *
 * CSS Anchor Positioning (Tier 1) requires a real element anchor — you
 * can't point `anchor-name` at a DOMRect or a coord. A point/rect anchor
 * forces Tier 2 (or Tier 3 if popover isn't supported).
 */
export declare function pickPositioner(anchor: ResolvedAnchor): OverlayTier;
/**
 * Set up CSS Anchor Positioning. Assigns a unique `anchor-name` to the
 * anchor element and injects a stylesheet into the shadow root that
 * positions the surface relative to it. No JS running per frame.
 *
 * Returns a cleanup function that removes the injected styles and the
 * anchor-name from the anchor element.
 */
export declare function positionCSSAnchor(surface: HTMLElement, anchor: ResolvedAnchor, shadowRoot: ShadowRoot, opts?: {
    id: string;
    placement?: OverlayPlacement;
}): () => void;
/**
 * Wire the Popover API lifecycle — the surface gets `popover="auto"` and
 * `showPopover()` is called to promote it into the native top layer. No
 * position math here; the caller pairs this with `positionFloatingUI` for
 * the geometry, since Tier 2 is Popover-for-stacking + Floating UI-for-math.
 *
 * Returns a cleanup function that hides the popover and strips the attr.
 */
export declare function positionPopoverAPI(surface: HTMLElement): () => void;
export interface FloatingUIOptions {
    /** Preferred placement; Floating UI's `flip` middleware handles falls. */
    placement?: OverlayPlacement;
    /** Padding used by `shift` + `size` middleware. Defaults to
     *  `ANCHOR_FIT_PADDING_PX` from overlay.layout. */
    padding?: number;
    /** Gap between anchor and surface. Default 8px. */
    offsetPx?: number;
    /** Whether `autoUpdate` should track element resizes. Default true. */
    track?: boolean;
}
/**
 * Floating UI-driven positioning. Returns a cold Observable — subscribe to
 * start positioning, unsubscribe to stop tracking (teardown cancels the
 * `autoUpdate` loop). The caller composes with `takeUntil(this.disconnecting)`:
 *
 *     positionFloatingUI(surface, anchor, opts)
 *       .pipe(takeUntil(this.disconnecting))
 *       .subscribe()
 *
 * Middleware (stack, in order):
 *   offset(opts.offsetPx)
 *   → flip({ fallbackPlacements: [...] })
 *   → shift({ padding: opts.padding })
 *   → size({ apply: clamp maxWidth AND maxHeight from availableWidth/Height })
 *
 * `flip` is chosen over `autoPlacement` because element-anchored overlays
 * should respect the trigger's spatial context (menus shouldn't jump
 * sides). Dialog uses `autoPlacement` because it's point-anchored.
 */
export declare function positionFloatingUI(surface: HTMLElement, anchor: ResolvedAnchor, opts?: FloatingUIOptions): Observable<void>;

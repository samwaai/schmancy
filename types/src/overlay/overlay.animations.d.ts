import type { Anchor, OverlayLayout } from './overlay.types';
/**
 * WAAPI keyframes + options per layout + direction.
 *
 * One animation vocabulary — no per-element bespoke keyframes. Aligns
 * with the `animation` skill (spring physics presets). Every easing runs
 * through `getEasing()` so modern browsers (that support
 * `animation-timing-function: linear(0, 1)`) get the true `linear()`
 * spring expression while older browsers fall through to the cubic-bezier
 * fallback. Honors `prefers-reduced-motion` by collapsing transforms to
 * opacity-only.
 *
 * Anchor-origin bloom: the caller computes
 * `anchorOriginVars(anchor, surfaceRect)` and writes the resulting CSS
 * custom properties onto the surface element BEFORE triggering the
 * entrance animation. Keyframes reference those vars via
 * `transform-origin: var(--schmancy-overlay-origin-x, 50%) var(...)`, so
 * the surface scales OUT of the click point — not from its own centre.
 */
/**
 * Shape matches both DOM `AnimationEffectTiming` and
 * `KeyframeAnimationOptions` so it passes structural checks in both
 * older and newer `lib.dom.d.ts` vintages.
 */
export interface AnimationSpec {
    keyframes: Keyframe[];
    options: {
        duration: number;
        easing: string;
        fill?: FillMode;
    };
}
/**
 * Compute CSS-var values for the anchor-relative transform origin.
 * Caller writes the returned record onto the surface element's style
 * before triggering the entrance animation. When no anchor is present,
 * returns sensible per-layout defaults (caller picks which to use):
 *   - centered → 50% 50% (self-centre)
 *   - sheet    → 50% 100% (rises from bottom edge)
 *   - anchored → computed from the anchor's position relative to the
 *                surface rect
 */
export declare function anchorOriginVars(anchor: Anchor | undefined, surfaceRect: DOMRect | {
    left: number;
    top: number;
    width: number;
    height: number;
}): Record<string, string>;
export declare function backdropAnimation(direction: 'in' | 'out'): AnimationSpec;
export declare function surfaceAnimation(layout: OverlayLayout, direction: 'in' | 'out'): AnimationSpec;
/**
 * FLIP (First / Last / Invert / Play) animation from `before` rect to
 * `after` rect. Caller has already moved the element between the two
 * states; this produces the WAAPI spec that animates the delta back.
 *
 * Used by the ResizeObserver-driven layout re-resolve in the overlay
 * element — when content grows past threshold mid-session and the
 * layout switches from centered → sheet, this animates the transition
 * instead of a hard cut.
 *
 * Reduced-motion collapses to an instant 1ms no-op; caller should check
 * `reducedMotion` (not exported) — or just run this and tolerate the
 * 1ms animation.
 */
export declare function flipAnimation(before: DOMRect | {
    left: number;
    top: number;
    width: number;
    height: number;
}, after: DOMRect | {
    left: number;
    top: number;
    width: number;
    height: number;
}): AnimationSpec;

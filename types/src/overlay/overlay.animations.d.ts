import type { OverlayLayout } from './overlay.types';
/**
 * WAAPI keyframes + options per layout + direction.
 *
 * One animation vocabulary — no per-element bespoke keyframes. Aligns
 * with the `animation` skill (spring physics presets). Honors
 * `prefers-reduced-motion` by collapsing transforms to opacity-only.
 *
 * Returns `null` when reduced-motion is active and only opacity change
 * is needed — the caller sets style directly.
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
export declare function backdropAnimation(direction: 'in' | 'out'): AnimationSpec;
export declare function surfaceAnimation(layout: OverlayLayout, direction: 'in' | 'out'): AnimationSpec;

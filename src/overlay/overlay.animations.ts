import {
	DURATION_BACKDROP,
	DURATION_EXIT,
	EASE_IN,
	EASE_OUT,
	prefersReducedMotion,
	SPRING_GENTLE,
	SPRING_SNAPPY,
} from '../utils/animation'
import type { OverlayLayout } from './overlay.types'

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
	keyframes: Keyframe[]
	options: {
		duration: number
		easing: string
		fill?: FillMode
	}
}

export function backdropAnimation(direction: 'in' | 'out'): AnimationSpec {
	return direction === 'in'
		? {
				keyframes: [{ opacity: 0 }, { opacity: 1 }],
				options: { duration: DURATION_BACKDROP, easing: EASE_OUT, fill: 'forwards' },
			}
		: {
				keyframes: [{ opacity: 1 }, { opacity: 0 }],
				options: { duration: DURATION_BACKDROP, easing: EASE_OUT, fill: 'forwards' },
			}
}

export function surfaceAnimation(layout: OverlayLayout, direction: 'in' | 'out'): AnimationSpec {
	const reduced = prefersReducedMotion()

	if (reduced) {
		// Opacity-only; explicit reset to { opacity: 1, transform: none } on `in`
		// so any leftover transform from a prior `out` doesn't persist.
		return direction === 'in'
			? {
					keyframes: [
						{ opacity: 0, transform: 'none' },
						{ opacity: 1, transform: 'none' },
					],
					options: { duration: 1, easing: 'linear', fill: 'forwards' },
				}
			: {
					keyframes: [
						{ opacity: 1, transform: 'none' },
						{ opacity: 0, transform: 'none' },
					],
					options: { duration: 1, easing: 'linear', fill: 'forwards' },
				}
	}

	switch (layout) {
		case 'centered':
			return direction === 'in'
				? {
						keyframes: [
							{ opacity: 0, transform: 'scale(0.92) translateY(16px)' },
							{ opacity: 1, transform: 'scale(1) translateY(0)' },
						],
						options: {
							duration: SPRING_SNAPPY.duration,
							easing: SPRING_SNAPPY.easingFallback,
							fill: 'forwards',
						},
					}
				: {
						keyframes: [
							{ opacity: 1, transform: 'scale(1) translateY(0)' },
							{ opacity: 0, transform: 'scale(0.96) translateY(8px)' },
						],
						options: { duration: DURATION_EXIT, easing: EASE_IN, fill: 'forwards' },
					}

		case 'sheet':
			return direction === 'in'
				? {
						keyframes: [
							{ opacity: 0, transform: 'translateY(100%)' },
							{ opacity: 1, transform: 'translateY(0)' },
						],
						options: {
							duration: SPRING_GENTLE.duration,
							easing: SPRING_GENTLE.easingFallback,
							fill: 'forwards',
						},
					}
				: {
						keyframes: [
							{ opacity: 1, transform: 'translateY(0)' },
							{ opacity: 0, transform: 'translateY(100%)' },
						],
						options: {
							duration: DURATION_EXIT,
							easing: EASE_IN,
							fill: 'forwards',
						},
					}

		case 'anchored':
			// No transform — CSS Anchor Positioning / Floating UI owns position.
			// Scale-from-origin via transform-origin would be nicer but conflicts
			// with popover top-layer + position. Keep opacity-only for safety.
			return direction === 'in'
				? {
						keyframes: [{ opacity: 0 }, { opacity: 1 }],
						options: {
							duration: SPRING_SNAPPY.duration,
							easing: SPRING_SNAPPY.easingFallback,
							fill: 'forwards',
						},
					}
				: {
						keyframes: [{ opacity: 1 }, { opacity: 0 }],
						options: { duration: DURATION_EXIT, easing: EASE_IN, fill: 'forwards' },
					}
	}
}

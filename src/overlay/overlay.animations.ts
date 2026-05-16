import {
	DURATION_EXIT,
	getEasing,
	SPRING_SMOOTH,
	SPRING_SNAPPY,
} from '../utils/animation'
import { reducedMotion$ } from '../directives/reduced-motion'
import type { Anchor, OverlayLayout } from './overlay.types'

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
	keyframes: Keyframe[]
	options: {
		duration: number
		easing: string
		fill?: FillMode
	}
}

/**
 * Module-scope reduced-motion state, kept in sync with the house
 * `reducedMotion$` BehaviorSubject. The subscribe has no teardown —
 * module lifetime IS the subscription lifetime (house rxjs rule 4:
 * module singletons don't need explicit teardown).
 */
let reducedMotion = reducedMotion$.value
reducedMotion$.subscribe((v) => {
	reducedMotion = v
})

const ORIGIN_X_VAR = '--schmancy-overlay-origin-x'
const ORIGIN_Y_VAR = '--schmancy-overlay-origin-y'
const ORIGIN_CSS = `var(${ORIGIN_X_VAR}, 50%) var(${ORIGIN_Y_VAR}, 50%)`

function clampPercent(value: number): number {
	if (Number.isNaN(value) || !Number.isFinite(value)) return 50
	return Math.max(0, Math.min(100, value))
}

function getAnchorCenter(anchor: Anchor): { x: number; y: number } {
	// Element | VirtualAnchor — anything exposing getBoundingClientRect()
	if (
		typeof (anchor as { getBoundingClientRect?: unknown }).getBoundingClientRect === 'function'
	) {
		const r = (anchor as { getBoundingClientRect(): DOMRect }).getBoundingClientRect()
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
	}
	// DOMRect — has left/top/width/height but no getBoundingClientRect()
	if (
		typeof (anchor as DOMRect).width === 'number' &&
		typeof (anchor as DOMRect).height === 'number' &&
		typeof (anchor as DOMRect).left === 'number' &&
		typeof (anchor as DOMRect).top === 'number'
	) {
		const r = anchor as DOMRect
		return { x: r.left + r.width / 2, y: r.top + r.height / 2 }
	}
	// MouseEvent / PointerEvent
	if (typeof (anchor as MouseEvent).clientX === 'number' && typeof (anchor as MouseEvent).clientY === 'number') {
		const e = anchor as MouseEvent
		return { x: e.clientX, y: e.clientY }
	}
	// TouchEvent
	if (
		typeof (anchor as TouchEvent).touches !== 'undefined' &&
		(anchor as TouchEvent).touches.length > 0
	) {
		const t = (anchor as TouchEvent).touches[0]
		return { x: t.clientX, y: t.clientY }
	}
	// Plain { x, y } point
	const pt = anchor as { x: number; y: number }
	return { x: pt.x, y: pt.y }
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
export function anchorOriginVars(
	anchor: Anchor | undefined,
	surfaceRect: DOMRect | { left: number; top: number; width: number; height: number },
): Record<string, string> {
	if (!anchor) {
		return {
			[ORIGIN_X_VAR]: '50%',
			[ORIGIN_Y_VAR]: '50%',
		}
	}
	const { x, y } = getAnchorCenter(anchor)
	if (!surfaceRect.width || !surfaceRect.height) {
		return {
			[ORIGIN_X_VAR]: '50%',
			[ORIGIN_Y_VAR]: '50%',
		}
	}
	const originX = clampPercent(((x - surfaceRect.left) / surfaceRect.width) * 100)
	const originY = clampPercent(((y - surfaceRect.top) / surfaceRect.height) * 100)
	return {
		[ORIGIN_X_VAR]: `${originX}%`,
		[ORIGIN_Y_VAR]: `${originY}%`,
	}
}

export function surfaceAnimation(layout: OverlayLayout, direction: 'in' | 'out'): AnimationSpec {
	if (reducedMotion) {
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
		case 'sheet':
			return direction === 'in'
				? {
						keyframes: [
							{ opacity: 0, transform: 'translateY(100%)' },
							{ opacity: 1, transform: 'translateY(0)' },
						],
						options: {
							duration: SPRING_SNAPPY.duration,
							easing: getEasing(SPRING_SNAPPY),
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
							easing: getEasing(SPRING_SMOOTH),
							fill: 'forwards',
						},
					}

		case 'anchored':
			// Anchored surfaces get a scale-from-origin treatment too — the
			// positioning strategy (Popover API / CSS Anchor / Floating UI) owns
			// the final placement; the surface merely blooms from the anchor.
			return direction === 'in'
				? {
						keyframes: [
							{ opacity: 0, transform: 'scale(0.85)', transformOrigin: ORIGIN_CSS },
							{ opacity: 1, transform: 'scale(1)', transformOrigin: ORIGIN_CSS },
						],
						options: {
							duration: SPRING_SNAPPY.duration,
							easing: getEasing(SPRING_SNAPPY),
							fill: 'forwards',
						},
					}
				: {
						keyframes: [
							{ opacity: 1, transform: 'scale(1)', transformOrigin: ORIGIN_CSS },
							{ opacity: 0, transform: 'scale(0.92)', transformOrigin: ORIGIN_CSS },
						],
						options: {
							duration: DURATION_EXIT,
							easing: getEasing(SPRING_SMOOTH),
							fill: 'forwards',
						},
					}
	}
}

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
export function flipAnimation(
	before: DOMRect | { left: number; top: number; width: number; height: number },
	after: DOMRect | { left: number; top: number; width: number; height: number },
): AnimationSpec {
	if (reducedMotion) {
		return {
			keyframes: [{ transform: 'none' }, { transform: 'none' }],
			options: { duration: 1, easing: 'linear', fill: 'forwards' },
		}
	}
	const dx = before.left - after.left
	const dy = before.top - after.top
	const sx = after.width > 0 ? before.width / after.width : 1
	const sy = after.height > 0 ? before.height / after.height : 1
	return {
		keyframes: [
			{
				transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`,
				transformOrigin: 'top left',
			},
			{ transform: 'none', transformOrigin: 'top left' },
		],
		options: {
			duration: SPRING_SMOOTH.duration,
			easing: getEasing(SPRING_SMOOTH),
			fill: 'forwards',
		},
	}
}

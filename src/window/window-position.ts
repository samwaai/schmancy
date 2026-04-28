/**
 * Window Position — pure functions for overlap resolution, cascade, and snapping.
 *
 * All functions are stateless: they take window bounds and viewport dimensions,
 * return new bounds. No side effects, no DOM access, no subscriptions.
 *
 * Example:
 *   const projected = { left: 100, top: 400, width: 360, height: 500 }
 *   const neighbors = windowManager.findOverlaps(projected, 'my-id')
 *   const resolved = resolveOverlap(projected, neighbors, { width: 1440, height: 900 })
 *   // → { left: 144, top: 444, width: 360, height: 500 } (cascaded away from conflict)
 */

import type { WindowBounds, WindowRecord } from './window-registry.js'

const HEAD_HEIGHT = 44
const CASCADE_OFFSET = HEAD_HEIGHT
const MAX_CASCADE_ATTEMPTS = 10

/** Check if two rectangles overlap (edges touching does NOT count as overlap) */
export function rectsOverlap(a: WindowBounds, b: WindowBounds): boolean {
	return !(a.left >= b.left + b.width || a.left + a.width <= b.left || a.top >= b.top + b.height || a.top + a.height <= b.top)
}

/**
 * Resolve overlap by cascading diagonally until no conflict.
 * Shifts by (HEAD_HEIGHT, HEAD_HEIGHT) per attempt, clamped to viewport.
 */
export function resolveOverlap(
	candidate: WindowBounds,
	existing: WindowRecord[],
	viewport: { width: number; height: number },
): WindowBounds {
	const bounds = { ...candidate }

	for (let attempt = 0; attempt < MAX_CASCADE_ATTEMPTS; attempt++) {
		const hasOverlap = existing.some(w => rectsOverlap(bounds, w.bounds))
		if (!hasOverlap) break

		bounds.left += CASCADE_OFFSET
		bounds.top += CASCADE_OFFSET
	}

	return clampToViewport(bounds, viewport)
}

/**
 * Clamp bounds so the window stays fully within the viewport.
 */
export function clampToViewport(
	bounds: WindowBounds,
	viewport: { width: number; height: number },
): WindowBounds {
	return {
		width: bounds.width,
		height: bounds.height,
		left: Math.max(0, Math.min(bounds.left, viewport.width - bounds.width)),
		top: Math.max(0, Math.min(bounds.top, viewport.height - bounds.height)),
	}
}

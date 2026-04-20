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

import type { WindowBounds, WindowRecord, SnapCorner } from './window-registry.js'

const HEAD_HEIGHT = 44
const EDGE_GAP = 16
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
	let bounds = { ...candidate }

	for (let attempt = 0; attempt < MAX_CASCADE_ATTEMPTS; attempt++) {
		const hasOverlap = existing.some(w => rectsOverlap(bounds, w.bounds))
		if (!hasOverlap) break

		bounds = {
			...bounds,
			left: bounds.left + CASCADE_OFFSET,
			top: bounds.top + CASCADE_OFFSET,
		}
	}

	return clampToViewport(bounds, viewport)
}

/**
 * Snap window bounds to a corner with standard edge gap.
 */
export function snapToCorner(
	bounds: WindowBounds,
	corner: SnapCorner,
	viewport: { width: number; height: number },
	bottomOffset: number,
): WindowBounds {
	const isRight = corner.includes('right')
	const isBottom = corner.includes('bottom')

	return {
		width: bounds.width,
		height: bounds.height,
		left: isRight ? viewport.width - bounds.width - EDGE_GAP : EDGE_GAP,
		top: isBottom ? viewport.height - bounds.height - EDGE_GAP - bottomOffset : EDGE_GAP,
	}
}

/**
 * Place a window flush beside a neighbor.
 */
export function snapToNeighbor(
	bounds: WindowBounds,
	neighbor: WindowBounds,
	side: 'left' | 'right',
): WindowBounds {
	return {
		...bounds,
		left: side === 'right' ? neighbor.left + neighbor.width + EDGE_GAP : neighbor.left - bounds.width - EDGE_GAP,
		top: neighbor.top,
	}
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

/**
 * Convert corner-relative offset (used by the old float) to absolute viewport bounds.
 */
export function cornerOffsetToAbsolute(
	corner: SnapCorner,
	offset: { x: number; y: number },
	size: { width: number; height: number },
	viewport: { width: number; height: number },
	bottomOffset: number,
): WindowBounds {
	const isRight = corner.includes('right')
	const isBottom = corner.includes('bottom')
	return {
		width: size.width,
		height: size.height,
		left: isRight ? viewport.width - offset.x - size.width : offset.x,
		top: isBottom ? viewport.height - offset.y - size.height - bottomOffset : offset.y,
	}
}

/**
 * Convert absolute viewport bounds back to corner-relative offset.
 */
export function absoluteToCornerOffset(
	corner: SnapCorner,
	bounds: WindowBounds,
	viewport: { width: number; height: number },
	bottomOffset: number,
): { x: number; y: number } {
	const isRight = corner.includes('right')
	const isBottom = corner.includes('bottom')
	return {
		x: isRight ? viewport.width - bounds.left - bounds.width : bounds.left,
		y: isBottom ? viewport.height - bounds.top - bounds.height - bottomOffset : bounds.top,
	}
}

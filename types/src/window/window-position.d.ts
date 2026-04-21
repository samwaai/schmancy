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
import type { WindowBounds, WindowRecord } from './window-registry.js';
/** Check if two rectangles overlap (edges touching does NOT count as overlap) */
export declare function rectsOverlap(a: WindowBounds, b: WindowBounds): boolean;
/**
 * Resolve overlap by cascading diagonally until no conflict.
 * Shifts by (HEAD_HEIGHT, HEAD_HEIGHT) per attempt, clamped to viewport.
 */
export declare function resolveOverlap(candidate: WindowBounds, existing: WindowRecord[], viewport: {
    width: number;
    height: number;
}): WindowBounds;
/**
 * Clamp bounds so the window stays fully within the viewport.
 */
export declare function clampToViewport(bounds: WindowBounds, viewport: {
    width: number;
    height: number;
}): WindowBounds;

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
import type { WindowBounds, WindowRecord, SnapCorner } from './window-registry.js';
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
 * Snap window bounds to a corner with standard edge gap.
 */
export declare function snapToCorner(bounds: WindowBounds, corner: SnapCorner, viewport: {
    width: number;
    height: number;
}, bottomOffset: number): WindowBounds;
/**
 * Place a window flush beside a neighbor.
 */
export declare function snapToNeighbor(bounds: WindowBounds, neighbor: WindowBounds, side: 'left' | 'right'): WindowBounds;
/**
 * Clamp bounds so the window stays fully within the viewport.
 */
export declare function clampToViewport(bounds: WindowBounds, viewport: {
    width: number;
    height: number;
}): WindowBounds;
/**
 * Convert corner-relative offset (used by the old float) to absolute viewport bounds.
 */
export declare function cornerOffsetToAbsolute(corner: SnapCorner, offset: {
    x: number;
    y: number;
}, size: {
    width: number;
    height: number;
}, viewport: {
    width: number;
    height: number;
}, bottomOffset: number): WindowBounds;
/**
 * Convert absolute viewport bounds back to corner-relative offset.
 */
export declare function absoluteToCornerOffset(corner: SnapCorner, bounds: WindowBounds, viewport: {
    width: number;
    height: number;
}, bottomOffset: number): {
    x: number;
    y: number;
};

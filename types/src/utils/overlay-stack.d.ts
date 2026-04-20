/**
 * Global overlay stack manager for coordinating z-index across dialogs, sheets, and windows.
 * Each overlay gets a unique, incrementing z-index to ensure proper stacking.
 *
 * Two modes:
 *   Anonymous (dialogs/sheets): getNextZIndex() / release() — fire-and-forget counter
 *   ID-tracked (windows): assignZIndex(id) / bringToFront(id) / releaseId(id) — per-window stacking
 */
declare class OverlayStackManager {
    private static instance;
    private counter;
    private readonly BASE_Z_INDEX;
    /** ID-tracked z-index assignments for windows */
    private idMap;
    private constructor();
    static getInstance(): OverlayStackManager;
    /**
     * Get the next z-index for a new overlay.
     * Each call increments the counter, so overlays stack in open order.
     */
    getNextZIndex(): number;
    /**
     * Release a z-index when overlay closes.
     * When all overlays close, reset counter to avoid unbounded growth.
     */
    release(): void;
    /**
     * Get current overlay count (for debugging)
     */
    get activeCount(): number;
    /**
     * Assign a z-index to an ID. If already assigned, returns the existing value.
     */
    assignZIndex(id: string): number;
    /**
     * Move a tracked ID to the highest z-index (bring to front).
     * Returns the new z-index.
     */
    bringToFront(id: string): number;
    /**
     * Release a tracked ID's z-index.
     */
    releaseId(id: string): void;
    /**
     * Get the z-index for a tracked ID, or undefined if not tracked.
     */
    getZIndex(id: string): number | undefined;
    /**
     * Get all tracked IDs sorted by z-index (lowest first, front-most last).
     */
    getStackOrder(): string[];
}
export declare const overlayStack: OverlayStackManager;
export {};

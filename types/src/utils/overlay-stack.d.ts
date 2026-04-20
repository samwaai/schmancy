/**
 * Global overlay stack manager for coordinating z-index across dialogs, sheets, etc.
 * Each overlay gets a unique, incrementing z-index to ensure proper stacking.
 */
declare class OverlayStackManager {
    private static instance;
    private counter;
    private readonly BASE_Z_INDEX;
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
}
export declare const overlayStack: OverlayStackManager;
export {};

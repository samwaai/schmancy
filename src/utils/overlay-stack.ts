/**
 * Global overlay stack manager for coordinating z-index across dialogs, sheets, and windows.
 * Each overlay gets a unique, incrementing z-index to ensure proper stacking.
 *
 * Two modes:
 *   Anonymous (dialogs/sheets): getNextZIndex() / release() — fire-and-forget counter
 *   ID-tracked (windows): assignZIndex(id) / bringToFront(id) / releaseId(id) — per-window stacking
 */
class OverlayStackManager {
	private static instance: OverlayStackManager
	private counter = 0
	private readonly BASE_Z_INDEX = 10000

	/** ID-tracked z-index assignments for windows */
	private idMap = new Map<string, number>()

	private constructor() {}

	static getInstance(): OverlayStackManager {
		if (!OverlayStackManager.instance) {
			OverlayStackManager.instance = new OverlayStackManager()
		}
		return OverlayStackManager.instance
	}

	// ── Anonymous mode (dialogs/sheets) ────────────────────────────────

	/**
	 * Get the next z-index for a new overlay.
	 * Each call increments the counter, so overlays stack in open order.
	 */
	getNextZIndex(): number {
		this.counter++
		return this.BASE_Z_INDEX + this.counter
	}

	/**
	 * Release a z-index when overlay closes.
	 * When all overlays close, reset counter to avoid unbounded growth.
	 */
	release(): void {
		this.counter = Math.max(0, this.counter - 1)
	}

	/**
	 * Get current overlay count (for debugging)
	 */
	get activeCount(): number {
		return this.counter
	}

	// ── ID-tracked mode (windows) ──────────────────────────────────────

	/**
	 * Assign a z-index to an ID. If already assigned, returns the existing value.
	 */
	assignZIndex(id: string): number {
		const existing = this.idMap.get(id)
		if (existing !== undefined) return existing
		this.counter++
		const z = this.BASE_Z_INDEX + this.counter
		this.idMap.set(id, z)
		return z
	}

	/**
	 * Move a tracked ID to the highest z-index (bring to front).
	 * Returns the new z-index.
	 */
	bringToFront(id: string): number {
		this.counter++
		const z = this.BASE_Z_INDEX + this.counter
		this.idMap.set(id, z)
		return z
	}

	/**
	 * Release a tracked ID's z-index.
	 */
	releaseId(id: string): void {
		this.idMap.delete(id)
	}

	/**
	 * Get the z-index for a tracked ID, or undefined if not tracked.
	 */
	getZIndex(id: string): number | undefined {
		return this.idMap.get(id)
	}

	/**
	 * Get all tracked IDs sorted by z-index (lowest first, front-most last).
	 */
	getStackOrder(): string[] {
		return [...this.idMap.entries()]
			.toSorted(([, a], [, b]) => a - b)
			.map(([id]) => id)
	}
}

export const overlayStack = OverlayStackManager.getInstance()

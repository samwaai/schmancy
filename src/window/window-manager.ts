/**
 * Window Manager — singleton service for multi-window coordination.
 *
 * Tracks all schmancy-window instances: positions, z-indices, focus, visual states.
 * Components register on connectedCallback, unregister on disconnectedCallback.
 * Focus changes, position updates, and overlap queries all flow through here.
 *
 * Follows the ThemeService singleton pattern (theme/theme.service.ts).
 *
 * Example:
 *   windowManager.register('chat-1', bounds, 'bottom-right')
 *   windowManager.focus('chat-1')  // bumps z-index, updates focusedId
 *   const overlaps = windowManager.findOverlaps(projectedBounds, 'chat-1')
 */

import { BehaviorSubject, Observable, distinctUntilChanged, map } from 'rxjs'
import { overlayStack } from '../utils/overlay-stack.js'
import type { WindowBounds, WindowRecord, WindowRegistryState, SnapTarget } from './window-registry.js'

const STORAGE_PREFIX = 'schmancy-window-'
const LEGACY_STORAGE_PREFIX = 'schmancy-float-'

class WindowManagerService {
	private static instance: WindowManagerService

	private readonly _state$ = new BehaviorSubject<WindowRegistryState>({
		windows: new Map(),
		focusedId: null,
		stackOrder: [],
	})

	readonly state$ = this._state$.asObservable()

	private constructor() {}

	static getInstance(): WindowManagerService {
		if (!WindowManagerService.instance) {
			WindowManagerService.instance = new WindowManagerService()
		}
		return WindowManagerService.instance
	}

	// ── Synchronous accessors ──────────────────────────────────────────

	get windows(): Map<string, WindowRecord> {
		return this._state$.value.windows
	}

	get focusedId(): string | null {
		return this._state$.value.focusedId
	}

	// ── Registration ───────────────────────────────────────────────────

	register(id: string, initialBounds: WindowBounds, snapTarget: SnapTarget): void {
		const state = this._state$.value
		if (state.windows.has(id)) return

		const zIndex = overlayStack.assignZIndex(id)
		const record: WindowRecord = {
			id,
			bounds: initialBounds,
			visualState: 'normal',
			zIndex,
			open: false,
			snapTarget,
		}

		const windows = new Map(state.windows)
		windows.set(id, record)
		const stackOrder = overlayStack.getStackOrder()

		this._state$.next({ ...state, windows, stackOrder })
	}

	unregister(id: string): void {
		const state = this._state$.value
		if (!state.windows.has(id)) return

		overlayStack.releaseId(id)
		const windows = new Map(state.windows)
		windows.delete(id)
		const stackOrder = overlayStack.getStackOrder()
		const focusedId = state.focusedId === id ? null : state.focusedId

		this._state$.next({ ...state, windows, stackOrder, focusedId })
	}

	// ── State mutations ────────────────────────────────────────────────

	updateBounds(id: string, bounds: WindowBounds): void {
		this._updateRecord(id, { bounds })
	}

	updateVisualState(id: string, visualState: WindowRecord['visualState']): void {
		this._updateRecord(id, { visualState })
	}

	updateOpen(id: string, open: boolean): void {
		this._updateRecord(id, { open })
	}

	focus(id: string): void {
		const state = this._state$.value
		if (!state.windows.has(id)) return
		if (state.focusedId === id) return

		const zIndex = overlayStack.bringToFront(id)
		const windows = new Map(state.windows)
		const record = windows.get(id)
		if (record) {
			windows.set(id, { ...record, zIndex })
		}
		const stackOrder = overlayStack.getStackOrder()

		this._state$.next({ ...state, windows, stackOrder, focusedId: id })
	}

	// ── Queries ────────────────────────────────────────────────────────

	findOverlaps(bounds: WindowBounds, excludeId: string): WindowRecord[] {
		const result: WindowRecord[] = []
		for (const [id, record] of this._state$.value.windows) {
			if (id === excludeId) continue
			if (rectsOverlap(bounds, record.bounds)) {
				result.push(record)
			}
		}
		return result
	}

	getNeighbors(id: string): WindowRecord[] {
		const result: WindowRecord[] = []
		for (const [otherId, record] of this._state$.value.windows) {
			if (otherId !== id) result.push(record)
		}
		return result
	}

	// ── Selectors ──────────────────────────────────────────────────────

	selectWindow(id: string): Observable<WindowRecord | undefined> {
		return this._state$.pipe(
			map(state => state.windows.get(id)),
			distinctUntilChanged(),
		)
	}

	selectFocused(): Observable<string | null> {
		return this._state$.pipe(
			map(state => state.focusedId),
			distinctUntilChanged(),
		)
	}

	// ── Persistence ────────────────────────────────────────────────────

	loadPosition(id: string): { x: number; y: number; anchor: string } | null {
		try {
			// Try new key first, fall back to legacy
			const raw = localStorage.getItem(STORAGE_PREFIX + id) ?? localStorage.getItem(LEGACY_STORAGE_PREFIX + id)
			if (!raw) return null
			return JSON.parse(raw) as { x: number; y: number; anchor: string }
		} catch {
			return null
		}
	}

	savePosition(id: string, data: { x: number; y: number; anchor: string }): void {
		try {
			localStorage.setItem(STORAGE_PREFIX + id, JSON.stringify(data))
		} catch {
			// ignore
		}
	}

	clearPosition(id: string): void {
		try {
			localStorage.removeItem(STORAGE_PREFIX + id)
			localStorage.removeItem(LEGACY_STORAGE_PREFIX + id)
		} catch {
			// ignore
		}
	}

	// ── Internal ───────────────────────────────────────────────────────

	private _updateRecord(id: string, updates: Partial<WindowRecord>): void {
		const state = this._state$.value
		const record = state.windows.get(id)
		if (!record) return

		const windows = new Map(state.windows)
		windows.set(id, { ...record, ...updates })
		this._state$.next({ ...state, windows })
	}
}

/** Simple rect overlap check (inline — no circular import with window-position) */
function rectsOverlap(a: WindowBounds, b: WindowBounds): boolean {
	return !(a.left >= b.left + b.width || a.left + a.width <= b.left || a.top >= b.top + b.height || a.top + a.height <= b.top)
}

export const windowManager = WindowManagerService.getInstance()

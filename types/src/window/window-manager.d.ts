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
import { Observable } from 'rxjs';
import type { WindowBounds, WindowRecord, WindowRegistryState, SnapTarget } from './window-registry.js';
declare class WindowManagerService {
    private static instance;
    private readonly _state$;
    readonly state$: Observable<WindowRegistryState>;
    private constructor();
    static getInstance(): WindowManagerService;
    get windows(): Map<string, WindowRecord>;
    get focusedId(): string | null;
    register(id: string, initialBounds: WindowBounds, snapTarget: SnapTarget): void;
    unregister(id: string): void;
    updateBounds(id: string, bounds: WindowBounds): void;
    updateVisualState(id: string, visualState: WindowRecord['visualState']): void;
    updateOpen(id: string, open: boolean): void;
    focus(id: string): void;
    findOverlaps(bounds: WindowBounds, excludeId: string): WindowRecord[];
    getNeighbors(id: string): WindowRecord[];
    selectWindow(id: string): Observable<WindowRecord | undefined>;
    selectFocused(): Observable<string | null>;
    loadPosition(id: string): {
        x: number;
        y: number;
        anchor: string;
    } | null;
    savePosition(id: string, data: {
        x: number;
        y: number;
        anchor: string;
    }): void;
    clearPosition(id: string): void;
    private _updateRecord;
}
export declare const windowManager: WindowManagerService;
export {};

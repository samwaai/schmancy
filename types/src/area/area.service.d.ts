import { Observable, ReplaySubject, Subject } from 'rxjs';
import { SchmancyTeleportation } from '../teleport';
import { ActiveRoute, AreaSubscription, RouteAction } from './router.types';
export declare const routerHistory: Subject<RouteAction>;
export declare const FINDING_MORTIES = "FINDING_MORTIES";
export declare const HERE_RICKY = "HERE_RICKY";
export type HERE_RICKY_EVENT = CustomEvent<{
    component: SchmancyTeleportation;
}>;
export type FINDING_MORTIES_EVENT = CustomEvent<{
    component: SchmancyTeleportation;
}>;
declare class AreaService implements AreaSubscription {
    private static instance;
    prettyURL: boolean;
    mode: 'SILENT' | 'HISTORY';
    request: ReplaySubject<RouteAction>;
    current: Map<string, ActiveRoute>;
    $current: ReplaySubject<Map<string, ActiveRoute>>;
    private get areaSubjects();
    enableHistoryMode: boolean;
    private findingMortiesEvent;
    private disposed;
    isProcessingPopstate: boolean;
    constructor();
    /**
     * Initialize router state from browser history state
     */
    private initializeFromBrowserState;
    /**
     * Get or create a ReplaySubject for a specific area with proper cleanup
     */
    private getOrCreateAreaSubject;
    /**
     * Subscribe to a specific area with caching
     */
    on(areaName: string, skipCurrent?: boolean): Observable<ActiveRoute>;
    /**
     * Subscribe to all areas
     */
    all(skipCurrent?: boolean): Observable<Map<string, ActiveRoute>>;
    /**
     * Get state from an area with type safety
     */
    getState<T = unknown>(areaName: string): Observable<T>;
    /**
     * Get params from an area with type safety
     */
    params<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): Observable<T>;
    /**
     * Get a specific param from an area with null safety
     */
    param<T = unknown>(areaName: string, key: string): Observable<T>;
    /**
     * Get props from an area with type safety
     */
    props<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): Observable<T>;
    /**
     * Get a specific prop from an area with null safety
     */
    prop<T = unknown>(areaName: string, key: string): Observable<T>;
    /**
     * Find teleportation components
     */
    find(): Observable<{
        component: SchmancyTeleportation;
    }[]>;
    /**
     * Push a new route action with validation
     */
    push(r: RouteAction): void;
    /**
     * Internal method to update route from browser navigation
     * This should only be called by area components during popstate handling
     */
    _updateFromBrowser(routeAction: RouteAction): void;
    /**
     * Update browser history state (called by area components)
     */
    _updateBrowserHistory(areaName: string, route: ActiveRoute, historyStrategy?: string, clearQueryParams?: string[] | boolean | null): void;
    /**
     * Create a clean URL from area states
     */
    private createCleanURL;
    /**
     * Restore state from browser history state
     */
    restoreFromBrowserState(browserState: any): Record<string, ActiveRoute>;
    /**
     * Parse state from URL (fallback method)
     */
    private parseStateFromURL;
    /**
     * Dispatch a DOM event for a specific area change
     */
    private dispatchAreaEvent;
    /**
     * Remove an area from the current state
     */
    pop(name: string): void;
    /**
     * Clear all areas
     */
    clear(): void;
    /**
     * Dispose of the service and clean up resources
     */
    dispose(): void;
    /**
     * Get singleton instance
     */
    static getInstance(): AreaService;
    /**
     * Get current state from URL (deprecated - use browser state instead)
     */
    get state(): Record<string, unknown>;
    /**
     * Check if an area exists in current state
     */
    hasArea(areaName: string): boolean;
    /**
     * Get all active area names
     */
    getActiveAreas(): string[];
    /**
     * Get route for a specific area synchronously
     */
    getRoute(areaName: string): ActiveRoute | undefined;
}
export declare const area: AreaService;
export default area;

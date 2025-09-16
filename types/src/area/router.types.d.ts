export type RouteAction = {
    component: CustomElementConstructor | string | HTMLElement | (() => Promise<{
        default: CustomElementConstructor;
    }>);
    area: string;
    state?: Record<string, unknown>;
    params?: Record<string, unknown>;
    props?: Record<string, unknown>;
    historyStrategy?: THistoryStrategy;
    clearQueryParams?: string[] | boolean | null;
    _source?: 'programmatic' | 'browser' | 'initial';
};
export type ActiveRoute = {
    component: string;
    area: string;
    state?: Record<string, unknown>;
    params?: Record<string, unknown>;
    props?: Record<string, unknown>;
};
/**
 * Interface for subscribing to area changes
 */
export interface AreaSubscription {
    /**
     * Subscribe to a specific area
     * @param areaName Name of the area to subscribe to
     * @param skipCurrent Whether to skip the current value
     * @returns Observable of the active route for the specified area
     */
    on(areaName: string, skipCurrent?: boolean): import('rxjs').Observable<ActiveRoute>;
    /**
     * Subscribe to all areas
     * @param skipCurrent Whether to skip the current value
     * @returns Observable of all active routes
     */
    all(skipCurrent?: boolean): import('rxjs').Observable<Map<string, ActiveRoute>>;
    /**
     * Get state from an area
     * @param areaName Name of the area to subscribe to
     * @returns Observable of the area's state
     */
    getState<T = unknown>(areaName: string): import('rxjs').Observable<T>;
    /**
     * Get params from an area
     * @param areaName Name of the area to subscribe to
     * @returns Observable of the area's params
     */
    params<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): import('rxjs').Observable<T>;
    /**
     * Get a specific param from an area
     * @param areaName Name of the area to subscribe to
     * @param key Key of the param to select
     * @returns Observable of the param value
     */
    param<T = unknown>(areaName: string, key: string): import('rxjs').Observable<T>;
    /**
     * Get props from an area
     * @param areaName Name of the area to subscribe to
     * @returns Observable of the area's props
     */
    props<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): import('rxjs').Observable<T>;
    /**
     * Get a specific prop from an area
     * @param areaName Name of the area to subscribe to
     * @param key Key of the prop to select
     * @returns Observable of the prop value
     */
    prop<T = unknown>(areaName: string, key: string): import('rxjs').Observable<T>;
}
export type THistoryStrategy = 'push' | 'replace' | 'pop' | 'silent';
export declare enum HISTORY_STRATEGY {
    push = "push",
    replace = "replace",
    pop = "pop",
    silent = "silent"
}
/**
 * Browser history state structure used by Schmancy Area
 */
export interface SchmancyHistoryState {
    schmancyAreas: Record<string, ActiveRoute>;
    [key: string]: any;
}

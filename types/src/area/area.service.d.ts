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
    private areaSubjects;
    enableHistoryMode: boolean;
    private findingMortiesEvent;
    constructor();
    /**
     * Get or create a ReplaySubject for a specific area
     * @param areaName The name of the area
     * @returns ReplaySubject for the specified area
     */
    private getOrCreateAreaSubject;
    /**
     * Subscribe to a specific area
     * @param areaName Name of the area to subscribe to
     * @param skipCurrent Whether to skip the current value
     * @returns Observable of the active route for the specified area
     */
    on(areaName: string, skipCurrent?: boolean): Observable<ActiveRoute>;
    /**
     * Subscribe to all areas
     * @param skipCurrent Whether to skip the current value
     * @returns Observable of all active routes
     */
    all(skipCurrent?: boolean): Observable<Map<string, ActiveRoute>>;
    /**
     * Get state from an area
     * @param areaName Name of the area to subscribe to
     * @returns Observable of the area's state
     */
    getState<T = unknown>(areaName: string): Observable<T>;
    /**
     * Get params from an area
     * @param areaName Name of the area to subscribe to
     * @returns Observable of the area's params
     */
    params<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): Observable<T>;
    /**
     * Get a specific param from an area
     * @param areaName Name of the area to subscribe to
     * @param key Key of the param to select
     * @returns Observable of the param value
     */
    param<T = unknown>(areaName: string, key: string): Observable<T>;
    find(): Observable<any>;
    /**
     * Push a new route action
     * @param r Route action to push
     */
    push(r: RouteAction): void;
    /**
     * Dispatch a DOM event for a specific area change
     * @param areaName Name of the area that changed
     * @param routeAction The route action that was pushed
     */
    private dispatchAreaEvent;
    pop(name: string): void;
    static getInstance(): AreaService;
    get state(): {};
}
export declare const area: AreaService;
export default area;

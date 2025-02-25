import { TemplateResult } from 'lit';
import { HISTORY_STRATEGY, RouteAction } from './router.types';
/**
 * Type for a mapping entry. Each mapping specifies a pathname and an array of route definitions.
 * Each route definition contains an area name, a component (or promise/constructor/template),
 * and optionally, a state.
 */
export type AreaPathnames = {
    pathname: string;
    routes: Array<{
        area: string;
        component: string | Promise<NodeModule> | CustomElementConstructor | TemplateResult<1>;
        state?: object;
    }>;
};
declare const SchmancyArea_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyArea extends SchmancyArea_base {
    /**
     * The name of the router outlet.
     * @attr
     * @type {string}
     * @public
     * @required
     */
    name: string;
    /**
     * The default component to use if no matching route is found.
     */
    default: string | Promise<NodeModule> | CustomElementConstructor | TemplateResult<1>;
    /**
     * (Optional) A mappings property that can be set on the element.
     * This property is only available for external use and does not alter
     * the component's built-in routing behavior.
     *
     * Example:
     * [
     *   {
     *     pathname: '/home',
     *     routes: [
     *       { area: 'main', component: 'home-view', state: { foo: 'bar' } },
     *       { area: 'sidebar', component: 'menu-view' }
     *     ]
     *   },
     *   {
     *     pathname: '/about',
     *     routes: [
     *       { area: 'main', component: 'about-view' },
     *       { area: 'sidebar', component: 'info-view' }
     *     ]
     *   }
     * ]
     */
    mappings: AreaPathnames[];
    /**
     * NEW PUBLIC API:
     * Accepts an array of route mappings and returns an observable emitting
     * the RouteAction for this area (if found) based on the current location's pathname.
     *
     * Note: This method does not affect the component's built-in logic.
     *
     * @param mappings - Array of route mapping objects.
     * @param historyStrategy - The history strategy to use (e.g. PUSH, REPLACE, SILENT).
     * @returns An RxJS Observable that emits a RouteAction.
     */
    getComponentFromMappings(mappings: AreaPathnames[], historyStrategy: HISTORY_STRATEGY): import("rxjs").Observable<RouteAction>;
    /**
     * ORIGINAL API:
     * Returns an observable that emits a RouteAction based on the provided pathname.
     *
     * This method retains the original logic that parses the URL.
     *
     * @param pathname - Pathname from the browser location API.
     * @param historyStrategy - The history strategy to use for the route (PUSH, REPLACE, SILENT).
     * @returns An observable emitting the RouteAction.
     */
    getComponentFromPathname(pathname: string, historyStrategy: HISTORY_STRATEGY): import("rxjs").Observable<RouteAction>;
    /**
     * The original routing pipeline remains intact.
     * It uses getComponentFromPathname to resolve the route based on the URL.
     */
    protected firstUpdated(): void;
    /**
     * Computes the new URL path for the given component and route.
     */
    newPath(tag: string, route: RouteAction): string;
    /**
     * Removes specified query parameters from the current URL.
     */
    queryParamClear(params?: string[]): string;
    /**
     * Checks for teleportation requests (FLIP_REQUEST events) and dispatches a FLIP_STARTED event.
     */
    checkForTeleportationRequests(): import("rxjs").Observable<any>;
    disconnectedCallback(): void;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area': SchmancyArea;
    }
}
export {};

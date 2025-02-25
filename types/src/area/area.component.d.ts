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
     * An optional array of route mappings that can be passed into the component.
     * Each mapping specifies a pathname and an array of routes mapping area names to components.
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
     * New API: Returns an observable emitting a RouteAction based on the passed mappings.
     *
     * It looks for a mapping that matches the current location’s pathname, then selects
     * the route whose area matches this component’s name.
     *
     * @param mappings - Array of route mapping objects.
     * @param historyStrategy - The history strategy to use (e.g. PUSH, REPLACE, SILENT).
     * @returns An RxJS Observable that emits a RouteAction.
     */
    getComponentFromMappings(mappings: AreaPathnames[], historyStrategy: HISTORY_STRATEGY): import("rxjs").Observable<RouteAction>;
    /**
     * Existing API: Returns an observable that emits a RouteAction based on the provided pathname.
     *
     * @param pathname - Pathname from the browser location API.
     * @param historyStrategy - The history strategy to use for the route (PUSH, REPLACE, SILENT).
     * @returns An observable emitting the RouteAction.
     */
    getComponentFromPathname(pathname: string, historyStrategy: HISTORY_STRATEGY): import("rxjs").Observable<RouteAction>;
    protected firstUpdated(): void;
    /**
     * Computes a new URL path for the given component and route.
     */
    newPath(tag: string, route: RouteAction): string;
    /**
     * Removes specified query parameters from the current URL.
     */
    queryParamClear(params?: string[]): string;
    /**
     * Checks for teleportation requests (FLIP_REQUEST events) and dispatches a FLIP_STARTED event.
     */
    checkForTeleportationRequests(): import("rxjs").Observable<any[]>;
    disconnectedCallback(): void;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area': SchmancyArea;
    }
}
export {};

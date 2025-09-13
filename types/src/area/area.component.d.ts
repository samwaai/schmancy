import { TemplateResult } from 'lit';
import { RouteAction } from './router.types';
declare const SchmancyArea_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export declare class SchmancyArea extends SchmancyArea_base {
    /**
     * The name of the router outlet
     * @attr
     * @type {string}
     * @public
     * @required
     */
    name: string;
    default: string | CustomElementConstructor | TemplateResult<1>;
    /**
     * Query for assigned route elements in the slot
     * This will automatically update when slot content changes
     */
    private routes;
    /**
     * Subscription to the routing pipeline
     */
    private routingSubscription?;
    /**
     * Unified route resolver that handles all routing scenarios
     * This is the single source of truth for resolving routes
     */
    private resolveRoute;
    /**
     * Match URL to route using both JSON-based (core) and segment-based (enhancement) routing
     * This method is pure and reactive - it ALWAYS emits something (matched route, default, or EMPTY)
     */
    private matchSegmentToRoute;
    /**
     * Resolve component input to HTMLElement
     * Handles strings, constructors, promises, lazy loading, etc.
     */
    private resolveComponent;
    protected firstUpdated(): void;
    /**
     * Check if two routes are the same (for duplicate prevention)
     */
    private isSameRoute;
    /**
     * Update the DOM with the new component
     */
    private updateDOM;
    /**
     * Update internal router state
     */
    private updateInternalState;
    /**
     * Update browser history (only for programmatic navigation)
     */
    private updateBrowserHistory;
    /**
     * Create URL path for the route (legacy method, now handled by service)
     */
    newPath(tag: string, route: RouteAction): string;
    /**
     * Clear query parameters
     */
    queryParamClear(params?: string[] | boolean): string;
    disconnectedCallback(): void;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area': SchmancyArea;
    }
}
export {};

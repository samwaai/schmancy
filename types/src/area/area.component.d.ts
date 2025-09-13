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
     * Subscription to the routing pipeline
     */
    private routingSubscription?;
    /**
     * Unified route resolver that handles all routing scenarios
     * This is the single source of truth for resolving routes
     */
    private resolveRoute;
    /**
     * Parse pathname to route action
     */
    private parsePathnameToRoute;
    /**
     * Map path strings to component names for demo navigation
     */
    private pathToComponent;
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

import { TemplateResult } from 'lit';
import { HISTORY_STRATEGY, RouteAction } from './router.types';
declare const SchmancyArea_base: CustomElementConstructor & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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
     * Get component from pathname with better error handling
     */
    getComponentFromPathname(pathname: string, historyStrategy: HISTORY_STRATEGY): any;
    /**
     * Get component from browser state with fallback to URL
     */
    getComponentFromBrowserState(event: PopStateEvent): RouteAction | null;
    protected firstUpdated(): void;
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
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area': SchmancyArea;
    }
}
export {};

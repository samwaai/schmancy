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
    default: CustomElementConstructor | string | HTMLElement | (() => Promise<{
        default: CustomElementConstructor;
    }>);
    /**
     * Query for assigned route elements in the slot
     * This will automatically update when slot content changes
     */
    private routes;
    /**
     * Enhanced guard evaluation that handles synchronous, Promise, and Observable returns
     */
    private evaluateGuard;
    protected firstUpdated(): void;
    /**
     * Swap components with animation following the original pattern
     */
    private swapComponents;
    /**
     * Create URL path for the route (legacy method, now handled by service)
     */
    newPath(tag: string, route: RouteAction): string;
    /**
     * Clear query parameters
     */
    queryParamClear(params?: string[] | boolean): string;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area': SchmancyArea;
    }
}
export {};

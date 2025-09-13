export type GuardResult = boolean | string | {
    redirect: string;
};
export interface RouteConfig {
    when: string;
    component: any;
    exact?: boolean;
    guard?: () => GuardResult | Promise<GuardResult>;
}
declare const SchmancyRoute_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * A marker component that holds route configuration.
 * This component doesn't render anything - it's used by schmancy-area
 * to configure routing via slot change detection.
 *
 * @example
 * ```html
 * <schmancy-area>
 *   <schmancy-route
 *     when="users"
 *     .component=${UserComponent}
 *     exact
 *   ></schmancy-route>
 * </schmancy-area>
 * ```
 */
export declare class SchmancyRoute extends SchmancyRoute_base {
    when: string;
    component: any;
    exact?: boolean;
    guard?: () => GuardResult | Promise<GuardResult>;
    /**
     * Returns the route configuration object
     */
    getConfig(): RouteConfig;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-route': SchmancyRoute;
    }
}
export {};

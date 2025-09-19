import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
export type ObservableGuardResult = Observable<boolean>;
export type RouteComponent = string | CustomElementConstructor | HTMLElement | TemplateResult<1> | (() => Promise<{
    default: CustomElementConstructor;
}>) | Promise<{
    default: CustomElementConstructor;
}>;
export interface RouteConfig {
    when: string;
    component: RouteComponent;
    exact?: boolean;
    guard?: ObservableGuardResult;
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
    component: RouteComponent;
    exact?: boolean;
    guard?: ObservableGuardResult;
    /**
     * Returns the route configuration object
     */
    getConfig(): RouteConfig;
    render(): TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-route': SchmancyRoute;
    }
}
export {};

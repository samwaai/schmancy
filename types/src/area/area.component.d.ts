import { RouteComponent } from './route.component';
declare const SchmancyArea_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * Router outlet — renders the active route's component for the named area. Drives the schmancy router via the `area` service.
 *
 * @element schmancy-area
 * @summary Mount once per "addressable region" of the app (typically the main content area). Use the imperative `area.push({ area, component, params })` service to navigate. Multiple named areas can coexist on a page (e.g. main content + a sheet).
 * @example
 * <schmancy-area name="main"></schmancy-area>
 * <script>
 *   import { area } from '@mhmo91/schmancy';
 *   area.push({ area: 'main', component: MyDashboardView, params: { id: 42 } });
 * </script>
 * @platform div - Routing outlet. Degrades to an empty div if the tag never registers — routing is lost but the page stays accessible.
 * @fires redirect - When the area resolves a route to a different destination (programmatic redirect). `detail.from` and `detail.to` are the route names.
 */
export declare class SchmancyArea extends SchmancyArea_base {
    /**
     * The name of the router outlet
     * @attr
     * @type {string}
     * @public
     * @required
     */
    name: string;
    default: RouteComponent;
    /**
     * Query for assigned route elements in the slot
     * This will automatically update when slot content changes
     */
    private routes;
    protected firstUpdated(): void;
    /**
     * Swap components with animation
     */
    private swapComponents;
    disconnectedCallback(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-area': SchmancyArea;
    }
}
export {};

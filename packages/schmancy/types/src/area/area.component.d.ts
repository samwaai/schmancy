import { RouteComponent } from './route.component';
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

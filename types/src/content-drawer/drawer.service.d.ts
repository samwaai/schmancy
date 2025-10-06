type TRef = Element | Window;
type TRenderRequest = HTMLElement;
export type TRenderCustomEvent = CustomEvent<{
    component: TRenderRequest;
    title?: string;
    state?: Record<string, unknown>;
    params?: Record<string, unknown>;
    props?: Record<string, unknown>;
}>;
type ComponentType = string | HTMLElement | (() => HTMLElement) | (() => Promise<{
    default: any;
}>);
export type DrawerPushOptions = {
    component: ComponentType;
    state?: Record<string, unknown>;
    params?: Record<string, unknown>;
    props?: Record<string, unknown>;
};
declare class DrawerService {
    private $drawer;
    private lastComponent;
    constructor();
    dimiss(ref: TRef): void;
    render(ref: TRef, component: TRenderRequest, title?: string): void;
    private handlePush;
    /**
     * Push a component to the content drawer
     * @param options - Component configuration object with optional state/params/props
     * @deprecated Passing a raw ComponentType is deprecated. Use DrawerPushOptions object instead.
     * @example
     * // Recommended
     * schmancyContentDrawer.push({
     *   component: myComponent,
     *   props: { id: '123' }
     * })
     *
     * // Legacy (deprecated)
     * schmancyContentDrawer.push(myComponent)
     */
    push(options: ComponentType | DrawerPushOptions): void;
}
export declare const schmancyContentDrawer: DrawerService;
export {};

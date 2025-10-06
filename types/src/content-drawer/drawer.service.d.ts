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
    private dispatchToggleEvent;
    private dispatchRenderEvent;
    dimiss(ref: TRef): void;
    render(ref: TRef, component: TRenderRequest, title?: string): void;
    private handlePush;
    private resolveComponent;
}
export declare const schmancyContentDrawer: DrawerService;
export {};

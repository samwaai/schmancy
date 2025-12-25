import { ComponentType } from '../area/router.types';
type TRef = Element | Window;
type TRenderRequest = ComponentType;
export type TRenderCustomEvent = CustomEvent<{
    component: TRenderRequest;
    title?: string;
    state?: Record<string, unknown>;
    params?: Record<string, unknown>;
    props?: Record<string, unknown>;
}>;
export type DrawerPushOptions = {
    component: ComponentType;
    state?: Record<string, unknown>;
    params?: Record<string, unknown>;
    props?: Record<string, unknown>;
};
declare class DrawerService {
    private $drawer;
    constructor();
    private dispatchToggleEvent;
    private dispatchRenderEvent;
    dimiss(ref: TRef): void;
    render(ref: TRef, component: TRenderRequest, title?: string): void;
    private handlePush;
    /**
     * Push a component to the content drawer
     * @param options - Component configuration object with optional state/params/props
     * @example
     * schmancyContentDrawer.push({
     *   component: myComponent,
     *   props: { id: '123' }
     * })
     */
    push(options: DrawerPushOptions): void;
}
export declare const schmancyContentDrawer: DrawerService;
export {};

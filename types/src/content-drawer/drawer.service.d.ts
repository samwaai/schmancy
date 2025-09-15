type TRef = Element | Window;
type TRenderRequest = HTMLElement;
export type TRenderCustomEvent = CustomEvent<{
    component: TRenderRequest;
    title?: string;
}>;
type ComponentType = string | HTMLElement | (() => HTMLElement) | (() => Promise<{
    default: any;
}>);
declare class DrawerService {
    private $drawer;
    private lastComponent;
    constructor();
    dimiss(ref: TRef): void;
    render(ref: TRef, component: TRenderRequest, title?: string): void;
    private handlePush;
    push(component: ComponentType): void;
}
export declare const schmancyContentDrawer: DrawerService;
export {};

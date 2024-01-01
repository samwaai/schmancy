type TRef = Element | Window;
type TRenderRequest = HTMLElement;
export type TRenderCustomEvent = CustomEvent<{
    component: TRenderRequest;
    title?: string;
}>;
declare class Drawer {
    private $drawer;
    constructor();
    dimiss(ref: TRef): void;
    render(ref: TRef, component: TRenderRequest, title?: string): void;
}
export declare const schmancyContentDrawer: Drawer;
export {};

/// <reference types="node" />
type TRef = Element | Window;
type TRenderRequest = HTMLElement | CustomElementConstructor | string | Promise<NodeModule>;
export type TRenderCustomEvent = CustomEvent<{
    component: TRenderRequest;
}>;
declare class Drawer {
    private $drawer;
    constructor();
    dimiss(ref: TRef): void;
    render(ref: TRef, component: TRenderRequest): void;
}
export declare const schmancyContentDrawer: Drawer;
export {};

export declare enum SchmancyEvents {
    DRAWER_TOGGLE = "SchmancytoggleSidebar"
}
declare class Drawer {
    private $drawer;
    constructor();
    open(self?: HTMLElement): void;
    close(self?: HTMLElement): void;
}
export declare const schmancyDrawer: Drawer;
export {};

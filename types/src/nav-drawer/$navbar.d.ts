declare class Drawer {
    private $drawer;
    constructor();
    open(self?: HTMLElement): void;
    close(self?: HTMLElement): void;
}
export declare const schmancyNavDrawer: Drawer;
declare const $drawer: Drawer;
export { $drawer };

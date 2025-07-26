declare const SchmancyMenu_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyMenu extends SchmancyMenu_base {
    buttonElement: Array<HTMLElement>;
    menuElement: HTMLElement;
    private cleanup?;
    private getMiddleware;
    updatePosition(): Promise<void>;
    private showMenu;
    private hideMenu;
    firstUpdated(): void;
    render(): any;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu': SchmancyMenu;
    }
}
export {};

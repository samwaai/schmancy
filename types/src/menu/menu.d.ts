declare const SchmancyMenu_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyMenu extends SchmancyMenu_base {
    buttonElement: Array<HTMLElement>;
    menuElement: HTMLElement;
    private cleanup?;
    private getMiddleware;
    updatePosition(): Promise<void>;
    private showMenu;
    private hideMenu;
    firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu': SchmancyMenu;
    }
}
export {};

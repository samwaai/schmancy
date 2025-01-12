declare const SchmancyMenu_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyMenu extends SchmancyMenu_base {
    open: boolean;
    buttonElement: Array<HTMLElement>;
    menuElement: HTMLElement;
    openMenu(): Promise<void>;
    closeMenu(e?: Event): Promise<void>;
    positionMenu(): Promise<void>;
    protected firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu': SchmancyMenu;
    }
}
export {};

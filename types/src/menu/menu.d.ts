declare const SchmancyMenu_base: import("../../mixins").Constructor<CustomElementConstructor> & import("../../mixins").Constructor<import("@mixins/tailwind").ITailwindElementMixin> & import("../../mixins").Constructor<import("lit").LitElement> & import("../../mixins").Constructor<import("../../mixins").IBaseMixin>;
export default class SchmancyMenu extends SchmancyMenu_base {
    open: boolean;
    buttonElement: Array<HTMLElement>;
    menuElement: HTMLElement;
    openMenu(): import("@juliangarnierorg/anime-beta").Animation;
    closeMenu(e?: Event): import("@juliangarnierorg/anime-beta").Animation;
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

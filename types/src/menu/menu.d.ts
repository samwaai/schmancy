declare const SchmancyMenu_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
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

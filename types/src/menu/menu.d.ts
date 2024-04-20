declare const SchmancyMenu_base: import("@schmancy/mixin").Constructor<CustomElementConstructor> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("@schmancy/mixin").Constructor<import("lit").LitElement> & import("@schmancy/mixin").Constructor<import("@schmancy/mixin").IBaseMixin>;
export default class SchmancyMenu extends SchmancyMenu_base {
    open: boolean;
    buttonElement: Array<HTMLElement>;
    menuElement: HTMLElement;
    openMenu(): import("@juliangarnierorg/anime-beta").Animation;
    closeMenu(): import("@juliangarnierorg/anime-beta").Animation;
    protected firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu': SchmancyMenu;
    }
}
export {};

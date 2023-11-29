declare const SchmancyMenu_base: any;
export default class SchmancyMenu extends SchmancyMenu_base {
    open: boolean;
    buttonElement: Array<HTMLElement>;
    menuElement: HTMLElement;
    openMenu(): void;
    closeMenu(): void;
    protected firstUpdated(): void;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-menu': SchmancyMenu;
    }
}
export {};

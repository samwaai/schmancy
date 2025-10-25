declare const SchmancyMenu_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmancyMenu extends SchmancyMenu_base {
    private buttonSlot;
    private menuSlot;
    private isOpen;
    private get buttonElement();
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

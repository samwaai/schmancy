declare const SchmancyThemeButton_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancyThemeButton extends SchmancyThemeButton_base {
    color: HTMLElement;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-theme-button': SchmancyThemeButton;
    }
}
export {};

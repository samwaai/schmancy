declare const SchmancyThemeButton_base: CustomElementConstructor & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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

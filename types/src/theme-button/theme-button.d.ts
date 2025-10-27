declare const SchmancyThemeButton_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
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

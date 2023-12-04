declare const SchmancySheetContent_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmancySheetContent extends SchmancySheetContent_base {
    /**
     * Should the close button be displayed
     * @type {boolean}
     * @attr
     * @default true
     */
    closeButton: boolean;
    /**
     * color of the component
     * @type {'primary' | 'secondary'}
     * @attr
     * @default 'primary'
     * @description primary: white background, secondary: grey background
     */
    color: 'primary' | 'secondary';
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-sheet-content': SchmancySheetContent;
    }
}
export {};

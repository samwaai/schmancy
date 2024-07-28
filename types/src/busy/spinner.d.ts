declare const SchmnacySpinner_base: import("..").Constructor<CustomElementConstructor> & import("..").Constructor<import("@schmancy/mixin/tailwind/tailwind.mixin").ITailwindElementMixin> & import("..").Constructor<import("lit").LitElement> & import("..").Constructor<import("..").IBaseMixin>;
export default class SchmnacySpinner extends SchmnacySpinner_base {
    color: string;
    size: string;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-spinner': SchmnacySpinner;
    }
}
export {};

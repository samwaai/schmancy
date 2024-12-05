declare const SchmnacySpinner_base: import("@mhmo91/lit-mixins/src").Constructor<CustomElementConstructor> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").ITailwindElementMixin> & import("@mhmo91/lit-mixins/src").Constructor<import("lit").LitElement> & import("@mhmo91/lit-mixins/src").Constructor<import("@mhmo91/lit-mixins/src").IBaseMixin>;
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

declare const SchmnacySpinner_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmnacySpinner extends SchmnacySpinner_base {
    color: string;
    size: string;
    glass: boolean;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-spinner': SchmnacySpinner;
    }
}
export {};

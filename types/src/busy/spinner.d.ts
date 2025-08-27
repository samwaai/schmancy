declare const SchmnacySpinner_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmnacySpinner extends SchmnacySpinner_base {
    color: 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'surface' | 'surface-variant';
    size: number;
    glass: boolean;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-spinner': SchmnacySpinner;
    }
}
export {};

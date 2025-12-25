declare const SchmnacySpinner_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
export default class SchmnacySpinner extends SchmnacySpinner_base {
    color?: 'primary' | 'on-primary' | 'secondary' | 'on-secondary' | 'tertiary' | 'on-tertiary' | 'error' | 'on-error' | 'success' | 'on-success' | 'surface' | 'on-surface' | 'surface-variant' | 'on-surface-variant';
    /**
     * Size of the spinner - M3 aligned tokens or numeric Tailwind units
     * Tokens: 'xxs' (12px), 'xs' (16px), 'sm' (20px), 'md' (24px), 'lg' (32px)
     * Numeric: Tailwind units where each unit = 4px (e.g., 6 = 24px)
     */
    size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | number;
    glass: boolean;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-spinner': SchmnacySpinner;
    }
}
export {};

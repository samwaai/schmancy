/**
 * Icon size tokens - M3 aligned with optical size optimization
 * - xxs: 12px (opsz: 20) - fits in 24px buttons (ultra-compact)
 * - xs: 16px (opsz: 20) - fits in 32px buttons
 * - sm: 20px (opsz: 20) - fits in 40px buttons
 * - md: 24px (opsz: 24) - fits in 48px buttons (default)
 * - lg: 32px (opsz: 40) - fits in 56px buttons
 * - Or custom string like '48px'
 */
export type IconSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | string;
declare const SchmancyIcon_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element schmancy-icon
 * Material Symbols icon component with flexible font variation properties
 *
 * @cssprop --schmancy-icon-size - The size of the icon (default: 24px)
 * @cssprop --schmancy-icon-fill - Fill value for icon (0-1)
 * @cssprop --schmancy-icon-weight - Weight value for icon (100-700)
 * @cssprop --schmancy-icon-grade - Grade value for icon (-50-200)
 * @cssprop --schmancy-icon-opsz - Optical size (default: 24)
 */
export default class SchmancyIcon extends SchmancyIcon_base {
    private static fontsLoaded;
    /**
     * Load Material Symbols fonts from Google Fonts CDN
     */
    private static loadFonts;
    /**
     * Fill value for the icon (0-1)
     * 0 = outlined, 1 = filled
     */
    fill: number;
    /**
     * Weight value for the icon (100-700)
     * Controls the thickness of the icon strokes
     */
    weight: number;
    /**
     * Grade value for the icon (-50-200)
     * Adjusts the visual weight/grade
     */
    grade: number;
    /**
     * Icon variant style
     * @values outlined | rounded | sharp
     */
    variant: 'outlined' | 'rounded' | 'sharp';
    /**
     * Size of the icon - M3 aligned tokens or custom string
     * Tokens: 'xxs' (12px), 'xs' (16px), 'sm' (20px), 'md' (24px), 'lg' (32px)
     * Custom: any CSS size string like '48px', '2rem'
     */
    size: IconSize;
    private static readonly tokenSizes;
    private fill$;
    private weight$;
    private grade$;
    private variant$;
    connectedCallback(): void;
    protected updated(changedProperties: Map<string | number | symbol, unknown>): void;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-icon': SchmancyIcon;
    }
}
export {};

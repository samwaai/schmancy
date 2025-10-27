/**
 * Badge color types for predefined styles
 */
export type BadgeColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'neutral';
/**
 * Badge size variants
 */
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';
/**
 * Badge shape variants
 */
export type BadgeShape = 'rounded' | 'pill' | 'square';
declare const SchmancyBadgeV2_base: import("@mixins/index").Constructor<CustomElementConstructor> & import("@mixins/index").Constructor<import("@mixins/index").ITailwindElementMixin> & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * @element sch-badge
 * A versatile badge component for status indicators, labels, and counts
 *
 * @slot - The content of the badge (text or HTML)
 * @slot icon - Optional icon to display before the content
 *
 * @csspart badge - The badge element container
 * @csspart content - The content container
 * @csspart icon - The icon container
 */
export declare class SchmancyBadgeV2 extends SchmancyBadgeV2_base {
    /**
     * The color variant of the badge
     * @attr
     */
    color: BadgeColor;
    /**
     * The size of the badge
     * @attr
     */
    size: BadgeSize;
    /**
     * The shape of the badge
     * @attr
     */
    shape: BadgeShape;
    /**
     * Whether the badge has an outlined style
     * @attr
     */
    outlined: boolean;
    /**
     * Custom icon name to display (if no icon slot is provided)
     * @attr
     */
    icon: string;
    /**
     * Whether to make the badge pulse to draw attention
     * @attr
     */
    pulse: boolean;
    /**
     * Convert the size to appropriate Tailwind classes for the badge container
     * Using harmonious padding ratios based on golden ratio principles
     * Refined for more elegant proportions
     */
    private getSizeClasses;
    /**
     * Get shape classes based on selected shape
     */
    private getShapeClasses;
    /**
     * Get icon size based on badge size with harmonious proportions
     * Using golden ratio-inspired proportions relative to text size
     */
    private getIconSize;
    /**
     * Get additional styling for specific sizes
     */
    private getExoticStyles;
    /**
     * Get background and text colors based on selected color variant
     * Enhanced for more elegant color combinations with refined contrasts
     */
    private getColorStyles;
    render(): import("lit-html").TemplateResult<1>;
}
declare global {
    interface HTMLElementTagNameMap {
        'sch-badge': SchmancyBadgeV2;
        'schmancy-badge': SchmancyBadgeV2;
    }
}
export declare class ScBadgeV2 extends SchmancyBadgeV2 {
}
export {};

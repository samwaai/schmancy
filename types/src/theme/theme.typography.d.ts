/**
 * Material Design 3 Typography System
 * Complete typography scale following M3 specifications
 * @see https://m3.material.io/styles/typography/type-scale-tokens
 */
export interface M3TypeScale {
    fontSize: string;
    lineHeight: string;
    fontFamily: string;
    fontWeight: string;
    letterSpacing: string;
}
export interface M3Typography {
    display: {
        large: M3TypeScale;
        medium: M3TypeScale;
        small: M3TypeScale;
    };
    headline: {
        large: M3TypeScale;
        medium: M3TypeScale;
        small: M3TypeScale;
    };
    title: {
        large: M3TypeScale;
        medium: M3TypeScale;
        small: M3TypeScale;
    };
    body: {
        large: M3TypeScale;
        medium: M3TypeScale;
        small: M3TypeScale;
    };
    label: {
        large: M3TypeScale;
        medium: M3TypeScale;
        small: M3TypeScale;
    };
}
/**
 * Material Design 3 Typography Configuration
 * Based on Roboto font family as recommended by Material Design
 */
export declare const M3TypographyConfig: M3Typography;
/**
 * Generate CSS custom properties for typography
 */
export declare function generateTypographyCSS(): string;
/**
 * Typography utility functions
 */
export declare const typography: {
    /**
     * Get a specific typography scale
     */
    getScale(category: keyof M3Typography, scale: "large" | "medium" | "small"): M3TypeScale;
    /**
     * Apply typography scale as CSS
     */
    applyScale(category: keyof M3Typography, scale: "large" | "medium" | "small"): string;
    /**
     * Get responsive typography based on viewport
     */
    getResponsiveScale(desktop: {
        category: keyof M3Typography;
        scale: "large" | "medium" | "small";
    }, tablet?: {
        category: keyof M3Typography;
        scale: "large" | "medium" | "small";
    }, mobile?: {
        category: keyof M3Typography;
        scale: "large" | "medium" | "small";
    }): string;
};

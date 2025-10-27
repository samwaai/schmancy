/**
 * Material Design 3 Elevation System
 * Complete elevation system with tinted shadows following M3 specifications
 * @see https://m3.material.io/styles/elevation
 */
export interface M3ElevationLevel {
    level: number;
    shadow: string;
    surfaceTint: number;
    blur: number;
    spread: number;
    verticalOffset: number;
    opacity: {
        umbra: number;
        penumbra: number;
    };
}
export interface M3Elevation {
    0: M3ElevationLevel;
    1: M3ElevationLevel;
    2: M3ElevationLevel;
    3: M3ElevationLevel;
    4: M3ElevationLevel;
    5: M3ElevationLevel;
}
/**
 * Material Design 3 Elevation Configuration
 * Elevation levels with corresponding shadow values and surface tint percentages
 */
export declare const M3ElevationConfig: M3Elevation;
/**
 * Component elevation mappings
 * Recommended elevation levels for M3 components
 */
export declare const M3ComponentElevations: {
    surface: {
        default: number;
        low: number;
        medium: number;
        high: number;
        highest: number;
    };
    card: {
        filled: number;
        elevated: number;
        dragged: number;
    };
    button: {
        filled: number;
        elevated: number;
        elevatedHover: number;
        elevatedPressed: number;
        fab: number;
        fabHover: number;
        fabPressed: number;
        fabLowered: number;
    };
    dialog: number;
    menu: number;
    navigation: {
        drawer: number;
        drawerModal: number;
        rail: number;
        bar: number;
        barScrolled: number;
    };
    appBar: {
        default: number;
        scrolled: number;
    };
    tooltip: {
        plain: number;
        rich: number;
    };
    sheet: {
        bottom: number;
        side: number;
        modal: number;
    };
    snackbar: number;
    popover: number;
    search: {
        bar: number;
        view: number;
    };
};
/**
 * Generate shadow with color tint
 * Creates a tinted shadow based on the primary color
 */
export declare function generateTintedShadow(level: keyof M3Elevation, primaryColor: string, isDark?: boolean): string;
/**
 * Generate CSS custom properties for elevation
 */
export declare function generateElevationCSS(isDark?: boolean): string;
/**
 * Elevation utility functions
 */
export declare const elevation: {
    /**
     * Get elevation level configuration
     */
    getLevel(level: keyof M3Elevation): M3ElevationLevel;
    /**
     * Get component-specific elevation
     */
    getComponentElevation(component: keyof typeof M3ComponentElevations, state?: string): number;
    /**
     * Create elevation transition
     */
    createTransition(duration?: string, easing?: string): string;
    /**
     * Combine elevation with additional shadow
     */
    combineElevation(level: keyof M3Elevation, additionalShadow: string, isDark?: boolean): string;
    /**
     * Create responsive elevation
     */
    createResponsiveElevation(desktop: keyof M3Elevation, tablet?: keyof M3Elevation, mobile?: keyof M3Elevation, isDark?: boolean): string;
    /**
     * Get surface tint percentage for a level
     */
    getSurfaceTint(level: keyof M3Elevation): number;
    /**
     * Apply elevation with surface tint as background overlay
     */
    applyElevationWithTint(level: keyof M3Elevation, primaryColor: string, backgroundColor: string, isDark?: boolean): {
        boxShadow: string;
        background: string;
    };
};

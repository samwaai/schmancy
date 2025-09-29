/**
 * Material Design 3 Shape System
 * Complete shape and corner radius system following M3 specifications
 * @see https://m3.material.io/styles/shape
 */
export type CornerFamily = 'rounded' | 'cut' | 'angular';
export interface M3ShapeScale {
    value: string;
    family: CornerFamily;
}
export interface M3Shape {
    corner: {
        none: M3ShapeScale;
        extraSmall: M3ShapeScale;
        extraSmallTop: M3ShapeScale;
        small: M3ShapeScale;
        medium: M3ShapeScale;
        large: M3ShapeScale;
        largeEnd: M3ShapeScale;
        largeTop: M3ShapeScale;
        extraLarge: M3ShapeScale;
        extraLargeTop: M3ShapeScale;
        full: M3ShapeScale;
    };
}
/**
 * Material Design 3 Shape Configuration
 * Default corner radius values with rounded family
 */
export declare const M3ShapeConfig: M3Shape;
/**
 * Component-specific shape tokens
 * Maps M3 components to their recommended shape scales
 */
export declare const M3ComponentShapes: {
    button: {
        filled: string;
        outlined: string;
        text: string;
        elevated: string;
        tonal: string;
        fab: string;
        extendedFab: string;
        icon: string;
        segmented: string;
    };
    card: {
        filled: string;
        elevated: string;
        outlined: string;
    };
    chip: {
        assist: string;
        filter: string;
        input: string;
        suggestion: string;
    };
    dialog: {
        basic: string;
        fullScreen: string;
    };
    navigation: {
        drawer: string;
        rail: string;
        bar: string;
        tab: string;
    };
    menu: {
        container: string;
        item: string;
    };
    textField: {
        filled: string;
        outlined: string;
    };
    sheet: {
        bottom: string;
        side: string;
    };
    progress: {
        linear: string;
        circular: string;
    };
    tooltip: {
        plain: string;
        rich: string;
    };
    snackbar: string;
    badge: {
        small: string;
        large: string;
    };
};
/**
 * Shape family implementations
 * Different corner treatments for design expression
 */
export declare const ShapeFamilies: {
    /**
     * Rounded family - Default M3 shape family
     */
    rounded: (radius: string) => string;
    /**
     * Cut family - Creates cut corners using clip-path
     */
    cut: (size: string) => string;
    /**
     * Angular family - Creates angular corners
     */
    angular: () => string;
};
/**
 * Generate CSS custom properties for shapes
 */
export declare function generateShapeCSS(): string;
/**
 * Shape utility functions
 */
export declare const shape: {
    /**
     * Get a shape scale value
     */
    getCorner(scale: keyof M3Shape["corner"]): M3ShapeScale;
    /**
     * Get component-specific shape
     */
    getComponentShape(component: keyof typeof M3ComponentShapes, variant?: string): string;
    /**
     * Apply shape with family
     */
    applyShape(scale: keyof M3Shape["corner"], family?: CornerFamily): string;
    /**
     * Create asymmetric shape
     */
    createAsymmetricShape(topLeft: string, topRight: string, bottomRight: string, bottomLeft: string): string;
    /**
     * Create responsive shape
     */
    createResponsiveShape(desktop: keyof M3Shape["corner"], tablet?: keyof M3Shape["corner"], mobile?: keyof M3Shape["corner"]): string;
    /**
     * Check if a value is a full corner (pill shape)
     */
    isFullCorner(value: string): boolean;
};

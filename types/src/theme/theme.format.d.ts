import { Theme } from '@material/material-color-utilities';
import { TSchmancyTheme } from './theme.interface';
/**
 * Generates a complete Material Design 3 theme
 * @param originalTheme The generated theme from Material Color Utilities
 * @param isDark Whether to generate a dark theme
 * @param extendedColors Optional extended colors (success, warning, info)
 */
export declare function formateTheme(originalTheme: Theme, isDark?: boolean, extendedColors?: {
    success?: number;
    warning?: number;
    info?: number;
}): Partial<TSchmancyTheme>;
/**
 * Backward compatibility wrapper for the old API
 */
export declare function createLightTonalPaletteFromBaseColor(hue: number, chroma: number): {
    cLowest: number;
    cLow: number;
    c: number;
    cHigh: number;
    cHighest: number;
    sDim: number;
    s: number;
    sBright: number;
};
export declare function createDarkTonalPaletteFromBaseColor(hue: number, chroma: number): {
    cLowest: number;
    cLow: number;
    c: number;
    cHigh: number;
    cHighest: number;
    sDim: number;
    s: number;
    sBright: number;
};

import { Theme } from '@material/material-color-utilities';
import { TSchmancyTheme } from './theme.interface';
/**
 * Updates the theme based on the original scheme.
 * @param originalScheme The generated scheme from Material Color Utilities.
 * @param isDark Whether to generate a dark theme.
 * @param successBaseColor The base color (as ARGB number) to compute the success palette.
 */
export declare function formateTheme(originalScheme: Theme, isDark: boolean, successBaseColor: number): Partial<TSchmancyTheme>;

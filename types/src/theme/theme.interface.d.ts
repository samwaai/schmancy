declare const theme: {
    theme: {
        sys: {
            color: {
                scrim: string;
                outline: string;
                outlineVariant: string;
                surface: {
                    default: string;
                    dim: string;
                    bright: string;
                    container: string;
                    low: string;
                    high: string;
                    highest: string;
                    lowest: string;
                    on: string;
                    onVariant: string;
                };
                primary: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
                secondary: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
                tertiary: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
                error: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
                success: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
            };
            elevation: {
                0: string;
                1: string;
                2: string;
                3: string;
                4: string;
                5: string;
            };
            outline: {
                1: string;
            };
        };
    };
};
/**
 * Type definition for the Schmancy theme configuration.
 * Contains all available theme variables including colors, elevations, and outlines.
 *
 * @typedef {Object} TSchmancyTheme
 *
 * @example
 * ```typescript
 * import type { TSchmancyTheme } from '@schmancy/theme'
 *
 * const myTheme: Partial<TSchmancyTheme> = {
 *   sys: {
 *     color: {
 *       primary: {
 *         default: '#6200ee'
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type TSchmancyTheme = (typeof theme)[keyof typeof theme];
/**
 * Default Schmancy theme configuration object.
 * Provides access to all theme CSS variables through JavaScript.
 *
 * @constant {TSchmancyTheme}
 *
 * @example
 * ```typescript
 * import { SchmancyTheme } from '@schmancy/theme'
 *
 * // Access primary color variable
 * const primaryColor = SchmancyTheme.sys.color.primary.default
 * // Returns: 'var(--schmancy-sys-color-primary-default)'
 * ```
 */
declare const SchmancyTheme: TSchmancyTheme;
export { SchmancyTheme };

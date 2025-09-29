declare const theme: {
    theme: {
        sys: {
            color: {
                scrim: string;
                outline: string;
                outlineVariant: string;
                shadow: string;
                surface: {
                    default: string;
                    dim: string;
                    bright: string;
                    container: string;
                    containerLow: string;
                    containerLowest: string;
                    containerHigh: string;
                    containerHighest: string;
                    on: string;
                    onVariant: string;
                    tint: string;
                    inverse: string;
                    inverseOn: string;
                    low: string;
                    high: string;
                    highest: string;
                    lowest: string;
                };
                primary: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                    fixed: string;
                    fixedDim: string;
                    onFixed: string;
                    onFixedVariant: string;
                    inverse: string;
                };
                secondary: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                    fixed: string;
                    fixedDim: string;
                    onFixed: string;
                    onFixedVariant: string;
                };
                tertiary: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                    fixed: string;
                    fixedDim: string;
                    onFixed: string;
                    onFixedVariant: string;
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
                warning: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
                info: {
                    default: string;
                    on: string;
                    container: string;
                    onContainer: string;
                };
            };
            typography: {
                display: {
                    large: string;
                    medium: string;
                    small: string;
                };
                headline: {
                    large: string;
                    medium: string;
                    small: string;
                };
                title: {
                    large: string;
                    medium: string;
                    small: string;
                };
                body: {
                    large: string;
                    medium: string;
                    small: string;
                };
                label: {
                    large: string;
                    medium: string;
                    small: string;
                };
            };
            shape: {
                corner: {
                    none: string;
                    extraSmall: string;
                    small: string;
                    medium: string;
                    large: string;
                    extraLarge: string;
                    full: string;
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
            motion: {
                easing: {
                    emphasized: string;
                    emphasizedDecelerate: string;
                    emphasizedAccelerate: string;
                    standard: string;
                    standardDecelerate: string;
                    standardAccelerate: string;
                    legacy: string;
                    linear: string;
                };
                duration: {
                    short1: string;
                    short2: string;
                    short3: string;
                    short4: string;
                    medium1: string;
                    medium2: string;
                    medium3: string;
                    medium4: string;
                    long1: string;
                    long2: string;
                    long3: string;
                    long4: string;
                    extraLong1: string;
                    extraLong2: string;
                    extraLong3: string;
                    extraLong4: string;
                };
            };
            state: {
                opacity: {
                    hover: string;
                    focus: string;
                    pressed: string;
                    dragged: string;
                    disabled: string;
                    disabledContainer: string;
                };
            };
            spacing: {
                0: string;
                1: string;
                2: string;
                3: string;
                4: string;
                5: string;
                6: string;
                7: string;
                8: string;
                9: string;
                10: string;
                11: string;
                12: string;
            };
            outline: {
                1: string;
            };
        };
        ref: {
            palette: {
                primary: {
                    0: string;
                    10: string;
                    20: string;
                    30: string;
                    40: string;
                    50: string;
                    60: string;
                    70: string;
                    80: string;
                    90: string;
                    95: string;
                    99: string;
                    100: string;
                };
                secondary: {
                    0: string;
                    10: string;
                    20: string;
                    30: string;
                    40: string;
                    50: string;
                    60: string;
                    70: string;
                    80: string;
                    90: string;
                    95: string;
                    99: string;
                    100: string;
                };
                tertiary: {
                    0: string;
                    10: string;
                    20: string;
                    30: string;
                    40: string;
                    50: string;
                    60: string;
                    70: string;
                    80: string;
                    90: string;
                    95: string;
                    99: string;
                    100: string;
                };
                neutral: {
                    0: string;
                    10: string;
                    20: string;
                    30: string;
                    40: string;
                    50: string;
                    60: string;
                    70: string;
                    80: string;
                    90: string;
                    95: string;
                    99: string;
                    100: string;
                };
                neutralVariant: {
                    0: string;
                    10: string;
                    20: string;
                    30: string;
                    40: string;
                    50: string;
                    60: string;
                    70: string;
                    80: string;
                    90: string;
                    95: string;
                    99: string;
                    100: string;
                };
                error: {
                    0: string;
                    10: string;
                    20: string;
                    30: string;
                    40: string;
                    50: string;
                    60: string;
                    70: string;
                    80: string;
                    90: string;
                    95: string;
                    99: string;
                    100: string;
                };
            };
        };
    };
};
/**
 * Type definition for the Schmancy Material Design 3 theme configuration.
 * Complete theme system with colors, typography, shape, motion, and state layers.
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
 *         default: '#6750A4',
 *         container: '#EADDFF'
 *       }
 *     },
 *     shape: {
 *       corner: {
 *         medium: '12px'
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

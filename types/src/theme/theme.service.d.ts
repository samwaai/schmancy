import { Observable } from 'rxjs';
import type { SchmancyThemeComponent } from './theme.component';
import type { TSchmancyTheme } from './theme.interface';
/**
 * Theme Service - Provides centralized theme management for Schmancy components.
 *
 * This service acts as a singleton interface to interact with the theme system,
 * providing reactive observables for theme state and methods to control theming.
 *
 * @example
 * ```typescript
 * import { theme } from '@schmancy/theme'
 *
 * // Subscribe to theme changes
 * theme.scheme$.subscribe(scheme => {
 *   console.log('Current scheme:', scheme) // 'light' | 'dark' | 'auto'
 * })
 *
 * // Get current values synchronously
 * const currentScheme = theme.scheme
 * const currentColor = theme.color
 *
 * // Toggle between light and dark mode
 * theme.toggleScheme()
 *
 * // Set specific scheme
 * theme.setScheme('dark')
 *
 * // Check if dark mode is active
 * theme.isDarkMode().subscribe(isDark => {
 *   console.log('Is dark mode:', isDark)
 * })
 * ```
 */
declare class ThemeService {
    private static instance;
    private _scheme$;
    private _color$;
    private _theme$;
    private _themeComponent$;
    readonly scheme$: Observable<"auto" | "dark" | "light">;
    readonly color$: Observable<string>;
    readonly theme$: Observable<Partial<{
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
    }>>;
    readonly themeComponent$: Observable<SchmancyThemeComponent>;
    get scheme(): 'dark' | 'light' | 'auto';
    get color(): string;
    get theme(): Partial<TSchmancyTheme>;
    get themeComponent(): SchmancyThemeComponent | null;
    readonly resolvedScheme$: Observable<"dark" | "light">;
    constructor();
    /**
     * Discover the nearest theme component in the DOM.
     * This method can be called to refresh the theme discovery process.
     *
     * @returns {Observable<SchmancyThemeComponent | null>} Observable that emits the discovered theme component or null
     *
     * @example
     * ```typescript
     * theme.discoverTheme().subscribe(component => {
     *   if (component) {
     *     console.log('Theme component found:', component)
     *   } else {
     *     console.log('No theme component found')
     *   }
     * })
     * ```
     */
    discoverTheme(): Observable<SchmancyThemeComponent | null>;
    /**
     * Register a theme component and subscribe to its changes.
     * This is typically called internally by theme components when they mount or update.
     *
     * @param {SchmancyThemeComponent} component - The theme component to register
     *
     * @internal
     */
    registerThemeComponent(component: SchmancyThemeComponent): void;
    /**
     * Update theme values. Usually called internally by theme components.
     *
     * @param {Object} values - Theme values to update
     * @param {'dark' | 'light' | 'auto'} [values.scheme] - Color scheme to set
     * @param {string} [values.color] - Primary color in hex format
     * @param {Partial<TSchmancyTheme>} [values.theme] - Theme configuration object
     *
     * @internal
     */
    updateTheme(values: {
        scheme?: 'dark' | 'light' | 'auto';
        color?: string;
        theme?: Partial<TSchmancyTheme>;
    }): void;
    /**
     * Set the color scheme for the application.
     *
     * @param {'dark' | 'light' | 'auto'} scheme - The color scheme to set
     *
     * @example
     * ```typescript
     * // Set to dark mode
     * theme.setScheme('dark')
     *
     * // Set to auto (follows system preference)
     * theme.setScheme('auto')
     * ```
     */
    setScheme(scheme: 'dark' | 'light' | 'auto'): void;
    /**
     * Set the primary color for the theme.
     *
     * @param {string} color - Primary color in hex format (e.g., '#6200ee')
     *
     * @example
     * ```typescript
     * // Set primary color to purple
     * theme.setColor('#6200ee')
     *
     * // Set primary color to blue
     * theme.setColor('#2196f3')
     * ```
     */
    setColor(color: string): void;
    /**
     * Check if dark mode is currently active.
     * This resolves 'auto' scheme to the actual value based on system preference.
     *
     * @returns {Observable<boolean>} Observable that emits true if dark mode is active, false otherwise
     *
     * @example
     * ```typescript
     * theme.isDarkMode().subscribe(isDark => {
     *   if (isDark) {
     *     console.log('Dark mode is active')
     *   } else {
     *     console.log('Light mode is active')
     *   }
     * })
     * ```
     */
    isDarkMode(): Observable<boolean>;
    /**
     * Toggle between light and dark mode.
     * If currently in 'auto' mode, defaults to 'light'.
     *
     * @example
     * ```typescript
     * // Toggle theme on button click
     * button.addEventListener('click', () => {
     *   theme.toggleScheme()
     * })
     * ```
     */
    toggleScheme(): void;
    /**
     * Get the current value of a CSS variable from the theme.
     *
     * @param {string} variableName - Name of the CSS variable (without '--schmancy-' prefix)
     * @returns {string} The CSS variable value or empty string if not found
     *
     * @example
     * ```typescript
     * // Get primary color variable
     * const primaryColor = theme.getCSSVariable('color-primary')
     *
     * // Get surface color
     * const surfaceColor = theme.getCSSVariable('color-surface')
     * ```
     */
    getCSSVariable(variableName: string): string;
    /**
     * Subscribe to changes of a specific CSS variable.
     *
     * @param {string} variableName - Name of the CSS variable to watch (without '--schmancy-' prefix)
     * @returns {Observable<string>} Observable that emits the CSS variable value when it changes
     *
     * @example
     * ```typescript
     * // Watch for primary color changes
     * theme.watchCSSVariable('color-primary').subscribe(color => {
     *   console.log('Primary color changed to:', color)
     * })
     *
     * // Watch for surface color changes
     * theme.watchCSSVariable('color-surface').subscribe(color => {
     *   console.log('Surface color changed to:', color)
     * })
     * ```
     */
    watchCSSVariable(variableName: string): Observable<string>;
    /**
     * Get the singleton instance of ThemeService.
     *
     * @returns {ThemeService} The singleton ThemeService instance
     *
     * @internal
     */
    static getInstance(): ThemeService;
}
export declare const theme: ThemeService;
export default theme;

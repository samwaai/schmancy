import { Observable } from 'rxjs';
import type { SchmancyThemeComponent } from './theme.component';
import type { TSchmancyTheme } from './theme.interface';
/**
 * Theme Service - Provides easy access to the current active theme
 * Similar to area and sheet services, this provides a singleton interface
 * to interact with the theme system
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
    }>>;
    readonly themeComponent$: Observable<SchmancyThemeComponent>;
    get scheme(): 'dark' | 'light' | 'auto';
    get color(): string;
    get theme(): Partial<TSchmancyTheme>;
    get themeComponent(): SchmancyThemeComponent | null;
    readonly resolvedScheme$: Observable<"dark" | "light">;
    constructor();
    /**
     * Discover the nearest theme component in the DOM
     * This method can be called to refresh the theme discovery
     */
    discoverTheme(): Observable<SchmancyThemeComponent | null>;
    /**
     * Register a theme component and subscribe to its changes
     * This is called by theme components when they mount/update
     */
    registerThemeComponent(component: SchmancyThemeComponent): void;
    /**
     * Update theme values (usually called by theme component)
     */
    updateTheme(values: {
        scheme?: 'dark' | 'light' | 'auto';
        color?: string;
        theme?: Partial<TSchmancyTheme>;
    }): void;
    /**
     * Set the color scheme
     */
    setScheme(scheme: 'dark' | 'light' | 'auto'): void;
    /**
     * Set the primary color
     */
    setColor(color: string): void;
    /**
     * Check if dark mode is active (resolving 'auto' to actual value)
     */
    isDarkMode(): Observable<boolean>;
    /**
     * Toggle between light and dark mode
     */
    toggleScheme(): void;
    /**
     * Get CSS variable value from theme
     */
    getCSSVariable(variableName: string): string;
    /**
     * Subscribe to CSS variable changes
     */
    watchCSSVariable(variableName: string): Observable<string>;
    /**
     * Get singleton instance
     */
    static getInstance(): ThemeService;
}
export declare const theme: ThemeService;
export default theme;

import { TSchmancyTheme } from './theme.interface';
export declare const tailwindStyles: import("lit").CSSResult;
declare const SchmancyThemeComponent_base: CustomElementConstructor & import("@mixins/index").Constructor<import("lit").LitElement> & import("@mixins/index").Constructor<import("@mixins/index").IBaseMixin>;
/**
 * SchmancyThemeComponent - Provides theming capabilities for Schmancy components.
 *
 * This component manages color schemes, primary colors, and theme distribution
 * throughout the component tree. It can be used at the root level or nested
 * to provide different themes to different parts of the application.
 *
 * @element schmancy-theme
 *
 * @example
 * ```html
 * <!-- Root theme provider -->
 * <schmancy-theme color="#6200ee" scheme="auto" root>
 *   <your-app></your-app>
 * </schmancy-theme>
 *
 * <!-- Nested theme for specific section -->
 * <schmancy-theme color="#2196f3" scheme="dark">
 *   <div class="dark-section">
 *     <!-- Components here will use blue dark theme -->
 *   </div>
 * </schmancy-theme>
 * ```
 */
export declare class SchmancyThemeComponent extends SchmancyThemeComponent_base {
    /**
     * Primary color for the theme in hex format.
     * @attr color
     * @type {string}
     * @default Random generated color
     * @example "#6200ee"
     */
    color: string;
    /**
     * Color scheme for the theme.
     * @attr scheme
     * @type {'dark' | 'light' | 'auto'}
     * @default 'auto'
     */
    scheme: 'dark' | 'light' | 'auto';
    /**
     * Whether this theme should be applied at the root level (document.body).
     * @attr root
     * @type {boolean}
     * @default false
     */
    root: boolean;
    /**
     * Unique name for this theme instance (used for session storage).
     * If not provided, will be generated from DOM path.
     * @attr name
     * @type {string}
     */
    name?: string;
    /**
     * Theme configuration object containing all theme variables.
     * @property {Partial<TSchmancyTheme>} theme
     * @internal
     */
    theme: Partial<TSchmancyTheme>;
    connectedCallback(): void;
    updated(changedProperties: Map<string | number | symbol, unknown>): void;
    registerTheme(): void;
    registerThemeValues(prefix: string, path: string, value: Partial<TSchmancyTheme>): string | undefined;
    generateRandomColor(): string;
    /**
     * Generate a unique theme name based on DOM path
     */
    private generateThemeName;
    protected render(): unknown;
}
declare global {
    interface HTMLElementTagNameMap {
        'schmancy-theme': SchmancyThemeComponent;
    }
}
export {};

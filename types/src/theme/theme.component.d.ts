import { TSchmancyTheme } from './theme.interface';
export declare const tailwindStyles: import("lit").CSSResult;
declare const SchmancyThemeComponent_base: CustomElementConstructor & import("../../mixins/constructor").Constructor<import("lit").LitElement> & import("../../mixins/constructor").Constructor<import("../../mixins/baseElement").IBaseMixin>;
/**
 * Theme provider — generates a Material 3 palette from a seed color, resolves light/dark scheme, and publishes the token set to descendants as CSS custom properties (var(--schmancy-sys-color-…)).
 *
 * @element schmancy-theme
 * @summary Always wrap your app root in a `<schmancy-theme root scheme="auto" color="#…">`. Nest additional `<schmancy-theme>` blocks to override theming for a subtree.
 * @example
 * <!-- Root theme provider -->
 * <schmancy-theme root scheme="auto" color="#6200ee">
 *   <your-app></your-app>
 * </schmancy-theme>
 * @example
 * <!-- Nested theme for a specific section -->
 * <schmancy-theme scheme="dark" color="#2196f3">
 *   <schmancy-surface fill="all">
 *     <!-- Components here use the blue dark theme -->
 *   </schmancy-surface>
 * </schmancy-theme>
 * @platform div - Styled `<div>` that publishes theme tokens via inline `--schmancy-sys-color-*` custom properties. Degrades to a plain div if the tag never registers — children lose theming and fall back to browser defaults.
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
     * Locale for number/date formatting. Overrides navigator.language when set.
     * @attr locale
     * @type {string}
     * @default navigator.language
     * @example "de-DE", "en-US", "ar-SA"
     */
    locale: string;
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

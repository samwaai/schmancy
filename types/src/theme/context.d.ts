/**
 * Lit Context for sharing theme configuration across components.\n *
 * This context is provided by SchmancyThemeComponent and can be consumed
 * by any child component to access the current theme configuration.
 *
 * @type {Context<Partial<TSchmancyTheme>>}
 *
 * @example
 * ```typescript
 * import { consume } from '@lit/context'
 * import { themeContext } from '@schmancy/theme'
 *
 * class MyComponent extends LitElement {
 *   @consume({ context: themeContext })
 *   theme?: Partial<TSchmancyTheme>
 *
 *   render() {
 *     // Access theme variables
 *     const primaryColor = this.theme?.sys?.color?.primary?.default
 *     // ...
 *   }
 * }
 * ```
 */
export declare const themeContext: {
    __context__: Partial<{
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
    }>;
};

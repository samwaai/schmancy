import { createContext } from '@lit/context'
import { TSchmancyTheme } from './theme.interface'

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
export const themeContext = createContext<Partial<TSchmancyTheme>>('theme-context')

import { createContext } from '@lit/context'
import { TSchmancyTheme } from './theme.interface'

export const themeContext = createContext<Partial<TSchmancyTheme>>('theme-context')

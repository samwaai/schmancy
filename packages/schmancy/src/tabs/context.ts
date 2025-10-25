import { createContext } from '@lit/context'

export type TSchmancyTabsMode = 'scroll' | 'tabs'

export const SchmancyTabsModeContext = createContext<TSchmancyTabsMode>('tabs')

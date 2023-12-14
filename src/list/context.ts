import { createContext } from '@lit/context'
export type SchmancyListVariant = 'surface' | 'surfaceVariant' | 'container'
export const SchmancyListContext = createContext<SchmancyListVariant>('surface')

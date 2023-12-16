import { createContext } from '@lit/context'
export type SchmancyListType = 'surface' | 'surfaceVariant' | 'container'
export const SchmancyListTypeContext = createContext<SchmancyListType>('surface')

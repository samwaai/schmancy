import { createContext } from '@lit/context'
export type TSchmancyContentDrawerSheetMode = 'push' | 'overlay' | undefined
export const SchmancyContentDrawerSheetMode = createContext<TSchmancyContentDrawerSheetMode>(undefined)

export type TSchmancyContentDrawerSheetState = 'open' | 'close' | undefined
export const SchmancyContentDrawerSheetState = createContext<TSchmancyContentDrawerSheetState>(undefined)

export const SchmancyContentDrawerID = createContext<string>(Math.floor(Math.random() * Date.now()).toString())

import { createContext } from '@lit/context'
export type TSchmancyContentDrawerSheetMode = 'push' | 'overlay'
export const SchmancyContentDrawerSheetMode = createContext<TSchmancyContentDrawerSheetMode>('push')

export type TSchmancyContentDrawerSheetState = 'open' | 'close'
export const SchmancyContentDrawerSheetState = createContext<TSchmancyContentDrawerSheetState>('close')

export const SchmancyContentDrawerID = createContext<string>(Math.floor(Math.random() * Date.now()).toString())
export const SchmancyContentDrawerMaxHeight = createContext<string>('100%')
export const SchmancyContentDrawerMinWidth = createContext<{
	main: number
	sheet: number
}>({})

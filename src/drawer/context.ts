import { createContext } from '@lit/context'
export type TSchmancyDrawerSidebarMode = 'push' | 'overlay' | undefined
export const SchmancyDrawerSidebarMode = createContext<TSchmancyDrawerSidebarMode>('push')

export type TSchmancyDrawerSidebarState = 'open' | 'close' | undefined
export const SchmancyDrawerSidebarState = createContext<TSchmancyDrawerSidebarState>('close')

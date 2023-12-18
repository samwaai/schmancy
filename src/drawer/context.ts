import { createContext } from '@lit/context'
export type TSchmancyDrawerSidebarMode = 'push' | 'overlay'
export const SchmancyDrawerSidebarMode = createContext<TSchmancyDrawerSidebarMode>('push')

export type TSchmancyDrawerSidebarState = 'open' | 'close'
export const SchmancyDrawerSidebarState = createContext<TSchmancyDrawerSidebarState>('close')

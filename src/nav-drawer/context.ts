import { createContext } from '@lit/context'
export type TSchmancyDrawerNavbarMode = 'push' | 'overlay' | undefined
export const SchmancyDrawerNavbarMode = createContext<TSchmancyDrawerNavbarMode>('push')

export type TSchmancyDrawerNavbarState = 'open' | 'close' | undefined
export const SchmancyDrawerNavbarState = createContext<TSchmancyDrawerNavbarState>('close')

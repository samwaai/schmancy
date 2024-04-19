import { createContext } from '@lit/context'
import { BehaviorSubject } from 'rxjs'
// create a lit context for the invoices

import { IFunkhausEvent } from 'src/types/events.types'
import eventsData from './events.data'

export const EventsContext = createContext<IFunkhausEvent[]>('events')

export const $currentEvent = new BehaviorSubject<IFunkhausEvent>(
	(localStorage.getItem('currentEvent') as any) ?? eventsData[0],
)

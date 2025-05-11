import { Observable, ReplaySubject, Subject, bufferTime, filter, fromEvent, map, of, skip, tap, timeout, zip } from 'rxjs'
import { SchmancyTeleportation } from '../teleport'
import { ActiveRoute, AreaSubscription, RouteAction } from './router.types'

export const routerHistory = new Subject<RouteAction>()

export const FINDING_MORTIES = 'FINDING_MORTIES'
export const HERE_RICKY = 'HERE_RICKY'
export type HERE_RICKY_EVENT = CustomEvent<{
	component: SchmancyTeleportation
}>
export type FINDING_MORTIES_EVENT = CustomEvent<{
	component: SchmancyTeleportation
}>

class AreaService implements AreaSubscription {
	private static instance: AreaService
	public prettyURL = false
	public mode: 'SILENT' | 'HISTORY' = 'HISTORY'
	public request = new ReplaySubject<RouteAction>(1)
	public current = new Map<string, ActiveRoute>()
	public $current = new ReplaySubject<Map<string, ActiveRoute>>(1)
	
	// Create a dictionary of ReplaySubjects for area-specific subscriptions
	private areaSubjects = new Map<string, ReplaySubject<ActiveRoute>>()
	
	public enableHistoryMode = true
	private findingMortiesEvent = new CustomEvent<FINDING_MORTIES_EVENT['detail']>(FINDING_MORTIES)

	constructor() {
		this.$current.next(this.current)
		
		// Subscribe to current changes to update area-specific subjects
		this.$current.subscribe(currentAreas => {
			// For each area in the current map
			currentAreas.forEach((route, areaName) => {
				// Get or create a subject for this area
				const areaSubject = this.getOrCreateAreaSubject(areaName)
				// Emit the updated route to area-specific subscribers
				areaSubject.next(route)
			})
		})
	}

	/**
	 * Get or create a ReplaySubject for a specific area
	 * @param areaName The name of the area
	 * @returns ReplaySubject for the specified area
	 */
	private getOrCreateAreaSubject(areaName: string): ReplaySubject<ActiveRoute> {
		if (!this.areaSubjects.has(areaName)) {
			const subject = new ReplaySubject<ActiveRoute>(1)
			this.areaSubjects.set(areaName, subject)
			
			// If the area already exists in current, emit it immediately
			const currentRoute = this.current.get(areaName)
			if (currentRoute) {
				subject.next({
					...currentRoute,
					// Ensure state and params are initialized if undefined
					state: currentRoute.state || {},
					params: currentRoute.params || {}
				})
			}
		}
		
		const subject = this.areaSubjects.get(areaName)
		if (!subject) {
			throw new Error(`Failed to create or retrieve subject for area: ${areaName}`)
		}
		
		return subject
	}

	/**
	 * Subscribe to a specific area
	 * @param areaName Name of the area to subscribe to
	 * @param skipCurrent Whether to skip the current value
	 * @returns Observable of the active route for the specified area
	 */
	on(areaName: string, skipCurrent = false): Observable<ActiveRoute> {
		const areaSubject = this.getOrCreateAreaSubject(areaName)
		
		return skipCurrent ? areaSubject.pipe(skip(1)) : areaSubject.asObservable()
	}
	
	/**
	 * Subscribe to all areas
	 * @param skipCurrent Whether to skip the current value
	 * @returns Observable of all active routes
	 */
	all(skipCurrent = false): Observable<Map<string, ActiveRoute>> {
		return skipCurrent ? this.$current.pipe(skip(1)) : this.$current.asObservable()
	}
	
	/**
	 * Get state from an area
	 * @param areaName Name of the area to subscribe to
	 * @returns Observable of the area's state
	 */
	getState<T = unknown>(areaName: string): Observable<T> {
		return this.on(areaName).pipe(
			map(route => route.state as unknown),
			filter((state): state is NonNullable<unknown> => state !== undefined),
			map(state => state as T)
		)
	}
	
	/**
	 * Get params from an area
	 * @param areaName Name of the area to subscribe to
	 * @returns Observable of the area's params
	 */
	params<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): Observable<T> {
		return this.on(areaName).pipe(
			map(route => route.params as unknown),
			filter((params): params is NonNullable<unknown> => params !== undefined),
			map(params => params as T)
		)
	}
	
	/**
	 * Get a specific param from an area
	 * @param areaName Name of the area to subscribe to
	 * @param key Key of the param to select
	 * @returns Observable of the param value
	 */
	param<T = unknown>(areaName: string, key: string): Observable<T> {
		return this.params<Record<string, unknown>>(areaName).pipe(
			map(params => params[key] as unknown),
			filter((value): value is NonNullable<unknown> => value !== undefined),
			map(value => value as T)
		)
	}

	find() {
		return zip([
			fromEvent<HERE_RICKY_EVENT>(window, HERE_RICKY).pipe(
				map(e => e.detail),
				bufferTime(0),
				tap(console.log),
			),
			of(1).pipe(tap(() => window.dispatchEvent(this.findingMortiesEvent))),
		]).pipe(
			map(([component]) => component),
			timeout(1),
		)
	}

	/**
	 * Push a new route action
	 * @param r Route action to push
	 */
	push(r: RouteAction) {
		// Ensure state and params are initialized
		const routeAction = {
			...r,
			state: r.state || {},
			params: r.params || {}
		}
		
		this.request.next(routeAction)
		// Emit an area-specific event for those who want to listen directly to DOM events
		this.dispatchAreaEvent(routeAction.area, routeAction)
	}
	
	/**
	 * Dispatch a DOM event for a specific area change
	 * @param areaName Name of the area that changed
	 * @param routeAction The route action that was pushed
	 */
	private dispatchAreaEvent(areaName: string, routeAction: RouteAction) {
		const eventName = `schmancy-area-${areaName}-changed`
		const event = new CustomEvent(eventName, { 
			detail: { 
				area: areaName,
				component: routeAction.component,
				state: routeAction.state,
				params: routeAction.params,
				historyStrategy: routeAction.historyStrategy
			},
			bubbles: true,
			composed: true
		})
		window.dispatchEvent(event)
	}

	pop(name: string) {
		const newState = JSON.parse(JSON.stringify(area.state))
		delete newState[name]
		console.log(area.state, newState)
		history.replaceState(null, '', encodeURIComponent(JSON.stringify(newState)))
	}
	
	static getInstance() {
		if (!AreaService.instance) {
			AreaService.instance = new AreaService()
		}
		return AreaService.instance
	}

	get state() {
		const pathname = location.pathname.split('/').pop()
		let areaState = {}
		try {
			areaState = pathname ? JSON.parse(decodeURIComponent(pathname)) : {}
		} catch {
			areaState = {}
		}
		return areaState
	}
}

export const area = AreaService.getInstance()
export default area

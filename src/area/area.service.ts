import { 
	Observable, 
	ReplaySubject, 
	Subject, 
	bufferTime, 
	filter, 
	fromEvent, 
	map, 
	of, 
	skip, 
	tap, 
	timeout, 
	zip,
	shareReplay,
	distinctUntilChanged,
	catchError,
	EMPTY
} from 'rxjs'
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

// WeakMap for better memory management of area subjects
const areaSubjectsCache = new WeakMap<AreaService, Map<string, ReplaySubject<ActiveRoute>>>()

class AreaService implements AreaSubscription {
	private static instance: AreaService
	public prettyURL = false
	public mode: 'SILENT' | 'HISTORY' = 'HISTORY'
	public request = new ReplaySubject<RouteAction>(1)
	public current = new Map<string, ActiveRoute>()
	public $current = new ReplaySubject<Map<string, ActiveRoute>>(1)
	
	// Create a dictionary of ReplaySubjects for area-specific subscriptions
	private get areaSubjects(): Map<string, ReplaySubject<ActiveRoute>> {
		let subjects = areaSubjectsCache.get(this)
		if (!subjects) {
			subjects = new Map()
			areaSubjectsCache.set(this, subjects)
		}
		return subjects
	}
	
	public enableHistoryMode = true
	private findingMortiesEvent = new CustomEvent<FINDING_MORTIES_EVENT['detail']>(FINDING_MORTIES)
	private disposed = false

	constructor() {
		this.$current.next(this.current)
		
		// Subscribe to current changes to update area-specific subjects
		this.$current.subscribe(currentAreas => {
			if (this.disposed) return
			
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
	 * Get or create a ReplaySubject for a specific area with proper cleanup
	 */
	private getOrCreateAreaSubject(areaName: string): ReplaySubject<ActiveRoute> {
		let subject = this.areaSubjects.get(areaName)
		
		if (!subject || subject.closed) {
			subject = new ReplaySubject<ActiveRoute>(1)
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
		
		return subject
	}

	/**
	 * Subscribe to a specific area with caching
	 */
	on(areaName: string, skipCurrent = false): Observable<ActiveRoute> {
		if (!areaName) {
			throw new Error('Area name is required')
		}
		
		const areaSubject = this.getOrCreateAreaSubject(areaName)
		const observable = areaSubject.asObservable().pipe(
			// Add distinct to prevent duplicate emissions
			distinctUntilChanged((a, b) => 
				a.component === b.component &&
				JSON.stringify(a.state) === JSON.stringify(b.state) &&
				JSON.stringify(a.params) === JSON.stringify(b.params)
			),
			// Share the subscription
			shareReplay(1)
		)
		
		return skipCurrent ? observable.pipe(skip(1)) : observable
	}
	
	/**
	 * Subscribe to all areas
	 */
	all(skipCurrent = false): Observable<Map<string, ActiveRoute>> {
		const observable = this.$current.asObservable().pipe(
			shareReplay(1)
		)
		return skipCurrent ? observable.pipe(skip(1)) : observable
	}
	
	/**
	 * Get state from an area with type safety
	 */
	getState<T = unknown>(areaName: string): Observable<T> {
		if (!areaName) {
			throw new Error('Area name is required')
		}
		
		return this.on(areaName).pipe(
			map(route => route.state),
			filter((state): state is NonNullable<Record<string, unknown>> => 
				state !== undefined && state !== null
			),
			distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
			map(state => state as T),
			catchError(err => {
				console.error(`Error getting state for area "${areaName}":`, err)
				return EMPTY
			})
		)
	}
	
	/**
	 * Get params from an area with type safety
	 */
	params<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): Observable<T> {
		if (!areaName) {
			throw new Error('Area name is required')
		}
		
		return this.on(areaName).pipe(
			map(route => route.params),
			filter((params): params is NonNullable<Record<string, unknown>> => 
				params !== undefined && params !== null
			),
			distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
			map(params => params as T),
			catchError(err => {
				console.error(`Error getting params for area "${areaName}":`, err)
				return EMPTY
			})
		)
	}
	
	/**
	 * Get a specific param from an area with null safety
	 */
	param<T = unknown>(areaName: string, key: string): Observable<T> {
		if (!areaName || !key) {
			throw new Error('Area name and key are required')
		}
		
		return this.params<Record<string, unknown>>(areaName).pipe(
			map(params => params[key]),
			filter((value): value is NonNullable<unknown> => value !== undefined),
			distinctUntilChanged(),
			map(value => value as T),
			catchError(err => {
				console.error(`Error getting param "${key}" for area "${areaName}":`, err)
				return EMPTY
			})
		)
	}

	/**
	 * Find teleportation components
	 */
	find() {
		return zip([
			fromEvent<HERE_RICKY_EVENT>(window, HERE_RICKY).pipe(
				map(e => e.detail),
				bufferTime(0),
			),
			of(1).pipe(tap(() => window.dispatchEvent(this.findingMortiesEvent))),
		]).pipe(
			map(([component]) => component),
			timeout(1),
			catchError(() => EMPTY)
		)
	}

	/**
	 * Push a new route action with validation
	 */
	push(r: RouteAction) {
		if (!r.area) {
			throw new Error('Area is required for route action')
		}
		
		// Ensure state and params are initialized
		const routeAction: RouteAction = {
			...r,
			state: r.state || {},
			params: r.params || {}
		}
		
		// Add to history if enabled
		if (this.enableHistoryMode) {
			routerHistory.next(routeAction)
		}
		
		this.request.next(routeAction)
		// Emit an area-specific event for those who want to listen directly to DOM events
		this.dispatchAreaEvent(routeAction.area, routeAction)
	}
	
	/**
	 * Dispatch a DOM event for a specific area change
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

	/**
	 * Remove an area from the current state
	 */
	pop(name: string) {
		if (!name) {
			throw new Error('Area name is required')
		}
		
		const newState = { ...this.state }
		delete newState[name]
		
		// Update the URL
		const encoded = encodeURIComponent(JSON.stringify(newState))
		history.replaceState(null, '', `/${encoded}${location.search}`)
		
		// Remove from current map
		this.current.delete(name)
		this.$current.next(this.current)
		
		// Complete the area subject
		const areaSubject = this.areaSubjects.get(name)
		if (areaSubject) {
			areaSubject.complete()
			this.areaSubjects.delete(name)
		}
	}
	
	/**
	 * Clear all areas
	 */
	clear() {
		// Complete all area subjects
		this.areaSubjects.forEach(subject => subject.complete())
		this.areaSubjects.clear()
		
		// Clear current state
		this.current.clear()
		this.$current.next(this.current)
		
		// Update URL
		history.replaceState(null, '', `/${location.search}`)
	}
	
	/**
	 * Dispose of the service and clean up resources
	 */
	dispose() {
		if (this.disposed) return
		
		this.disposed = true
		
		// Complete all subjects
		this.areaSubjects.forEach(subject => subject.complete())
		this.areaSubjects.clear()
		
		this.request.complete()
		this.$current.complete()
		routerHistory.complete()
		
		// Clear references
		this.current.clear()
		areaSubjectsCache.delete(this)
	}
	
	/**
	 * Get singleton instance
	 */
	static getInstance() {
		if (!AreaService.instance) {
			AreaService.instance = new AreaService()
		}
		return AreaService.instance
	}

	/**
	 * Get current state from URL
	 */
	get state(): Record<string, unknown> {
		const pathname = location.pathname.split('/').pop()
		if (!pathname) return {}
		
		try {
			const decoded = decodeURIComponent(pathname)
			const parsed = JSON.parse(decoded)
			
			if (typeof parsed === 'object' && parsed !== null) {
				return parsed
			}
		} catch {
			// Ignore parse errors
		}
		
		return {}
	}
	
	/**
	 * Check if an area exists in current state
	 */
	hasArea(areaName: string): boolean {
		return this.current.has(areaName)
	}
	
	/**
	 * Get all active area names
	 */
	getActiveAreas(): string[] {
		return Array.from(this.current.keys())
	}
	
	/**
	 * Get route for a specific area synchronously
	 */
	getRoute(areaName: string): ActiveRoute | undefined {
		return this.current.get(areaName)
	}
}

export const area = AreaService.getInstance()
export default area

// Cleanup on page unload
if (typeof window !== 'undefined') {
	window.addEventListener('unload', () => {
		area.dispose()
	})
}
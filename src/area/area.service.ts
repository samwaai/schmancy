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

// Track navigation source to prevent history conflicts
type NavigationSource = 'programmatic' | 'browser' | 'initial'

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
	public isProcessingPopstate = false

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

		// Initialize from browser state if available
		this.initializeFromBrowserState()
	}

	/**
	 * Initialize router state from browser history state
	 */
	private initializeFromBrowserState() {
		try {
			const browserState = history.state
			if (browserState && browserState.schmancyAreas) {
				Object.entries(browserState.schmancyAreas).forEach(([areaName, route]) => {
					this.current.set(areaName, route as ActiveRoute)
				})
				this.$current.next(this.current)
			}
		} catch (error) {
			console.warn('Failed to initialize from browser state:', error)
		}
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
					// Ensure state, params and props are initialized if undefined
					state: currentRoute.state || {},
					params: currentRoute.params || {},
					props: currentRoute.props || {}
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
			// Add distinct to prevent duplicate emissions - now includes state
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
	 * Get props from an area with type safety
	 */
	props<T extends Record<string, unknown> = Record<string, unknown>>(areaName: string): Observable<T> {
		if (!areaName) {
			throw new Error('Area name is required')
		}
		
		return this.on(areaName).pipe(
			map(route => route.props),
			filter((props): props is NonNullable<Record<string, unknown>> => 
				props !== undefined && props !== null
			),
			distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
			map(props => props as T),
			catchError(err => {
				console.error(`Error getting props for area "${areaName}":`, err)
				return EMPTY
			})
		)
	}
	
	/**
	 * Get a specific prop from an area with null safety
	 */
	prop<T = unknown>(areaName: string, key: string): Observable<T> {
		if (!areaName || !key) {
			throw new Error('Area name and key are required')
		}
		
		return this.props<Record<string, unknown>>(areaName).pipe(
			map(props => props[key]),
			filter((value): value is NonNullable<unknown> => value !== undefined),
			distinctUntilChanged(),
			map(value => value as T),
			catchError(err => {
				console.error(`Error getting prop "${key}" for area "${areaName}":`, err)
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
		
		// Prevent processing during popstate handling
		if (this.isProcessingPopstate) {
			return
		}
		
		// Ensure state, params and props are initialized
		const routeAction: RouteAction = {
			...r,
			state: r.state || {},
			params: r.params || {},
			props: r.props || {},
			_source: 'programmatic' as NavigationSource
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
	 * Internal method to update route from browser navigation
	 * This should only be called by area components during popstate handling
	 */
	_updateFromBrowser(routeAction: RouteAction) {
		const enhancedRoute: RouteAction = {
			...routeAction,
			state: routeAction.state || {},
			params: routeAction.params || {},
			props: routeAction.props || {},
			_source: 'browser' as NavigationSource
		}
		
		this.isProcessingPopstate = true
		this.request.next(enhancedRoute)
		this.isProcessingPopstate = false
	}

	/**
	 * Update browser history state (called by area components)
	 */
	_updateBrowserHistory(areaName: string, route: ActiveRoute, historyStrategy?: string, clearQueryParams?: string[] | boolean | null) {
		if (!this.enableHistoryMode) return
		
		try {
			// Get current browser state or create new one
			const currentState = history.state || {}
			const schmancyAreas = currentState.schmancyAreas || {}
			
			// Update the specific area - only include non-empty state/params/props
			const areaData: any = {
				component: route.component,
				area: route.area
			}
			
			// Only include state if it has content
			if (route.state && Object.keys(route.state).length > 0) {
				areaData.state = route.state
			}
			
			// Only include params if it has content
			if (route.params && Object.keys(route.params).length > 0) {
				areaData.params = route.params
			}
			
			// Only include props if it has content
			if (route.props && Object.keys(route.props).length > 0) {
				areaData.props = route.props
			}
			
			schmancyAreas[areaName] = areaData
			
			const newState = {
				...currentState,
				schmancyAreas
			}
			
			// Create clean URL
			const url = this.createCleanURL(schmancyAreas, clearQueryParams)
			
			// Update browser history
			if (historyStrategy === 'replace' || historyStrategy === 'pop') {
				history.replaceState(newState, '', url)
			} else if (historyStrategy === 'push' || !historyStrategy) {
				history.pushState(newState, '', url)
			}
			// 'silent' strategy doesn't update browser history
			
		} catch (error) {
			console.error('Failed to update browser history:', error)
		}
	}

	/**
	 * Create a clean URL from area states
	 */
	private createCleanURL(areas: Record<string, ActiveRoute>, clearQueryParams?: string[] | boolean | null): string {
		// Handle query parameters
		let queryString = ''
		
		if (clearQueryParams !== true) {
			// Get current query params
			const urlParams = new URLSearchParams(location.search)
			
			// Clear specific params if provided
			if (Array.isArray(clearQueryParams)) {
				clearQueryParams.forEach(param => urlParams.delete(param))
			}
			
			// Convert back to string
			queryString = urlParams.toString()
			queryString = queryString ? `?${queryString}` : ''
		}
		// If clearQueryParams === true, queryString remains empty (all params cleared)
		
		if (this.prettyURL) {
			// Create pretty URLs - customize this based on your routing needs
			const mainArea = areas.main
			if (mainArea) {
				let path = `/${mainArea.component}`
				
				// Add simple params to URL
				const searchParams = new URLSearchParams(queryString)
				if (mainArea.params) {
					Object.entries(mainArea.params).forEach(([key, value]) => {
						if (typeof value === 'string' || typeof value === 'number') {
							searchParams.set(key, String(value))
						}
					})
				}
				
				const query = searchParams.toString()
				return path + (query ? `?${query}` : '')
			}
		}
		
		// Fallback to encoded state in URL (original behavior)
		try {
			// Clean up empty objects before encoding
			const cleanedAreas: Record<string, any> = {}
			Object.entries(areas).forEach(([areaName, route]) => {
				const cleanRoute: any = { component: route.component }
				
				// Only include state if it has content
				if (route.state && Object.keys(route.state).length > 0) {
					cleanRoute.state = route.state
				}
				
				// Only include params if it has content
				if (route.params && Object.keys(route.params).length > 0) {
					cleanRoute.params = route.params
				}
				
				// Only include props if it has content
				if (route.props && Object.keys(route.props).length > 0) {
					cleanRoute.props = route.props
				}
				
				cleanedAreas[areaName] = cleanRoute
			})
			
			const encoded = encodeURIComponent(JSON.stringify(cleanedAreas))
			return `/${encoded}${queryString}`
		} catch (error) {
			console.error('Failed to encode URL state:', error)
			return location.pathname
		}
	}

	/**
	 * Restore state from browser history state
	 */
	restoreFromBrowserState(browserState: any): Record<string, ActiveRoute> {
		try {
			if (browserState && browserState.schmancyAreas) {
				return browserState.schmancyAreas
			}
		} catch (error) {
			console.error('Failed to restore from browser state:', error)
		}
		
		// Fallback to URL parsing (original behavior)
		return this.parseStateFromURL()
	}

	/**
	 * Parse state from URL (fallback method)
	 */
	private parseStateFromURL(): Record<string, ActiveRoute> {
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
				props: routeAction.props,
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

		// Before removing from current map, emit a clearing signal to the area's subject
		// This notifies the area component to clear itself
		const areaSubject = this.areaSubjects.get(name)
		if (areaSubject && !areaSubject.closed) {
			// Send a route with null component to signal clearing
			areaSubject.next({
				component: null as any,
				state: {},
				area: name,
				params: {},
				props: {}
			})
		}

		// Send a clearing signal through the request pipeline
		// This ensures the area component receives the signal to clear
		this.request.next({
			area: name,
			component: null as any,
			state: {},
			params: {},
			props: {},
			historyStrategy: 'silent' as any,
			_source: 'programmatic' as NavigationSource
		})

		// Remove from current map
		this.current.delete(name)
		this.$current.next(this.current)

		// Update browser history
		if (this.enableHistoryMode) {
			try {
				const currentState = history.state || {}
				const schmancyAreas = { ...(currentState.schmancyAreas || {}) }
				delete schmancyAreas[name]

				const newState = {
					...currentState,
					schmancyAreas
				}

				const url = this.createCleanURL(schmancyAreas)
				history.replaceState(newState, '', url)
			} catch (error) {
				console.error('Failed to update history after pop:', error)
			}
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
		if (this.enableHistoryMode) {
			history.replaceState({ schmancyAreas: {} }, '', `/${location.search}`)
		}
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
	 * Get current state from URL (deprecated - use browser state instead)
	 */
	get state(): Record<string, unknown> {
		// Try browser state first
		try {
			const browserState = history.state
			if (browserState && browserState.schmancyAreas) {
				return browserState.schmancyAreas
			}
		} catch {
			// Fallback to URL parsing
		}
		
		// Fallback to URL parsing (original behavior)
		return this.parseStateFromURL()
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
import { $LitElement } from '@mixins/index'
import { TemplateResult, css, html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import {
	EMPTY,
	Observable,
	Subscription,
	catchError,
	combineLatest,
	distinctUntilChanged,
	filter,
	from,
	fromEvent,
	map,
	merge,
	of,
	startWith,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs'
import area from './area.service'
import { SchmancyRoute } from './route.component'
import { ActiveRoute, HISTORY_STRATEGY, RouteAction } from './router.types'

// Component types that can be passed to area
type ComponentInput =
	| string // Tag name or path
	| CustomElementConstructor // Constructor function
	| HTMLElement // Existing element
	| TemplateResult<1> // Lit template
	| (() => Promise<{ default: CustomElementConstructor }>) // Lazy loader
	| Promise<{ default: CustomElementConstructor }> // Dynamic import

// Resolved component after processing
type ResolvedComponent = {
	element: HTMLElement | null
}

// Route source for debugging
type RouteSource = 'initial' | 'navigation' | 'popstate'


@customElement('schmancy-area')
export class SchmancyArea extends $LitElement(css`
	:host {
		position: relative;
		display: block;
		inset: 0;
	}
`) {
	/**
	 * The name of the router outlet
	 * @attr
	 * @type {string}
	 * @public
	 * @required
	 */
	@property() name!: string

	@property() default!: string | CustomElementConstructor | TemplateResult<1>

	/**
	 * Query for assigned route elements in the slot
	 * This will automatically update when slot content changes
	 */
	@queryAssignedElements({ selector: 'schmancy-route' })
	private routes!: SchmancyRoute[]

	/**
	 * Subscription to the routing pipeline
	 */
	private routingSubscription?: Subscription

	/**
	 * Unified route resolver that handles all routing scenarios
	 * This is the single source of truth for resolving routes
	 */
	private resolveRoute(
		source: RouteSource,
		data?: string | PopStateEvent | RouteAction | null,
		historyStrategy: HISTORY_STRATEGY = HISTORY_STRATEGY.silent,
		routes: SchmancyRoute[] = []
	): Observable<RouteAction> {

		switch (source) {
			case 'initial':
			case 'popstate': {
				// Handle initial load or popstate event
				if (source === 'popstate' && data && typeof data === 'object' && 'state' in data) {
					// Try to get from browser state first
					const event = data as PopStateEvent
					const state = event.state?.schmancyAreas?.[this.name]
					if (state) {
						return of({
							area: this.name,
							component: state.component,
							state: state.state || {},
							params: state.params || {},
							historyStrategy: HISTORY_STRATEGY.silent
						} as RouteAction)
					}
				}

				// Fall back to segment matching
				const pathname = typeof data === 'string' ? data : location.pathname
				return this.matchSegmentToRoute(pathname, historyStrategy, routes)
			}

			case 'navigation': {
				// Direct navigation request
				if (!data || typeof data !== 'object' || !('component' in data)) {
					return EMPTY
				}
				return of(data as RouteAction)
			}

			default:
				return EMPTY
		}
	}

	/**
	 * Match URL to route using both JSON-based (core) and segment-based (enhancement) routing
	 */
	private matchSegmentToRoute(pathname: string, historyStrategy: HISTORY_STRATEGY, routes: SchmancyRoute[]): Observable<RouteAction> {

		// 1. CORE LOGIC: Try JSON-based routing first (this is the primary routing mechanism)
		// JSON routing allows for complete state and component configuration via URL
		const lastSegment = pathname.split('/').pop() || ''

		if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
			try {
				const decoded = decodeURIComponent(lastSegment)
				const parsed = JSON.parse(decoded)

				// JSON was successfully parsed
				// Check if this specific area has a component in the JSON state
				if (parsed[this.name]) {
					return of({
						area: this.name,
						component: parsed[this.name].component,
						state: parsed[this.name].state || {},
						params: parsed[this.name].params || {},
						historyStrategy
					} as RouteAction)
				}

				// JSON exists but doesn't have a component for this area
				// Don't apply default - this area should remain empty
				return EMPTY

			} catch (e) {
				// Not valid JSON, continue to segment matching
			}
		}

		// 2. ENHANCEMENT: Try segment-based routing (new feature - only if routes are configured)
		// Segment routing provides clean URLs for defined routes
		if (routes && routes.length > 0) {
			// Extract the first segment from the pathname
			const segments = pathname.split('/').filter(Boolean)
			const currentSegment = segments[0] || ''

			// Find matching route by when attribute
			for (const route of routes) {
				const routeWhen = route.when

				if (routeWhen === currentSegment) {

					// Check guard if present
					if (route.guard) {
						return from(Promise.resolve(route.guard())).pipe(
							switchMap(guardResult => {

								// Handle guard result
								if (guardResult === true) {
									// Guard passed, proceed with the route
									return of({
										area: this.name,
										component: route.component,
										state: {},
										params: {},
										historyStrategy
									} as RouteAction)
								} else if (guardResult === false) {
									// Guard failed, stop navigation
									return EMPTY
								} else if (typeof guardResult === 'string') {
									// Redirect to string path
									return this.matchSegmentToRoute(guardResult, historyStrategy, routes)
								} else if (typeof guardResult === 'object' && guardResult.redirect) {
									// Redirect to path in object
									return this.matchSegmentToRoute(guardResult.redirect, historyStrategy, routes)
								} else {
									// Invalid guard result
									console.error(`[${this.name}] Invalid guard result:`, guardResult)
									return EMPTY
								}
							}),
							catchError(err => {
								console.error(`[${this.name}] Guard error:`, err)
								return EMPTY
							})
						)
					}

					// No guard, proceed with the route
					return of({
						area: this.name,
						component: route.component,
						state: {},
						params: {},
						historyStrategy
					} as RouteAction)
				}
			}
		} else {
		}

		// 3. FALLBACK: Use default component if available
		// Apply default when:
		// - No segment routes matched
		// - No JSON state for this specific area (handled by returning EMPTY when JSON exists but lacks component for this area)
		// - A default is defined
		if (this.default) {
			// Check if the area is currently empty
			const currentElement = this.shadowRoot?.children[0]
			const isAreaEmpty = !currentElement

			// Only apply default if area is empty or it's the initial load
			if (isAreaEmpty || pathname === '/' || pathname === '') {
				return of({
					area: this.name,
					component: this.default as ComponentInput,
					state: {},
					params: {},
					historyStrategy
				} as RouteAction)
			}
		}

		return EMPTY
	}


	/**
	 * Resolve component input to HTMLElement
	 * Handles strings, constructors, promises, lazy loading, etc.
	 */
	private async resolveComponent(component: ComponentInput): Promise<ResolvedComponent> {

		// Handle empty/null cases
		if (!component || component === '') {
			return { element: null }
		}

		// Handle string (tag name)
		if (typeof component === 'string') {
			try {
				const element = document.createElement(component)
				return { element }
			} catch (error) {
				console.error(`[${this.name}] Failed to create element:`, component, error)
				if (this.default && typeof this.default === 'string') {
					const element = document.createElement(this.default)
					return { element }
				}
				return { element: null }
			}
		}

		// Handle HTMLElement
		if (component instanceof HTMLElement) {
			return { element: component }
		}

		// Handle constructor function
		if (typeof component === 'function' && !('then' in component)) {
			try {
				const element = new (component as CustomElementConstructor)()
				return { element }
			} catch (error) {
				console.error(`[${this.name}] Failed to instantiate component:`, error)
				return { element: null }
			}
		}

		// Handle lazy loading function
		if (typeof component === 'function') {
			try {
				const module = await (component as () => Promise<{ default: CustomElementConstructor }>)()
				const Constructor = module.default
				const element = new Constructor()
				return { element }
			} catch (error) {
				console.error(`[${this.name}] Failed to load dynamic component:`, error)
				return { element: null }
			}
		}

		// Handle Promise (dynamic import)
		if (component instanceof Promise) {
			try {
				const module = await component
				const Constructor = module.default
				const element = new Constructor()
				return { element }
			} catch (error) {
				console.error(`[${this.name}] Failed to load promise component:`, error)
				return { element: null }
			}
		}

		// Fallback for unknown types
		console.warn(`[${this.name}] Unknown component type:`, typeof component, component)
		return { element: null }
	}

	protected firstUpdated(): void {
		if (!this.name) {
			throw new Error('Area name is required')
		}

		// Clean up any existing subscription before creating a new one
		this.routingSubscription?.unsubscribe()

		// Create a reactive stream from slot changes
		const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement
		const slotChanges$ = slot ? fromEvent(slot, 'slotchange').pipe(
			startWith(null), // Emit immediately to capture initial state
			map(() => this.routes || []), // Use queryAssignedElements result
		) : of([])

		// Create navigation event streams that will be combined with routes
		const initialLoad$ = combineLatest([
			of(location.pathname),
			slotChanges$
		]).pipe(
			take(1),
			switchMap(([pathname, routes]) => this.resolveRoute('initial', pathname, HISTORY_STRATEGY.silent, routes)),
		)

		const navigation$ = combineLatest([
			area.request.pipe(filter(({ area }) => area === this.name)),
			slotChanges$
		]).pipe(
			switchMap(([route, routes]) => this.resolveRoute('navigation', route, HISTORY_STRATEGY.silent, routes)),
		)

		const popstate$ = combineLatest([
			fromEvent<PopStateEvent>(window, 'popstate'),
			slotChanges$
		]).pipe(
			switchMap(([event, routes]) => this.resolveRoute('popstate', event, HISTORY_STRATEGY.silent, routes)),
		)

		// Merge the streams and create the routing pipeline
		this.routingSubscription = merge(initialLoad$, navigation$, popstate$).pipe(
			// Log the route we got

			// Filter out invalid routes (but allow null for clearing)
			filter(route => {
				// Allow null component as a signal to clear the area
				const valid = route.component !== undefined
				return valid
			}),


			// Prevent duplicate navigations
			distinctUntilChanged((a, b) => {
				const same = this.isSameRoute(a, b)
				return same
			}),

			// Resolve component to HTMLElement
			switchMap(route => {
				return from(this.resolveComponent(route.component as ComponentInput)).pipe(
					map(resolved => ({ ...resolved, route }))
				)
			}),

			// Apply props, params, and state to element
			map(({ element, route }) => {
				if (element) {
					// Apply params
					if (route.params) {
						Object.entries(route.params).forEach(([key, value]) => {
							(element as any)[key] = value
						})
					}

					// Apply props
					if (route.props) {
						Object.entries(route.props).forEach(([key, value]) => {
							(element as any)[key] = value
						})
					}

					// Apply state
					if (route.state) {
						(element as any).state = route.state
					}
				}

				return { element, route }
			}),

			// Update DOM and handle side effects
			tap(({ element, route }) => {
				// Update DOM
				this.updateDOM(element)

				// Update internal state
				if (element) {
					this.updateInternalState(route, element)
				}

				// Handle browser history
				this.updateBrowserHistory(route, element)
			}),

			// Error handling
			catchError(error => {
				console.error(`[${this.name}] Navigation error:`, error)
				return EMPTY
			}),

			takeUntil(this.disconnecting)
		).subscribe({
			error: (error) => {
				console.error(`[${this.name}] Subscription error:`, error)
			}
		})
	}

	/**
	 * Check if two routes are the same (for duplicate prevention)
	 */
	private isSameRoute(a: RouteAction, b: RouteAction): boolean {
		// Handle null components (clearing signals)
		if (a.component === null && b.component === null) {
			return true // Both are clearing signals
		}
		if (a.component === null || b.component === null) {
			return false // One is clearing, one is not
		}

		let aComponent = '', bComponent = ''

		// Extract component identifiers
		if (typeof a.component === 'function') {
			aComponent = (a.component as any).name || a.component.toString()
		} else if (typeof a.component === 'string') {
			aComponent = a.component
		} else if (a.component instanceof HTMLElement) {
			aComponent = a.component.tagName.toLowerCase()
		}

		if (typeof b.component === 'function') {
			bComponent = (b.component as any).name || b.component.toString()
		} else if (typeof b.component === 'string') {
			bComponent = b.component
		} else if (b.component instanceof HTMLElement) {
			bComponent = b.component.tagName.toLowerCase()
		}

		// Normalize and compare
		const normalizeComponent = (c: string) => c?.replaceAll('-', '').toLowerCase()
		const sameComponent = normalizeComponent(aComponent) === normalizeComponent(bComponent)
		const sameParams = JSON.stringify(a.params || {}) === JSON.stringify(b.params || {})
		const sameState = JSON.stringify(a.state || {}) === JSON.stringify(b.state || {})

		const result = sameComponent && sameParams && sameState

		return result
	}

	/**
	 * Update the DOM with the new component
	 */
	private updateDOM(component: HTMLElement | null) {

		const oldView = this.shadowRoot?.children[0]
		const oldViewExists = !!oldView

		// Remove the old view (if any)
		if (oldView) {
			oldView.remove()
		}

		// If component is null, we're clearing the area
		if (!component) {
			return
		}

		// Add new component with animation

		// Append the component first
		this.shadowRoot?.append(component)


		// Check if component was actually appended
		if (!this.shadowRoot?.contains(component)) {
			console.error(`[${this.name}] CRITICAL: Component was not appended to shadowRoot!`)
			console.error(`[${this.name}] ShadowRoot:`, this.shadowRoot)
			console.error(`[${this.name}] Component:`, component)
			return
		}

		// Animate in without opacity class - use Web Animations API directly
		const animation = component.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: oldViewExists ? 150 : 100,
			easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
			fill: 'forwards',
		})

		animation.onfinish = () => {
			// Ensure opacity is set to 1 after animation
			component.style.opacity = '1'
		}
	}

	/**
	 * Update internal router state
	 */
	private updateInternalState(route: RouteAction, component: HTMLElement | null) {
		// If component is null, we're clearing
		if (!component) {
			// Don't update state - it's already been cleared by the service
			return
		}
		
		const activeRoute: ActiveRoute = {
			component: component.tagName.toLowerCase(),
			state: route.state || {},
			area: this.name,
			params: route.params || {},
		}

		area.current.set(this.name, activeRoute)
		area.$current.next(area.current)
	}

	/**
	 * Update browser history (only for programmatic navigation)
	 */
	private updateBrowserHistory(route: RouteAction, component: HTMLElement | null) {
		if (!area.enableHistoryMode) return

		// If clearing, don't update history (already handled by service)
		if (!component) {
			return
		}

		const activeRoute: ActiveRoute = {
			component: component.tagName.toLowerCase(),
			state: route.state || {},
			area: this.name,
			params: route.params || {},
		}

		// Use the service method to update browser history
		area._updateBrowserHistory(this.name, activeRoute, route.historyStrategy, route.clearQueryParams)
	}


	/**
	 * Create URL path for the route (legacy method, now handled by service)
	 */
	newPath(tag: string, route: RouteAction) {
		const oldPathname = location.pathname.split('/').pop()
		let oldAreaState = {}
		try {
			oldAreaState = oldPathname ? JSON.parse(decodeURIComponent(oldPathname)) : {}
		} catch {
			oldAreaState = {}
		}
		route.state = route.state ?? {}
		const queryParams = route.clearQueryParams ? this.queryParamClear(route.clearQueryParams) : document.location.search

		return encodeURIComponent(
			JSON.stringify({
				...oldAreaState,
				[this.name]: { component: tag.toLowerCase(), state: route.state, params: route.params },
			}),
		).concat(`${queryParams}`)
	}

	/**
	 * Clear query parameters
	 */
	queryParamClear(params?: string[] | boolean) {
		if (!params) {
			return ''
		}
		// get query params from url
		const urlParams = new URLSearchParams(location.search)
		
		if (params === true) {
			// Clear all query params
			return ''
		} else {
			// Clear specific query params
			params.forEach(param => urlParams.delete(param))
			// update url
			if (urlParams.toString() === '') return ''
			return `?${urlParams.toString()}`
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		// Clean up the routing subscription
		if (this.routingSubscription) {
			this.routingSubscription.unsubscribe()
			this.routingSubscription = undefined
		}
	}

	render() {
		return html` <slot> </slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-area': SchmancyArea
	}
}
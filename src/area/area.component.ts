import { $LitElement } from '@mixins/index'
import { TemplateResult, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
	EMPTY,
	catchError,
	distinctUntilChanged,
	filter,
	from,
	fromEvent,
	map,
	merge,
	of,
	switchMap,
	take,
	takeUntil,
	tap
} from 'rxjs'
import { isPresent } from 'ts-is-present'
import area from './area.service'
import { ActiveRoute, HISTORY_STRATEGY, RouteAction } from './router.types'

type TRouteArea = {
	component: string
	state: object | undefined
	params?: Record<string, unknown>
	props?: Record<string, unknown>
}


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
	 * Get component from pathname with better error handling
	 */
	getComponentFromPathname(pathname: string, historyStrategy: HISTORY_STRATEGY) {
		return of(pathname).pipe(
			map(path => path.split('/').pop() ?? ''),
			map(path => {
				try {
					return JSON.parse(decodeURIComponent(path))
				} catch {
					return {}
				}
			}),
			map(routes => routes[this.name] as TRouteArea),
			map(component =>
				!component && this.default
					? {
							component: this.default,
							state: undefined,
							params: undefined
						}
					: component,
			),
			filter(x => isPresent(x)),
			map((component: TRouteArea) => ({
				area: this.name,
				component: component.component ?? this.default,
				state: component.state || {},
				params: component.params || {},
				historyStrategy
			} as RouteAction)),
			catchError((error) => {
				console.error('Error parsing component from pathname:', error)
				return this.default
					? of({
							area: this.name,
							component: this.default,
							historyStrategy,
							state: {},
							params: {},
							props: {}
						} as RouteAction)
					: EMPTY
			}),
		)
	}

	/**
	 * Get component from browser state with fallback to URL
	 */
	getComponentFromBrowserState(event: PopStateEvent): RouteAction | null {
		try {
			const browserState = event.state
			if (browserState && browserState.schmancyAreas && browserState.schmancyAreas[this.name]) {
				const areaState = browserState.schmancyAreas[this.name]
				return {
					area: this.name,
					component: areaState.component,
					state: areaState.state || {},
					params: areaState.params || {},
					historyStrategy: HISTORY_STRATEGY.silent,
					_source: 'browser'
				}
			}
		} catch (error) {
			console.error('Error reading browser state:', error)
		}
		
		return null
	}

	protected firstUpdated(): void {
		if (!this.name) {
			throw new Error('Area name or default component not set')
		}

		// Create a single merged stream for ALL events that might affect this area
		merge(
			// 1. Initial load from URL
			of(location.pathname).pipe(
				switchMap(pathname => this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent)),
				take(1),
				tap(route => console.log(`[${this.name}] Initial load:`, route))
			),

			// 2. Direct navigation requests to this area
			area.request.pipe(
				filter(({ area }) => area === this.name),
				tap(route => console.log(`[${this.name}] Navigation request:`, route))
			),

			// 3. Browser navigation (back/forward)
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				// Parse the state to see if this area is affected
				switchMap(event => {
					console.log(`[${this.name}] Processing popstate event:`, event)
					const state = event.state?.schmancyAreas?.[this.name]
					const pathname = (event.target as Window).location.pathname
					
					// If this area exists in the state, use it
					if (state) {
						return of({
							area: this.name,
							component: state.component,
							state: state.state || {},
							params: state.params || {},
							historyStrategy: HISTORY_STRATEGY.silent
						} as RouteAction)
					}
					
					// Check if it exists in the URL
					return this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent).pipe(
						// If nothing found in URL and no default, emit empty component
						switchMap(route => {
							if (!route.component && !this.default) {
								return of({
									area: this.name,
									component: '',  // Empty component to track state change
									state: {},
									params: {},
									historyStrategy: HISTORY_STRATEGY.silent
								} as RouteAction)
							}
							return of(route)
						})
					)
				}),
				tap(route => console.log(`[${this.name}] Browser navigation:`, route))
			),

			// 4. Handle area.pop() - when area is removed from current map
			area.$current.pipe(
				map(currentAreas => !currentAreas.has(this.name)),
				distinctUntilChanged(),
				filter(removed => removed),
				map(() => ({
					area: this.name,
					component: this.default || '',  // Use default or empty component
					state: {},
					params: {},
					historyStrategy: HISTORY_STRATEGY.silent
				} as RouteAction)),
				tap(() => console.log(`[${this.name}] Area cleared via pop()`))
			)
		)
			.pipe(
				// Allow empty string component (means clear)
				filter(request => request.component !== null && request.component !== undefined),
				takeUntil(this.disconnecting),
				// Prevent duplicate navigations
				distinctUntilChanged((a, b) => {
					// Compare component names (normalize)
					let aComponent: string = '', bComponent: string = ''
					
					// Handle function components by comparing constructor names
					if (typeof a.component === 'function') {
						aComponent = (a.component as any).name || a.component.toString()
					} else if (typeof a.component === 'string') {
						aComponent = a.component
					}

					if (typeof b.component === 'function') {
						bComponent = (b.component as any).name || b.component.toString()
					} else if (typeof b.component === 'string') {
						bComponent = b.component
					}

					// Normalize component names for comparison
					const normalizeComponent = (c: string) => c?.replaceAll('-', '').toLowerCase()
					const sameComponent = normalizeComponent(aComponent) === normalizeComponent(bComponent)
					const sameParams = JSON.stringify(a.params || {}) === JSON.stringify(b.params || {})
					const sameState = JSON.stringify(a.state || {}) === JSON.stringify(b.state || {})
					
					const result = sameComponent && sameParams && sameState
					
					if (!result) {
						console.log(`[${this.name}] Route change detected:`, {
							sameComponent,
							sameParams, 
							sameState
						})
					}
					
					return result
				}),
			)
			.pipe(
				// Resolve component (handle dynamic imports, constructors, etc.)
				switchMap(route => {
					const c = route.component
					if (c instanceof Promise) {
						// Dynamic import module
						return from(c).pipe(
							map((x: any) => ({ 
								component: (x.exports?.default || x.default) as CustomElementConstructor, 
								route 
							})),
							catchError(error => {
								console.error(`[${this.name}] Failed to load dynamic component:`, error)
								return EMPTY
							})
						)
					} else {
						// Already a string, function, or element
						return of({ component: c, route })
					}
				}),
				// Create DOM element
				map(({ component, route }) => {
					let element: HTMLElement | null = null
					
					if (component === '') {
						// Empty component means clear the area
						element = null
					} else if (typeof component === 'string') {
						// Tag name
						element = document.createElement(component)
					} else if (component instanceof HTMLElement) {
						// Already an element instance
						element = component
					} else if (typeof component === 'function') {
						// Custom element constructor
						element = new component()
					} else {
						// @ts-ignore - we know component exists
						element = component
					}
					
					// Set params as properties on the element
					if (element && route.params) {
						Object.entries(route.params).forEach(([key, value]) => {
							(element as any)[key] = value
						})
					}
					
					// Set state as well if provided
					if (element && route.state) {
						(element as any).state = route.state
					}
					
					return { component: element, route }
				}),
				// Update DOM and handle side effects
				tap(({ component, route }) => {
					// Update DOM
					this.updateDOM(component)
					
					// Update internal state first
					this.updateInternalState(route, component)
					
					// Handle browser history
					this.updateBrowserHistory(route, component)
				}),
				// Error handling
				catchError(error => {
					console.error(`[${this.name}] Navigation error:`, error)
					return EMPTY
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe({
				error: (error) => {
					console.error(`[${this.name}] Subscription error:`, error)
				}
			})
	}

	/**
	 * Update the DOM with the new component
	 */
	private updateDOM(component: HTMLElement | null) {
		const oldView = this.shadowRoot?.children[0]
		const oldViewExists = !!oldView

		// Remove the old view (if any)
		oldView?.remove()
		
		// If component is null, we're clearing the area
		if (!component) {
			return
		}
		
		// Add new component with animation
		component.classList.add('opacity-0')
		this.shadowRoot?.append(component)
		
		// Animate in
		component.animate([{ opacity: 0 }, { opacity: 1 }], {
			duration: oldViewExists ? 150 : 100,
			easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
			fill: 'forwards',
		})
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

	render() {
		return html` <slot> </slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-area': SchmancyArea
	}
}
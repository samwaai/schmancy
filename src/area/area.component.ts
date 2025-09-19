import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
import {
	EMPTY,
	catchError,
	distinctUntilChanged,
	filter,
	fromEvent,
	map,
	merge,
	of,
	shareReplay,
	switchMap,
	take,
	takeUntil,
	tap,
} from 'rxjs'
import area from './area.service'
import { RouteComponent, SchmancyRoute } from './route.component'
import { ActiveRoute, HISTORY_STRATEGY, RouteAction } from './router.types'

// Extended RouteAction type with originalWhen for tracking route identity
type RouteActionWithTracking = RouteAction & {
	originalWhen?: string
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

	@property() default!: RouteComponent

	/**
	 * Query for assigned route elements in the slot
	 * This will automatically update when slot content changes
	 */
	@queryAssignedElements({ selector: 'schmancy-route', flatten: true })
	private routes!: SchmancyRoute[]

	protected firstUpdated(): void {
		if (!this.name) throw new Error('Area name is required')

		// Single unified routing pipeline
		merge(
			// Programmatic navigation
			area.request.pipe(
				filter(({ area }) => area === this.name)
			),

			// Initial load - parse URL and determine route
			of(location.pathname).pipe(
				take(1),
				map(() => {
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''

					// Check for JSON encoded route in URL
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment)) as Record<string, ActiveRoute>
							if (parsed[this.name]) {
								return {
									area: this.name,
									component: parsed[this.name].component, // Keep as string initially
									state: parsed[this.name].state || {},
									params: parsed[this.name].params || {},
									historyStrategy: HISTORY_STRATEGY.replace,
								} as RouteAction
							}
						} catch {}
					}

					// Segment-based routing - find route by URL segment
					const segments = path.split('/').filter(Boolean)
					const matchingSegment = segments.find(seg =>
						this.routes?.some(r => r.when === seg)
					)

					if (matchingSegment) {
						return {
							area: this.name,
							component: matchingSegment, // Keep as string initially
							state: {},
							params: {},
							historyStrategy: HISTORY_STRATEGY.silent,
						} as RouteAction
					}

					// Use default if no route matches
					return this.default
						? {
								area: this.name,
								component: this.default,
								state: {},
								params: {},
								historyStrategy: HISTORY_STRATEGY.silent,
							} as RouteAction
						: null
				}),
				filter(route => route !== null)
			),

			// Browser back/forward navigation
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(event => {
					if (event.state?.schmancyAreas?.[this.name]) {
						const stateData = event.state.schmancyAreas[this.name]
						return {
							area: this.name,
							component: stateData.component, // Keep as string initially
							state: stateData.state || {},
							params: stateData.params || {},
							historyStrategy: HISTORY_STRATEGY.pop,
						} as RouteAction
					}
					return null
				}),
				filter(route => route !== null)
			),
		)
			.pipe(
				filter(route => route?.component !== undefined),

				// Step 1: Match route and resolve component (SINGLE place for matching logic)
				map(action => {
					let matchedRoute: SchmancyRoute | undefined
					let component = action.component
					let originalWhen: string | undefined

					// If component is a string, find the matching route
					if (typeof component === 'string' && this.routes) {
						matchedRoute = this.routes.find(r => r.when === component)
						if (matchedRoute) {
							component = matchedRoute.component
							originalWhen = matchedRoute.when
							console.log(`[${this.name}] Matched route '${originalWhen}' with component:`, component)
						} else {
							// No matching route, keep string component as-is
							originalWhen = component
						}
					}
					// If component is already a constructor/element, find matching route by reference
					else if (typeof component === 'function' && this.routes) {
						matchedRoute = this.routes.find(r => r.component === component)
						if (matchedRoute) {
							originalWhen = matchedRoute.when
							console.log(`[${this.name}] Found route '${originalWhen}' for constructor`)
						}
					}
					// Component is HTMLElement
					else if (component instanceof HTMLElement && this.routes) {
						const tagName = component.tagName.toLowerCase()
						matchedRoute = this.routes.find(r => r.when === tagName)
						if (matchedRoute) {
							originalWhen = matchedRoute.when
						}
					}

					return {
						...action,
						component,
						matchedRoute,
						originalWhen
					} as RouteActionWithTracking & { matchedRoute?: SchmancyRoute }
				}),

				// Step 2: Check guards (moved from Step 5 - check BEFORE lazy loading)
				switchMap((route) => {
					// Use the matched route for guard check
					const routeDef = route.matchedRoute ||
						(route.originalWhen ? this.routes?.find(r => r.when === route.originalWhen) : undefined)

					console.log(`[${this.name}] Guard check for route '${route.originalWhen}'`)

					// If route has a guard, evaluate it
					if (routeDef?.guard) {
						return routeDef.guard.pipe(
							tap(guardResult => {
								console.log(`[${this.name}] Guard evaluation result:`, guardResult)
							}),
							switchMap(guardResult => {
								if (guardResult === true) {
									// Guard passed, continue with the route (remove matchedRoute as it's no longer needed)
									const { matchedRoute, ...routeWithoutMatch } = route
									return of(routeWithoutMatch)
								}

								// Guard failed, dispatch redirect event
								const redirectEvent = new CustomEvent('redirect', {
									detail: {
										blockedRoute: route.originalWhen || 'unknown',
										area: this.name,
										params: route.params || {},
										state: route.state || {},
										redirectTarget: typeof guardResult === 'object' ? guardResult : undefined,
									},
									bubbles: true,
									composed: true,
								})
								routeDef.dispatchEvent(redirectEvent)

								return EMPTY
							})
						)
					}

					// No guard, allow navigation (remove matchedRoute as it's no longer needed)
					const { matchedRoute, ...routeWithoutMatch } = route
					return of(routeWithoutMatch)
				}),

				// Step 3: Resolve lazy components (was Step 2)
				switchMap(async (route) => {
					let component = route.component

					// Check if component is a lazy-loadable function
					if (
						typeof component === 'function' &&
						('preload' in component || '_promise' in component || '_module' in component)
					) {
						try {
							console.log(`[${this.name}] Lazy loading component for route '${route.originalWhen}'...`)
							const module = await (component as () => Promise<{ default: CustomElementConstructor }>)()
							component = module.default
							console.log(`[${this.name}] Lazy load succeeded`)
						} catch (e) {
							console.error(`[${this.name}] Lazy load failed:`, e)
							return { ...route, component: null }
						}
					}

					return { ...route, component }
				}),

				// Step 4: Extract component identifier for deduplication (was Step 3)
				map((route) => {
					let identifier = ''
					const component = route.component

					if (!component || component === '') {
						identifier = 'null'
					} else if (typeof component === 'string') {
						identifier = component
					} else if (component instanceof HTMLElement) {
						identifier = component.tagName.toLowerCase()
					} else if (typeof component === 'function') {
						identifier = component.name || 'CustomElement'
					}

					const key = `${identifier}${JSON.stringify(route.params)}${JSON.stringify(route.state)}`

					return {
						...route,
						key,
						tagName: identifier
					}
				}),

				// Step 5: Deduplicate navigation requests (was Step 4)
				distinctUntilChanged((a, b) => a.key === b.key),

				// Step 6: Create HTML element
				map((route) => {
					let element: HTMLElement | null = null
					const component = route.component

					console.log(`[${this.name}] Creating element for:`, component)

					if (!component || component === '') {
						element = null
					} else if (typeof component === 'string') {
						try {
							element = document.createElement(component)
						} catch {
							console.error(`[${this.name}] Failed to create element:`, component)
						}
					} else if (component instanceof HTMLElement) {
						element = component
					} else if (typeof component === 'function') {
						try {
							element = new (component as CustomElementConstructor)()
						} catch (e) {
							console.error(`[${this.name}] Failed to instantiate:`, e)
						}
					}

					// Apply properties
					if (element) {
						if (route.params) Object.assign(element, route.params)
						if (route.props) Object.assign(element, route.props)
						if (route.state) (element as any).state = route.state
					}

					return { element, route }
				}),

				shareReplay(1),

				// Step 7: Swap components in DOM
				tap(({ element, route }) => this.swapComponents(element, route)),

				catchError(error => {
					console.error(`[${this.name}] Navigation error:`, error)
					return EMPTY
				}),

				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	/**
	 * Swap components with animation following the original pattern
	 */
	private swapComponents(newComponent: HTMLElement | null, routeAction: RouteActionWithTracking) {
		// Important: We need to work with the light DOM, not shadow DOM
		// The slot should remain in shadow DOM, and we append content to light DOM

		// Find the current routed component (not the route definitions)
		// Route definitions have display:none, actual components don't
		const oldComponent = Array.from(this.children).find(
			child => !(child instanceof SchmancyRoute)
		) as HTMLElement | undefined

		// If no new component, just clear
		if (!newComponent) {
			if (oldComponent) {
				oldComponent.remove()
			}
			return
		}

		// Animate transition
		if (oldComponent) {
			// Fade out old component
			const fadeOut = oldComponent.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'ease-out' })

			fadeOut.onfinish = () => {
				oldComponent.remove()
				// Add new component to light DOM (not shadow DOM!)
				this.appendChild(newComponent)
				newComponent.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-in' })
			}
		} else {
			// No old component, just add and fade in to light DOM
			this.appendChild(newComponent)
			newComponent.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 100, easing: 'ease-in' })
		}

		// Update internal state
		if (newComponent) {
			const activeRoute: ActiveRoute = {
				component: newComponent.tagName.toLowerCase(),
				state: routeAction.state || {},
				area: this.name,
				params: routeAction.params || {},
			}

			area.current.set(this.name, activeRoute)
			area.$current.next(area.current)
		}

		// Update browser history
		if (area.enableHistoryMode && newComponent) {
			const activeRoute: ActiveRoute = {
				component: newComponent.tagName.toLowerCase(),
				state: routeAction.state || {},
				area: this.name,
				params: routeAction.params || {},
			}

			area._updateBrowserHistory(
				this.name,
				activeRoute,
				routeAction.historyStrategy || HISTORY_STRATEGY.push,
				routeAction.clearQueryParams,
			)
		}
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
	}

	render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-area': SchmancyArea
	}
}

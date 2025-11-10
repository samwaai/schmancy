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

		// Single unified routing pipeline with all logic inline
		merge(
			// Source 1: Programmatic navigation from area.request
			area.request.pipe(
				filter(({ area }) => area === this.name)
			),

			// Source 2: Initial page load - parse route from URL
			of(null).pipe(
				take(1),
				map(() => {
					// Parse route from URL on initial load
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''

					// Check for JSON encoded route in URL
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment)) as Record<string, ActiveRoute>
							if (parsed[this.name]) {
								return {
									area: this.name,
									component: parsed[this.name].component,
									state: parsed[this.name].state || {},
									params: parsed[this.name].params || {},
									props: parsed[this.name].props || {},
									historyStrategy: HISTORY_STRATEGY.replace,
								} as RouteAction
							}
						} catch {}
					}

					// Segment-based routing
					const segments = path.split('/').filter(Boolean)
					const matchingSegment = segments.find(seg =>
						this.routes?.some(r => r.when === seg)
					)

					if (matchingSegment) {
						return {
							area: this.name,
							component: matchingSegment,
							state: {},
							params: {},
							historyStrategy: HISTORY_STRATEGY.silent,
						} as RouteAction
					}

					// Use default route if available
					return this.default
						? {
								area: this.name,
								component: this.default,
								state: {},
								params: {},
								historyStrategy: HISTORY_STRATEGY.silent,
							} as RouteAction
						: null
				})
			),

			// Source 3: Browser navigation (back/forward) - parse from browser state
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(() => {
					// Parse route from browser state during popstate
					// First check history state
					if (history.state?.schmancyAreas?.[this.name]) {
						const stateData = history.state.schmancyAreas[this.name]
						return {
							area: this.name,
							component: stateData.component,
							state: stateData.state || {},
							params: stateData.params || {},
							props: stateData.props || {},
							historyStrategy: HISTORY_STRATEGY.pop,
						} as RouteAction
					}

					// Fallback to URL parsing if no state (e.g., navigating to root)
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''

					// Check for JSON encoded route in URL
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment)) as Record<string, ActiveRoute>
							if (parsed[this.name]) {
								return {
									area: this.name,
									component: parsed[this.name].component,
									state: parsed[this.name].state || {},
									params: parsed[this.name].params || {},
									props: parsed[this.name].props || {},
									historyStrategy: HISTORY_STRATEGY.replace,
								} as RouteAction
							}
						} catch {}
					}

					// Segment-based routing
					const segments = path.split('/').filter(Boolean)
					const matchingSegment = segments.find(seg =>
						this.routes?.some(r => r.when === seg)
					)

					if (matchingSegment) {
						return {
							area: this.name,
							component: matchingSegment,
							state: {},
							params: {},
							historyStrategy: HISTORY_STRATEGY.silent,
						} as RouteAction
					}

					// Use default route if available
					return this.default
						? {
								area: this.name,
								component: this.default,
								state: {},
								params: {},
								historyStrategy: HISTORY_STRATEGY.silent,
							} as RouteAction
						: null
				})
			)
		).pipe(
			// Filter out null routes
			filter((route): route is RouteAction => route !== null),

			// Step 1: Resolve route definition from component
			map(action => {
				let matchedRoute: SchmancyRoute | undefined
				let component = action.component

				// If component is a string, find the matching route
				if (typeof component === 'string' && this.routes) {
					matchedRoute = this.routes.find(r => r.when === component)
					if (matchedRoute) {
						component = matchedRoute.component
					}
				}
				// If component is a function, find matching route
				else if (typeof component === 'function' && this.routes) {
					matchedRoute = this.routes.find(r => r.component === component)
				}
				// If component is HTMLElement, find by tag name
				else if (component instanceof HTMLElement && this.routes) {
					const tagName = component.tagName.toLowerCase()
					matchedRoute = this.routes.find(r => r.when === tagName)
				}

				return { ...action, component, matchedRoute }
			}),

			// Step 2: Check route guards
			switchMap(route => {
				if (!route.matchedRoute?.guard) {
					return of(route)
				}

				return route.matchedRoute.guard.pipe(
					switchMap(guardResult => {
						if (guardResult === true) {
							return of(route)
						}

						// Guard failed, dispatch redirect event
						const redirectEvent = new CustomEvent('redirect', {
							detail: {
								blockedRoute: route.matchedRoute?.when || 'unknown',
								area: this.name,
								params: route.params || {},
								state: route.state || {},
								redirectTarget: typeof guardResult === 'object' ? guardResult : undefined,
							},
							bubbles: true,
							composed: true,
						})
						route.matchedRoute.dispatchEvent(redirectEvent)

						return EMPTY
					})
				)
			}),

			// Step 3: Load lazy components if needed
			switchMap(async route => {
				let component = route.component

				if (
					typeof component === 'function' &&
					('preload' in component || '_promise' in component || '_module' in component)
				) {
					try {
						const module = await (component as () => Promise<{ default: CustomElementConstructor }>)()
						component = module.default
					} catch (e) {
						console.error(`[${this.name}] Lazy load failed:`, e)
						return { ...route, component: null }
					}
				}

				return { ...route, component }
			}),

			// Step 4: Create unique key for deduplication
			map(route => {
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

				const key = `${identifier}${JSON.stringify(route.params)}${JSON.stringify(route.state)}${JSON.stringify(route.props)}`

				return { ...route, key, tagName: identifier }
			}),

			// Step 5: Deduplicate navigation requests
			distinctUntilChanged((a, b) => a.key === b.key),

			// Step 6: Create DOM element from component
			map(route => {
				let element: HTMLElement | null = null
				const component = route.component

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

			// Step 7: Swap components in DOM and update history
			tap(({ element, route }) => this.swapComponents(element, route)),

			catchError(error => {
				console.error(`[${this.name}] Navigation error:`, error)
				return EMPTY
			}),

			takeUntil(this.disconnecting)
		)
		.subscribe()
	}


	/**
	 * Swap components with animation
	 */
	private swapComponents(newComponent: HTMLElement | null, routeAction: RouteAction) {
		// Find current routed component (not route definitions)
		const oldComponent = Array.from(this.children).find(
			child => !(child instanceof SchmancyRoute)
		) as HTMLElement | undefined

		// Clear if no new component
		if (!newComponent) {
			oldComponent?.remove()
			return
		}

		// Get animation duration (0 = instant, default = 150ms)
		const duration = routeAction.animationDuration ?? 150

		// Animate transition (or instant swap if duration is 0)
		if (duration === 0) {
			// Instant swap - no animation
			oldComponent?.remove()
			this.appendChild(newComponent)
		} else if (oldComponent) {
			// Animated swap - fade out old, then fade in new
			const fadeOut = oldComponent.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-out' })
			fadeOut.onfinish = () => {
				oldComponent.remove()
				this.appendChild(newComponent)
				newComponent.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-in' })
			}
		} else {
			// No old component - just fade in new
			this.appendChild(newComponent)
			const fadeInDuration = duration > 100 ? Math.max(100, duration * 0.66) : duration
			newComponent.animate([{ opacity: 0 }, { opacity: 1 }], { duration: fadeInDuration, easing: 'ease-in' })
		}

		// Update area state
		const activeRoute: ActiveRoute = {
			component: newComponent.tagName.toLowerCase(),
			state: routeAction.state || {},
			area: this.name,
			params: routeAction.params || {},
			props: routeAction.props || {},
		}

		area.current.set(this.name, activeRoute)
		area.$current.next(area.current)

		// Update browser history
		if (area.enableHistoryMode) {
			area._updateBrowserHistory(
				this.name,
				activeRoute,
				routeAction.historyStrategy || HISTORY_STRATEGY.push,
				routeAction.clearQueryParams
			)
		}
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		area.pop(this.name)
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

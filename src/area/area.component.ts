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
		// Single unified routing pipeline - all logic inline
		merge(
			// Programmatic navigation
			area.request.pipe(
				filter(({ area }) => area === this.name),
				map(action => {
					// If component is a string, try to find the matching route to get the original 'when'
					if (typeof action.component === 'string') {
						const route = this.routes?.find(r => r.when === action.component);
						if (route) {
							// Use the route's actual component (which might be lazy) and track the 'when'
							console.log(`[${this.name}] Found route for '${action.component}', using component:`, route.component);
							return {
								...action,
								component: route.component,
								originalWhen: route.when
							};
						}
					}
					return action;
				})
			),

			// Initial load - simplified to use this.routes directly
			of(location.pathname).pipe(
				take(1),
				switchMap(() => {
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''
					let route: SchmancyRoute
					let originalWhen: string | undefined

					// Check for JSON encoded route
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment)) as Record<string, ActiveRoute>
							if (parsed[this.name]) {
								const componentTag = parsed[this.name]
								route = this.routes?.find(r => r.when === componentTag.component)
								originalWhen = route?.when || componentTag.component // Track the route's actual 'when' value
								// if the route.component is a lazy loaded module we need to load it
								if (route)
									return of({
										area: this.name,
										component: route.component,
										state: parsed[this.name].state || {},
										params: parsed[this.name].params || {},
										historyStrategy: HISTORY_STRATEGY.replace,
										originalWhen, // Pass along the original route identifier
									} as RouteAction & { originalWhen?: string })

								return of({
									area: this.name,
									component: parsed[this.name].component,
									state: parsed[this.name].state || {},
									params: parsed[this.name].params || {},
									historyStrategy: HISTORY_STRATEGY.replace,
									originalWhen: componentTag.component, // Track even for direct component references
								} as RouteAction & { originalWhen?: string })
							}
						} catch {}
					}

					// Segment-based routing
					const segments = path.split('/').filter(Boolean)
					route = this.routes?.find(r => segments.includes(r.when))
					originalWhen = route?.when // Track the original 'when' value
					// if the route.component is a lazy loaded module we need to load it

					if (!route) {
						return this.default
							? of({
									area: this.name,
									component: this.default,
									state: {},
									params: {},
									historyStrategy: HISTORY_STRATEGY.silent,
								} as RouteAction)
							: EMPTY
					}

					return of({
						area: this.name,
						component: route.component,
						state: {},
						params: {},
						historyStrategy: HISTORY_STRATEGY.silent,
						originalWhen, // Pass along the original route identifier
					} as RouteAction & { originalWhen?: string })
				}),
			),

			// Browser back/forward - simplified to directly use popstate
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(event => {
					if (event.state?.schmancyAreas?.[this.name]) {
						const stateData = event.state.schmancyAreas[this.name];
						const componentTag = stateData.component;
						// Try to find the matching route to get the original 'when'
						const route = this.routes?.find(r => r.when === componentTag);
						return {
							area: this.name,
							component: route ? route.component : componentTag,
							state: stateData.state || {},
							params: stateData.params || {},
							historyStrategy: HISTORY_STRATEGY.pop,
							originalWhen: componentTag
						} as RouteAction & { originalWhen?: string };
					}
					return null;
				}),
				filter(route => route !== null),
			),
		)
			.pipe(
				filter(route => route?.component !== undefined),
				// Step 1: Resolve ONLY lazy components to constructors (no element creation)
				switchMap(async route => {
					let component = route.component
					console.log(`[${this.name}] Processing route with originalWhen:`, (route as any).originalWhen);

					// Resolve lazy components first
					if (
						typeof component === 'function' &&
						('preload' in component || '_promise' in component || '_module' in component)
					) {
						try {
							console.log(`[${this.name}] Lazy loading component...`);
							const module = await (component as () => Promise<{ default: CustomElementConstructor }>)()
							component = module.default
							console.log(`[${this.name}] Lazy load succeeded, component:`, component);
						} catch (e) {
							console.error(`[${this.name}] Lazy load failed:`, e)
							return { component: null, route }
						}
					}

					return { component, route: { ...route, originalWhen: (route as any).originalWhen } }
				}),

				// Step 2: Extract component identifier for comparison (without creating elements)
				map(({ component, route }) => {
					let identifier = ''

					if (!component || component === '') {
						identifier = 'null'
					} else if (typeof component === 'string') {
						identifier = component
					} else if (component instanceof HTMLElement) {
						identifier = component.tagName
					} else if (typeof component === 'function') {
						identifier = component.name || 'CustomElement'
					}
					

					const key = `${identifier}${JSON.stringify(route.params)}${JSON.stringify(route.state)}`

					return {
						component,
						route,
						key,
						tagName: identifier,
						originalWhen: (route as any)?.originalWhen || identifier
					}
				}),

				// Step 3: Deduplicate using the identifier (before creating expensive elements)
				distinctUntilChanged((a, b) => {
					return a.key === b.key
				}),
				// Step 0: Guard
				switchMap(r => {
					// Use originalWhen if available, otherwise fall back to tagName
					const routeWhen = r.originalWhen || r.tagName;
					console.log('Guard check - originalWhen:', r.originalWhen, 'tagName:', r.tagName, 'using:', routeWhen);
					const route = this.routes.find(route => route.when === routeWhen);

					// If route has a guard, evaluate it
					if (route?.guard) {
						return route.guard.pipe(
							tap(guardResult => {
								console.log(`[${this.name}] Guard evaluation for route '${route.when}':`, guardResult)
							}),
							switchMap(guardResult => {
								if (guardResult === true) return of(r);

								// Guard failed, dispatch redirect event
								const redirectEvent = new CustomEvent('redirect', {
									detail: {
										blockedRoute: r.tagName,
										area: this.name,
										params: r.route?.params || {},
										state: r.route?.state || {},
										redirectTarget: typeof guardResult === 'object' ? guardResult : undefined,
									},
									bubbles: true,
									composed: true,
								});
								route.dispatchEvent(redirectEvent);

								return EMPTY;
							})
						);
					}

					// No guard, allow navigation
					return of(r);
				}),

				// Step 4: Create the HTMLElement and apply properties
				map(({ component, route }) => {
					let element: HTMLElement | null = null
					console.log(component,route)

					// Now resolve to HTMLElement
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

					// Apply properties inline
					if (element) {
						if (route.params) Object.assign(element, route.params)
						if (route.props) Object.assign(element, route.props)
						if (route.state) (element as any).state = route.state
					}

					return { element, route }
				}),

				shareReplay(1),

				// Swap components
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
	private swapComponents(newComponent: HTMLElement | null, routeAction: RouteAction) {
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

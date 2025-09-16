import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, queryAssignedElements } from 'lit/decorators.js'
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
	shareReplay,
	switchMap,
	take,
	takeUntil,
	tap,
} from 'rxjs'
import area from './area.service'
import { SchmancyRoute } from './route.component'
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

	@property() default!:
		| CustomElementConstructor
		| string
		| HTMLElement
		| (() => Promise<{ default: CustomElementConstructor }>)

	/**
	 * Query for assigned route elements in the slot
	 * This will automatically update when slot content changes
	 */
	@queryAssignedElements({ selector: 'schmancy-route' })
	private routes!: SchmancyRoute[]

	protected firstUpdated(): void {
		if (!this.name) throw new Error('Area name is required')

		// Single unified routing pipeline - all logic inline
		merge(
			// Programmatic navigation
			area.request.pipe(filter(({ area }) => area === this.name)),

			// Initial load - simplified to use this.routes directly
			of(location.pathname).pipe(
				take(1),
				switchMap(() => {
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''
					let route: SchmancyRoute

					// Check for JSON encoded route
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment)) as Record<string, ActiveRoute>
							console.log(parsed)
							if (parsed[this.name]) {
								const componentTag = parsed[this.name]
								console.log(componentTag)
								route = this.routes?.find(r => r.when === componentTag.component)
								// if the route.component is a lazy loaded module we need to load it
								if (route)
									return of({
										area: this.name,
										component: route.component,
										state: parsed[this.name].state || {},
										params: parsed[this.name].params || {},
										historyStrategy: HISTORY_STRATEGY.silent,
									} as RouteAction)

								return of({
									area: this.name,
									component: parsed[this.name].component,
									state: parsed[this.name].state || {},
									params: parsed[this.name].params || {},
									historyStrategy: HISTORY_STRATEGY.silent,
								} as RouteAction)
							}
						} catch {}
					}

					// Segment-based routing - use this.routes directly
					const segments = path.split('/').filter(Boolean)
					route = this.routes?.find(r => segments.includes(r.when))
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

					// Handle guard inline
					if (route.guard) {
						return from(Promise.resolve(route.guard())).pipe(
							switchMap(result => {
								if (result === true) {
									return of({
										area: this.name,
										component: route.component,
										state: {},
										params: {},
										historyStrategy: HISTORY_STRATEGY.silent,
									} as RouteAction)
								}
								// Handle redirects recursively inline
								const redirect =
									typeof result === 'string'
										? result
										: typeof result === 'object' && result?.redirect
											? result.redirect
											: null
								if (redirect) {
									const newSegment = redirect.split('/').filter(Boolean)[0] || ''
									const newRoute = this.routes?.find(r => r.when === newSegment)
									if (newRoute) {
										return of({
											area: this.name,
											component: newRoute.component,
											state: {},
											params: {},
											historyStrategy: HISTORY_STRATEGY.silent,
										} as RouteAction)
									}
								}
								return this.default
									? of({
											area: this.name,
											component: this.default,
											state: {},
											params: {},
											historyStrategy: HISTORY_STRATEGY.silent,
										} as RouteAction)
									: EMPTY
							}),
							catchError(() =>
								this.default
									? of({
											area: this.name,
											component: this.default,
											state: {},
											params: {},
											historyStrategy: HISTORY_STRATEGY.silent,
										} as RouteAction)
									: EMPTY,
							),
						)
					}

					return of({
						area: this.name,
						component: route.component,
						state: {},
						params: {},
						historyStrategy: HISTORY_STRATEGY.silent,
					} as RouteAction)
				}),
			),

			// Browser back/forward - simplified to directly use popstate
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(event =>
					event.state?.schmancyAreas?.[this.name]
						? ({
								area: this.name,
								component: event.state.schmancyAreas[this.name].component,
								state: event.state.schmancyAreas[this.name].state || {},
								params: event.state.schmancyAreas[this.name].params || {},
								historyStrategy: HISTORY_STRATEGY.silent,
							} as RouteAction)
						: null,
				),
				filter(route => route !== null),
			),
		)
			.pipe(
				filter(route => route?.component !== undefined),

				// Step 1: Resolve ONLY lazy components to constructors (no element creation)
				switchMap(async route => {
					console.log(this.name, route)
					let component = route.component

					// Resolve lazy components first
					if (
						typeof component === 'function' &&
						('preload' in component || '_promise' in component || '_module' in component)
					) {
						try {
							const module = await (component as () => Promise<{ default: CustomElementConstructor }>)()
							component = module.default
						} catch (e) {
							console.error(`[${this.name}] Lazy load failed:`, e)
							return { component: null, route }
						}
					}

					return { component, route }
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

					return { component, route, key }
				}),

				// Step 3: Deduplicate using the identifier (before creating expensive elements)
				distinctUntilChanged((a, b) => a.key === b.key),

				// Step 4: Create the HTMLElement and apply properties
				map(({ component, route }) => {
					let element: HTMLElement | null = null

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
		const oldComponent = this.shadowRoot?.children[0] as HTMLElement | undefined

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
				// Add and fade in new component
				this.shadowRoot?.append(newComponent)
				newComponent.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 150, easing: 'ease-in' })
			}
		} else {
			// No old component, just add and fade in
			this.shadowRoot?.append(newComponent)
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
		return html` <slot> </slot> `
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-area': SchmancyArea
	}
}

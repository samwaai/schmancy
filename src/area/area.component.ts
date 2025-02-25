import { $LitElement } from '@mixins/index'
import { TemplateResult, css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import {
	EMPTY,
	bufferTime,
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
	tap,
	timeout,
} from 'rxjs'
import { isPresent } from 'ts-is-present'
import area from './area.service'
import { HISTORY_STRATEGY, RouteAction } from './router.types'

/**
 * Type describing the route for an area.
 */
type TRouteArea = {
	component: string
	state: object | undefined
}

/**
 * Type for a mapping entry. Each mapping specifies a pathname and an array of route definitions.
 * Each route definition contains an area name, a component (or promise/constructor/template),
 * and optionally, a state.
 */
export type AreaPathnames = {
	pathname: string
	routes: Array<{
		area: string
		component: string | Promise<NodeModule> | CustomElementConstructor | TemplateResult<1>
		state?: object
	}>
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
	 * The name of the router outlet.
	 * @attr
	 * @type {string}
	 * @public
	 * @required
	 */
	@property() name!: string

	/**
	 * The default component to use if no matching route is found.
	 */
	@property() default!: string | Promise<NodeModule> | CustomElementConstructor | TemplateResult<1>

	/**
	 * An optional array of route mappings that can be passed into the component.
	 * Each mapping specifies a pathname and an array of routes mapping area names to components.
	 *
	 * Example:
	 * [
	 *   {
	 *     pathname: '/home',
	 *     routes: [
	 *       { area: 'main', component: 'home-view', state: { foo: 'bar' } },
	 *       { area: 'sidebar', component: 'menu-view' }
	 *     ]
	 *   },
	 *   {
	 *     pathname: '/about',
	 *     routes: [
	 *       { area: 'main', component: 'about-view' },
	 *       { area: 'sidebar', component: 'info-view' }
	 *     ]
	 *   }
	 * ]
	 */
	@property({ type: Array })
	mappings: AreaPathnames[] = []

	/**
	 * New API: Returns an observable emitting a RouteAction based on the passed mappings.
	 *
	 * It looks for a mapping that matches the current location’s pathname, then selects
	 * the route whose area matches this component’s name.
	 *
	 * @param mappings - Array of route mapping objects.
	 * @param historyStrategy - The history strategy to use (e.g. PUSH, REPLACE, SILENT).
	 * @returns An RxJS Observable that emits a RouteAction.
	 */
	public getComponentFromMappings(mappings: AreaPathnames[], historyStrategy: HISTORY_STRATEGY) {
		return of(location.pathname).pipe(
			map(currentPath => {
				const mapping = mappings.find(m => m.pathname === currentPath)
				if (!mapping) {
					throw new Error(`No mapping found for pathname: ${currentPath}`)
				}
				const routeForArea = mapping.routes.find(route => route.area === this.name)
				if (!routeForArea) {
					throw new Error(`No route found for area: ${this.name} in pathname: ${currentPath}`)
				}
				return routeForArea
			}),
			map(
				route =>
					({
						area: this.name,
						component: route.component || this.default,
						state: route.state,
						historyStrategy,
					}) as RouteAction,
			),
			catchError(() =>
				this.default
					? of({
							area: this.name,
							component: this.default,
							historyStrategy,
						} as RouteAction)
					: EMPTY,
			),
		)
	}

	/**
	 * Existing API: Returns an observable that emits a RouteAction based on the provided pathname.
	 *
	 * @param pathname - Pathname from the browser location API.
	 * @param historyStrategy - The history strategy to use for the route (PUSH, REPLACE, SILENT).
	 * @returns An observable emitting the RouteAction.
	 */
	getComponentFromPathname(pathname: string, historyStrategy: HISTORY_STRATEGY) {
		return of(pathname).pipe(
			map(path => path.split('/').pop() ?? ''),
			map(path => decodeURIComponent(path)),
			map(path => JSON.parse(path)),
			map(routes => routes[this.name] as TRouteArea),
			map(component =>
				!component && this.default
					? {
							component: this.default,
							state: undefined,
						}
					: component,
			),
			filter(x => isPresent(x)),
			map((component: TRouteArea) => ({
				area: this.name,
				component: component.component ?? this.default,
				state: component.state,
				historyStrategy,
			})),
			map(x => x as RouteAction),
			catchError(() => {
				return this.default
					? of({
							area: this.name,
							component: this.default,
							historyStrategy,
						} as RouteAction)
					: EMPTY
			}),
		)
	}

	protected firstUpdated(): void {
		if (!this.name) {
			// TODO: maybe enforce this to be unique
			throw new Error('Area name or default component not set')
		}

		// The route resolution now checks for a non-empty mappings property.
		// If mappings are provided, they override the normal parsing logic for the current URL.
		merge(
			// 1) Initial load from location.pathname.
			of(location.pathname).pipe(
				switchMap(pathname => {
					if (this.mappings && this.mappings.length) {
						return this.getComponentFromMappings(this.mappings, HISTORY_STRATEGY.silent)
					}
					return this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent)
				}),
				take(1),
			),
			// 2) Requests to change the route for this area.
			area.request.pipe(filter(({ area }) => area === this.name)),
			// 3) Popstate events (back, forward).
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(e => (e.target as Window).location.pathname),
				switchMap(pathname => {
					if (this.mappings && this.mappings.length) {
						return this.getComponentFromMappings(this.mappings, HISTORY_STRATEGY.silent)
					}
					return this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent)
				}),
			),
		)
			.pipe(
				filter(request => !!request.component),
				takeUntil(this.disconnecting),
				distinctUntilChanged((a, b) => {
					let aComponent, bComponent
					if (typeof a.component === 'function') return false
					else if (typeof a.component === 'string') aComponent = a.component

					if (typeof b.component === 'function') return false
					else if (typeof b.component === 'string') bComponent = b.component

					return bComponent?.replaceAll('-', '').toLowerCase() === aComponent?.replaceAll('-', '').toLowerCase()
				}),
			)
			.pipe(
				switchMap(route => {
					const c = route.component
					if (c instanceof Promise) {
						// Dynamic import module.
						return from(c).pipe(
							map(x => ({
								component: x.exports.default as CustomElementConstructor,
								route,
							})),
						)
					} else {
						// Already a string, function, or element.
						return of({ component: c, route })
					}
				}),
				map(({ component, route }) => {
					if (typeof component === 'string') {
						// Tag name.
						return { component: document.createElement(component), route }
					} else if (component instanceof HTMLElement) {
						// Already an element instance.
						return { component, route }
					} else if (typeof component === 'function') {
						// Custom element constructor.
						return { component: new component(), route }
					}
				}),
				distinctUntilChanged((prev, curr) => prev.component.tagName === curr.component.tagName),
				// Create the new view and add it to the DOM.
				map(({ component, route }) => {
					const oldView = this.shadowRoot?.children[0]
					const oldViewExists = !!oldView

					// Remove the old view (if any).
					oldView.remove()
					// Native Web Animations API - fade in.
					component.classList.add('opacity-0')
					this.shadowRoot?.append(component)
					component.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: oldViewExists ? 150 : 100,
						easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
						fill: 'forwards',
					})

					return { component, route }
				}),
				tap(({ component, route }) => {
					// Handle history updates.
					if (typeof route.historyStrategy === 'undefined' || route.historyStrategy === 'push') {
						history.pushState(route.state, '', this.newPath(component.tagName, route))
					} else if (route.historyStrategy && ['replace', 'pop'].includes(route.historyStrategy)) {
						history.replaceState(route.state, '', this.newPath(component.tagName, route))
					}
					area.current.set(this.name, {
						component: component.tagName,
						state: route.state,
						area: this.name,
					})

					area.$current.next(area.current)
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	/**
	 * Computes a new URL path for the given component and route.
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
				[this.name]: { component: tag.toLowerCase(), state: route.state },
			}),
		).concat(`${queryParams}`)
	}

	/**
	 * Removes specified query parameters from the current URL.
	 */
	queryParamClear(params?: string[]) {
		if (!params) {
			return ''
		}
		// Get query params from URL.
		const urlParams = new URLSearchParams(location.search)
		// Remove query params.
		params.forEach(param => urlParams.delete(param))
		if (urlParams.toString() === '') return ''
		return `?${urlParams.toString()}`
	}

	/**
	 * Checks for teleportation requests (FLIP_REQUEST events) and dispatches a FLIP_STARTED event.
	 */
	checkForTeleportationRequests() {
		return fromEvent<CustomEvent>(window, 'FLIP_REQUEST').pipe(
			map(e => e.detail),
			bufferTime(0),
			tap(() => {
				this.dispatchEvent(new CustomEvent('FLIP_STARTED'))
			}),
			takeUntil(this.disconnecting),
			timeout(0),
			catchError(() => of(null)),
		)
	}

	disconnectedCallback(): void {
		super.disconnectedCallback()
		this.disconnecting.next(true)
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

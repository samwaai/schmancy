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

type TRouteArea = {
	component: string
	state: object | undefined
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
	 *
	 * @param pathname pathname from the browser location API
	 * @param historyStrategy  the history strategy to use for the route like PUSH, REPLACE, or SILENT
	 * @returns rxjs pipes that will return the component to render and the history strategy to use
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
			throw new Error('Area name or default component not set')
		}

		// active outlet changes
		merge(
			// 1) initial load from location.pathname
			of(location.pathname).pipe(
				switchMap(pathname => this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent)),
				map(route => route as RouteAction),
				take(1),
			),
			// 2) requests to change the route for this area
			area.request.pipe(filter(({ area }) => area === this.name)),
			// 3) popstate events (back, forward)
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(e => (e.target as Window).location.pathname),
				switchMap(pathname => this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent)),
				map(route => route as RouteAction),
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

					const sameComponent = bComponent?.replaceAll('-', '').toLowerCase() === aComponent?.replaceAll('-', '').toLowerCase()
					const sameParams = JSON.stringify(a.params || {}) === JSON.stringify(b.params || {})
					
					return sameComponent && sameParams
				}),
			)
			.pipe(
				switchMap(route => {
					const c = route.component
					if (c instanceof Promise) {
						// Dynamic import module
						return from(c).pipe(
							map((x: any) => ({ component: (x.exports?.default || x.default) as CustomElementConstructor, route })),
							catchError(() => EMPTY)
						)
					} else {
						// Already a string, function, or element
						return of({ component: c, route })
					}
				}),
				map(({ component, route }) => {
					let element: HTMLElement
					
					if (typeof component === 'string') {
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
					if (route.params) {
						Object.entries(route.params).forEach(([key, value]) => {
							(element as any)[key] = value
						})
					}
					
					// Set state as well if provided
					if (route.state) {
						(element as any).state = route.state
					}
					
					return { component: element, route }
				}),
				// create the new view and add it to the DOM
				map(({ component, route }) => {
					const oldView = this.shadowRoot?.children[0]
					const oldViewExists = !!oldView

					// Remove the old view (if any)
					oldView?.remove()
					// Native Web Animations API - fade in
					// "ease: cubic-bezier(0.25, 0.8, 0.25, 1)" was used in the old code
					component.classList.add('opacity-0')
					this.shadowRoot?.append(component)
					component.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: oldViewExists ? 150 : 100,
						easing: 'cubic-bezier(0.25, 0.8, 0.25, 1)',
						fill: 'forwards',
					})

					// Insert the new view

					return { component, route }
				}),
				tap(({ component, route }) => {
					// Handle history updates
					if (typeof route.historyStrategy === 'undefined' || route.historyStrategy === 'push') {
						history.pushState(route.state, '', this.newPath(component.tagName, route))
					} else if (route.historyStrategy && ['replace', 'pop'].includes(route.historyStrategy)) {
						history.replaceState(route.state, '', this.newPath(component.tagName, route))
					}
					area.current.set(this.name, {
						component: component.tagName,
						state: route.state || {},
						area: this.name,
						params: route.params || {},
					})

					area.$current.next(area.current)
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

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

	queryParamClear(params?: string[]) {
		if (!params) {
			return ''
		}
		// get query params from url
		const urlParams = new URLSearchParams(location.search)
		// remove query params
		params.forEach(param => urlParams.delete(param))
		// update url
		if (urlParams.toString() === '') return ''
		return `?${urlParams.toString()}`
	}

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
		this.disconnecting.complete()
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
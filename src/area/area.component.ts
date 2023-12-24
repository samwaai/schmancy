import { $LitElement } from '@mhmo91/lit-mixins/src'
import { animate } from '@juliangarnierorg/anime-beta'
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
	takeUntil,
	tap,
	timeout,
} from 'rxjs'
import area from './area.service'
import { HISTORY_STRATEGY, RouteAction } from './router.types'

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

	@property() default!: string | Promise<NodeModule> | CustomElementConstructor | TemplateResult<1>

	/**
	 *
	 * @param pathname pathname from the browser location API
	 * @param historyStrategy  the history strategy to use for the route like PUSH, REPLACE, or SILENT
	 * @returns rxjs pipes that will return the component to render and the history strategy to use
	 */
	getComponentFromPathname(pathname: string, historyStrategy: HISTORY_STRATEGY) {
		return of(pathname).pipe(
			map(() => location.pathname),
			map(pathname => pathname.split('/').pop() ?? ''),
			map(pathname => decodeURIComponent(pathname)),
			map(pathname => JSON.parse(pathname)),
			map(routes => routes[this.name]),
			map(component => (component === undefined ? this.default : component)),
			map(component => ({
				area: this.name,
				component: component ?? this.default,
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
			// TOOD: maybe enforce this to be unique
			throw new Error('Area name or default component not set')
		}
		// active outlet changes
		merge(
			area.request.pipe(filter(({ area }) => area === this.name)),
			of(location.pathname).pipe(
				switchMap(pathname => this.getComponentFromPathname(pathname, HISTORY_STRATEGY.replace)),
			),
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(e => (e.target as Window).location.pathname),
				switchMap(pathname => this.getComponentFromPathname(pathname, HISTORY_STRATEGY.silent)),
			),
		)
			.pipe(
				filter(request => !!request.component),
				takeUntil(this.disconnecting),
				distinctUntilChanged((a, b) => {
					let aComponent, bComponent
					if (typeof a.component === 'function')
						return false // TODO: maybe check if the function is a custom element constructor
					else if (typeof a.component === 'string') aComponent = a.component
					if (typeof b.component === 'function')
						return false // TODO: maybe check if the function is a custom element constructor
					else if (typeof b.component === 'string') bComponent = b.component
					return bComponent?.replaceAll('-', '').toLowerCase() === aComponent?.replaceAll('-', '').toLowerCase()
				}),
			)
			.pipe(
				switchMap(async route =>
					merge(
						// load the new view if a promise was passed instead of a component
						of(route.component)
							.pipe(
								switchMap(c => {
									if (c instanceof Promise) {
										return from(c).pipe(map(x => x.exports.default as CustomElementConstructor))
									} else {
										return of(c)
									}
								}),
							)
							.pipe(
								map(component => {
									if (typeof component === 'string') {
										return document.createElement(component)
									} else if (component instanceof HTMLElement) {
										return component
									} else if (typeof component === 'function') {
										return new component()
									}
								}),
								// create the new view and add it to the DOM
								map(newView => {
									const oldView = this.shadowRoot?.children[0]
									oldView?.classList.add('absolute', 'inset-0')
									// newView?.classList.add('absolute', 'inset-0')
									this.shadowRoot?.prepend(newView)
									animate(newView, {
										opacity: [0, 1],
										duration: oldView ? 300 : 0,
										delay: oldView ? 50 : 0,
										ease: 'easeInQuad',
										onBegin: () => {
											if (oldView)
												animate(oldView, {
													targets: oldView,
													opacity: [1, 0],
													duration: 150,
													scale: [1, 0.95],
													ease: 'easeOutQuad',
													onComplete: () => {
														oldView?.remove()
													},
												})
										},
										onComplete: () => {
											oldView?.remove()
										},
									})
									return { newView, oldView }
								}),
								tap(({ newView }) => {
									if (typeof route.historyStrategy === 'undefined' || route.historyStrategy === 'push')
										history.pushState(route.state, '', this.newPath(newView.tagName))
									else if (route.historyStrategy && ['replace', 'pop'].includes(route.historyStrategy))
										history.replaceState(route.state, '', this.newPath(newView.tagName))
									area.$current.next({
										component: newView.tagName,
										area: route.area,
										state: route.state,
									})
								}),
							),
					)
						.pipe(takeUntil(this.disconnecting))
						.subscribe(),
				),
			)
			.subscribe()
	}

	newPath(tag: string) {
		const oldPathname = location.pathname.split('/').pop()
		let oldAreaState = {}
		try {
			oldAreaState = oldPathname ? JSON.parse(decodeURIComponent(oldPathname)) : {}
		} catch {
			oldAreaState = {}
		}
		return encodeURIComponent(JSON.stringify({ ...oldAreaState, [this.name]: tag.toLowerCase() }))
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
		area.pop(this.name)
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

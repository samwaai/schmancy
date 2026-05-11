import { SchmancyElement } from '@mixins/index'
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
	switchMap,
	takeUntil,
	tap,
} from 'rxjs'
import { area } from './area.service'
import { RouteComponent, SchmancyRoute } from './route.component'
import { ActiveRoute, HISTORY_STRATEGY, RouteAction } from './router.types'

@customElement('schmancy-area')
export class SchmancyArea extends SchmancyElement {
	static styles = [css`
	:host {
		position: relative;
		display: block;
		height: 100%;
		width: 100%;
		min-height: 0;
		min-width: 0;
		contain: layout style;
	}
	::slotted(:not(schmancy-route)) {
		display: block;
		box-sizing: border-box;
		min-height: 100%;
		width: 100%;
	}
`]

	@property() name!: string

	@property() default!: RouteComponent

	@queryAssignedElements({ selector: 'schmancy-route', flatten: true })
	private routes!: SchmancyRoute[]

	protected firstUpdated(): void {
		if (!this.name) throw new Error('Area name is required')

		merge(
			// Programmatic navigation
			area.request.pipe(
				filter(({ area }) => area === this.name),
			),

			// Initial URL parse
			of(null).pipe(
				map(() => {
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment))
							if (typeof parsed === 'object' && parsed !== null && parsed[this.name]) {
								const r = parsed[this.name]
								return { area: this.name, component: r.component, state: r.state || {}, params: r.params || {}, props: r.props || {}, historyStrategy: HISTORY_STRATEGY.replace } as RouteAction
							}
						} catch {}
					}
					const matchingSegment = path.split('/').filter(Boolean).find(seg => this.routes?.some(r => r.when === seg))
					if (matchingSegment) {
						return { area: this.name, component: matchingSegment, state: {}, params: {}, historyStrategy: HISTORY_STRATEGY.silent } as RouteAction
					}
					return this.default
						? { area: this.name, component: this.default, state: {}, params: {}, historyStrategy: HISTORY_STRATEGY.silent } as RouteAction
						: null
				}),
			),

			// Browser back/forward
			fromEvent<PopStateEvent>(window, 'popstate').pipe(
				map(() => {
					if (history.state?.schmancyAreas?.[this.name]) {
						const s = history.state.schmancyAreas[this.name]
						return { area: this.name, component: s.component, state: s.state || {}, params: s.params || {}, props: s.props || {}, historyStrategy: HISTORY_STRATEGY.pop } as RouteAction
					}
					const path = location.pathname
					const lastSegment = path.split('/').pop() || ''
					if (lastSegment && (lastSegment.includes('{') || lastSegment.includes('%7B'))) {
						try {
							const parsed = JSON.parse(decodeURIComponent(lastSegment))
							if (typeof parsed === 'object' && parsed !== null && parsed[this.name]) {
								const r = parsed[this.name]
								return { area: this.name, component: r.component, state: r.state || {}, params: r.params || {}, props: r.props || {}, historyStrategy: HISTORY_STRATEGY.replace } as RouteAction
							}
						} catch {}
					}
					const matchingSegment = path.split('/').filter(Boolean).find(seg => this.routes?.some(r => r.when === seg))
					if (matchingSegment) {
						return { area: this.name, component: matchingSegment, state: {}, params: {}, historyStrategy: HISTORY_STRATEGY.silent } as RouteAction
					}
					return this.default
						? { area: this.name, component: this.default, state: {}, params: {}, historyStrategy: HISTORY_STRATEGY.silent } as RouteAction
						: null
				}),
			),
		).pipe(
			filter((r): r is RouteAction => r !== null),

			// Per-navigation error isolation — one bad nav skips, outer stream keeps flowing
			switchMap(action => of(action).pipe(
				// Step 1: resolve component + find matched route
				switchMap(action => {
					let component: RouteComponent | null = action.component
					let matchedRoute: SchmancyRoute | undefined

					if (typeof component === 'string' && this.routes) {
						matchedRoute = this.routes.find(r => r.when === component)
						if (matchedRoute) component = matchedRoute.component
					}
					if (!matchedRoute && component instanceof HTMLElement && this.routes) {
						matchedRoute = this.routes.find(r => r.when === component.tagName.toLowerCase())
					}
					if (!matchedRoute && typeof component === 'function' && 'preload' in component) {
						return from(
							(component as () => Promise<{ default: CustomElementConstructor }>)().then(m => ({
								...action,
								component: m.default as RouteComponent,
								matchedRoute: this.routes?.find(r => r.when === (customElements.getName(m.default) ?? '')) ?? undefined,
							}))
						)
					}
					return of({ ...action, component, matchedRoute })
				}),

				// Step 2: guard check
				switchMap(carry => {
					if (!carry.matchedRoute?.guard) return of(carry)
					return carry.matchedRoute.guard.pipe(
						switchMap(allowed => {
							if (allowed) return of(carry)
							carry.matchedRoute?.dispatchEvent(new CustomEvent('redirect', {
								detail: { blockedRoute: carry.matchedRoute?.when ?? 'unknown', area: this.name, params: carry.params || {}, state: carry.state || {} },
								bubbles: true,
								composed: true,
							}))
							return EMPTY
						}),
					)
				}),

				// Step 3: load lazy component (after guard, for perf)
				switchMap(carry => {
					if (!(typeof carry.component === 'function' && 'preload' in carry.component)) return of(carry)
					return from(
						(carry.component as () => Promise<{ default: CustomElementConstructor }>)()
							.then(m => ({ ...carry, component: m.default as RouteComponent }))
					)
				}),

				// Step 4: dedup key
				map(carry => {
					const c = carry.component
					const id =
						!c || c === '' ? 'null'
						: typeof c === 'string' ? c
						: c instanceof HTMLElement ? c.tagName.toLowerCase()
						: typeof c === 'function' ? c.name || 'CustomElement'
						: 'null'
					return { ...carry, key: `${id}${JSON.stringify(carry.params)}${JSON.stringify(carry.state)}${JSON.stringify(carry.props)}` }
				}),

				catchError(err => {
					console.error(`[${this.name}] Navigation error:`, err)
					return EMPTY
				}),
			)),

			distinctUntilChanged((a, b) => a.key === b.key),

			// Step 5: instantiate element
			map(carry => {
				const c = carry.component
				let element: HTMLElement | null = null
				if (typeof c === 'string' && c !== '') {
					try { element = document.createElement(c) } catch { console.error(`[${this.name}] Failed to create element:`, c) }
				} else if (c instanceof HTMLElement) {
					element = c
				} else if (typeof c === 'function') {
					try { element = new (c as CustomElementConstructor)() } catch (e) { console.error(`[${this.name}] Failed to instantiate:`, e) }
				}
				if (element) {
					if (carry.params) Object.assign(element, carry.params)
					if (carry.props) Object.assign(element, carry.props)
					if (carry.state) Object.assign(element, { state: carry.state })
				}
				return { ...carry, element }
			}),

			// Step 6: swap DOM, write area state, update history
			tap(carry => {
				const old = Array.from(this.children).find(c => !(c instanceof SchmancyRoute)) as HTMLElement | undefined
				const { element } = carry

				if (!element) { old?.remove(); return }

				const duration = carry.animationDuration ?? 150

				if (duration === 0) {
					old?.remove()
					this.appendChild(element)
					this.scrollTop = 0
				} else if (old) {
					old.style.willChange = 'opacity'
					element.style.willChange = 'opacity'
					old.style.contentVisibility = 'hidden'
					old.animate([{ opacity: 1 }, { opacity: 0 }], { duration, easing: 'ease-out' }).finished
						.then(() => {
							if (!this.isConnected) return
							old.remove()
							this.appendChild(element)
							this.scrollTop = 0
							return element.animate([{ opacity: 0 }, { opacity: 1 }], { duration, easing: 'ease-in' }).finished
						})
						.then(() => (element.style.willChange = 'auto'))
				} else {
					this.appendChild(element)
					this.scrollTop = 0
					element.animate([{ opacity: 0 }, { opacity: 1 }], {
						duration: duration > 100 ? Math.max(100, duration * 0.66) : duration,
						easing: 'ease-in',
					}).finished.then(() => (element.style.willChange = 'auto'))
				}

				const activeRoute: ActiveRoute = {
					component: element.tagName.toLowerCase(),
					state: carry.state || {},
					area: this.name,
					params: carry.params || {},
					props: carry.props || {},
				}
				area.current.set(this.name, activeRoute)
				area.$current.next(area.current)

				if (area.enableHistoryMode) {
					area._updateBrowserHistory(
						this.name,
						activeRoute,
						carry.historyStrategy ?? HISTORY_STRATEGY.push,
						carry.clearQueryParams,
						carry.path,
					)
				}
			}),

			takeUntil(this.disconnecting),
		).subscribe()
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

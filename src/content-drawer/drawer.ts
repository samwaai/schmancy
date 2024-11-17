import { provide } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html, nothing } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, merge, startWith, takeUntil, tap } from 'rxjs'
import { SchmancyEvents, TRenderCustomEvent, area, sheet } from '..'
import {
	SchmancyContentDrawerID,
	SchmancyContentDrawerMaxHeight,
	SchmancyContentDrawerMinWidth,
	SchmancyContentDrawerSheetMode,
	SchmancyContentDrawerSheetState,
	TSchmancyContentDrawerSheetMode,
	TSchmancyContentDrawerSheetState,
} from './context'

/**
 * @element schmancy-content-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
@customElement('schmancy-content-drawer')
export class SchmancyContentDrawer extends $LitElement(css`
	:host {
		position: relative;
		inset: 0;
		display: block;
		overflow: hidden;
	}
`) {
	/**
	 * The minimum width of the sheet
	 * @attr	minWidth
	 * @type {number}
	 * @memberof SchmancyContentDrawer
	 */

	@provide({ context: SchmancyContentDrawerMinWidth })
	minWidth: typeof SchmancyContentDrawerMinWidth.__context__ = {
		main: 360,
		sheet: 576,
	}

	/**
	 * The state of the sheet
	 * @attr open
	 * @type {TSchmancyContentDrawerSheetState}
	 */
	@provide({ context: SchmancyContentDrawerSheetState })
	@property()
	open: TSchmancyContentDrawerSheetState

	/**
	 * The mode of the sheet
	 * @type {TSchmancyContentDrawerSheetMode}
	 * @memberof SchmancyContentDrawer
	 * @protected
	 */
	@provide({ context: SchmancyContentDrawerSheetMode })
	@state()
	mode: TSchmancyContentDrawerSheetMode

	@provide({ context: SchmancyContentDrawerID })
	schmancyContentDrawerID = Math.floor(Math.random() * Date.now()).toString()

	@provide({ context: SchmancyContentDrawerMaxHeight })
	maxHeight = '100%'

	@queryAssignedElements({ flatten: true })
	assignedElements!: HTMLElement[]
	firstUpdated(): void {
		merge(fromEvent<CustomEvent>(window, 'resize'), fromEvent<CustomEvent>(window, SchmancyEvents.ContentDrawerResize))
			.pipe(
				startWith(true),
				tap(() => console.log(this.minWidth)),
				map(() => (this.clientWidth ? this.clientWidth : window.innerWidth)),
				map(width => width >= this.minWidth.main + this.minWidth.sheet),
				debounceTime(100),
				tap(() => {
					this.maxHeight = `${window.innerHeight - this.getOffsetTop(this) - 32}px`
					this.style.setProperty('max-height', this.maxHeight)
				}),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(lgScreen => {
				if (lgScreen) {
					this.mode = 'push'
					this.open = 'open'
				} else {
					this.mode = 'overlay'
					this.open = 'close'
				}
			})

		/*
		 * Listen to the toggle event
		 */
		fromEvent<CustomEvent>(window, SchmancyEvents.ContentDrawerToggle)
			.pipe(
				tap(event => {
					event.stopPropagation()
				}),
				map(event => event.detail.state),
				takeUntil(this.disconnecting),
			)
			.subscribe(state => {
				this.open = state
			})

		fromEvent<TRenderCustomEvent>(window, 'schmancy-content-drawer-render')
			.pipe(
				tap(event => {
					event.stopPropagation()
				}),
				map(event => event.detail),
				takeUntil(this.disconnecting),
			)
			.subscribe(({ component, title }) => {
				if (this.mode === 'push') {
					// TODO: Fix the router to render if constructor has different arguments
					area.push({
						area: this.schmancyContentDrawerID,
						component: 'empty',
						historyStrategy: 'silent',
					})
					area.push({
						area: this.schmancyContentDrawerID,
						component: component,
						historyStrategy: 'silent',
					})
				} else if ((this.mode = 'overlay')) {
					sheet.open({ component: component, uid: this.schmancyContentDrawerID, title })
				}
			})
	}

	getOffsetTop(element) {
		let offsetTop = 0
		while (element) {
			offsetTop += element.offsetTop
			element = element.offsetParent
		}
		return offsetTop
	}

	protected render() {
		if (!this.mode || !this.open) return nothing
		return html`
			<schmancy-grid
				cols=${this.mode === 'overlay' ? '1fr' : 'auto 1fr'}
				rows="1fr"
				flow="col"
				justify="stretch"
				align="stretch"
			>
				<slot></slot>
			</schmancy-grid>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer': SchmancyContentDrawer
	}
}

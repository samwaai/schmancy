import { provide } from '@lit/context'
import { $LitElement } from '@mixins/index'
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
		this.setupResizeListener()
		this.setupToggleListener()
		this.setupRenderListener()
	}

	private setupResizeListener() {
		merge(
			fromEvent<CustomEvent>(window, 'resize'),
			fromEvent<CustomEvent>(window, SchmancyEvents.ContentDrawerResize)
		)
			.pipe(
				startWith(true),
				debounceTime(100),
				map(() => this.clientWidth || window.innerWidth),
				map(width => width >= this.minWidth.main + this.minWidth.sheet),
				distinctUntilChanged(),
				tap(() => this.updateMaxHeight()),
				takeUntil(this.disconnecting)
			)
			.subscribe(isLargeScreen => this.updateMode(isLargeScreen))
	}

	private setupToggleListener() {
		fromEvent<CustomEvent>(window, SchmancyEvents.ContentDrawerToggle)
			.pipe(
				tap(event => event.stopPropagation()),
				map(event => event.detail.state),
				takeUntil(this.disconnecting)
			)
			.subscribe(state => {
				this.open = state
			})
	}

	private setupRenderListener() {
		fromEvent<TRenderCustomEvent>(window, 'schmancy-content-drawer-render')
			.pipe(
				tap(event => event.stopPropagation()),
				map(event => event.detail),
				takeUntil(this.disconnecting)
			)
			.subscribe(detail => this.handleRender(detail))
	}

	private updateMaxHeight() {
		this.maxHeight = `${window.innerHeight - this.getOffsetTop(this)}px`
		this.style.setProperty('max-height', this.maxHeight)
	}

	private updateMode(isLargeScreen: boolean) {
		if (isLargeScreen) {
			this.mode = 'push'
			this.open = 'open'
		} else {
			this.mode = 'overlay'
			this.open = 'close'
		}
	}

	private handleRender(detail: TRenderCustomEvent['detail']) {
		if (this.mode === 'push') {
			area.push({
				area: this.schmancyContentDrawerID,
				component: detail.component,
				historyStrategy: 'silent',
				state: detail.state,
				params: detail.params,
				props: detail.props,
			})
		} else if (this.mode === 'overlay') {
			sheet.open({
				component: detail.component,
				uid: this.schmancyContentDrawerID,
				title: detail.title,
			})
		}
	}

	getOffsetTop(element: HTMLElement | null) {
		let offsetTop = 0
		while (element) {
			offsetTop += element.offsetTop
			element = element.offsetParent as HTMLElement | null
		}
		return offsetTop
	}

	protected render() {
		if (!this.mode || !this.open) return nothing

		const gridClasses = [
			'grid h-full',
			'grid-flow-col auto-cols-max',
			'grid-rows-[1fr]',
			'justify-items-stretch items-stretch',
			this.mode === 'overlay' ? 'grid-cols-[1fr]' : 'grid-cols-[auto_1fr]'
		].join(' ')

		return html`
			<div class=${gridClasses}>
				<slot></slot>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-content-drawer': SchmancyContentDrawer
	}
}

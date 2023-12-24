import { provide } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html, nothing } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, startWith, takeUntil, tap } from 'rxjs'
import { SchmancyEvents, area } from '..'
import {
	SchmancyContentDrawerID,
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
	}
`) {
	/**
	 * The minimum width of the sheet
	 * @attr	min-width
	 * @type {number}
	 * @memberof SchmancyContentDrawer
	 */
	@property({ type: Number })
	minWidth: number = 1240

	/**
	 * The mode of the sheet
	 * @type {TSchmancyContentDrawerSheetMode}
	 * @memberof SchmancyContentDrawer
	 * @protected
	 */
	@provide({ context: SchmancyContentDrawerSheetMode })
	@state()
	mode: TSchmancyContentDrawerSheetMode

	@provide({ context: SchmancyContentDrawerSheetState })
	@property()
	open: TSchmancyContentDrawerSheetState

	@provide({ context: SchmancyContentDrawerID })
	schmancyContentDrawerID = Math.floor(Math.random() * Date.now()).toString()

	@queryAssignedElements({ flatten: true })
	assignedElements!: HTMLElement[]
	firstUpdated(): void {
		fromEvent<CustomEvent>(window, 'resize')
			.pipe(
				startWith(true),
				map(() => (this.clientWidth ? this.clientWidth : window.innerWidth)),
				map(width => width >= this.minWidth),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
				debounceTime(100),
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

		fromEvent<CustomEvent>(window, 'schmancy-content-drawer-render')
			.pipe(
				tap(event => {
					event.stopPropagation()
				}),
				map(event => event.detail.component),
				takeUntil(this.disconnecting),
			)
			.subscribe(component => {
				area.push({
					area: this.schmancyContentDrawerID,
					component: component,
					historyStrategy: 'silent',
				})
			})
	}

	protected render() {
		if (!this.mode || !this.open) return nothing
		return html`
			<schmancy-grid cols="auto 1fr" rows="1fr" flow="col" justify="stretch" align="stretch" class="flex h-[100%]">
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

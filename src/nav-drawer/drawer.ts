import { provide } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, startWith, takeUntil, tap } from 'rxjs'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
	TSchmancyDrawerNavbarState,
} from './context'
import { SchmancyEvents } from '..'

/**
 * @element schmancy-nav-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
@customElement('schmancy-nav-drawer')
export class SchmancyNavigationDrawer extends $LitElement(css`
	:host {
		display: block;
		height: 100vh;
		width: 100vw;
		overflow: hidden;
		position: relative;
		inset: 0;
	}
`) {
	/**
	 * The minimum width of the sidebar
	 * @attr	min-width
	 * @type {number}
	 * @memberof SchmancyNavigationDrawer
	 */
	@property({ type: Number })
	minWidth: number = 1240

	/**
	 * The mode of the sidebar
	 * @type {TSchmancyDrawerNavbarMode}
	 * @memberof SchmancyNavigationDrawer
	 * @protected
	 */
	@provide({ context: SchmancyDrawerNavbarMode })
	@state()
	mode: TSchmancyDrawerNavbarMode

	@provide({ context: SchmancyDrawerNavbarState })
	@property()
	open: TSchmancyDrawerNavbarState

	connectedCallback(): void {
		super.connectedCallback()
		fromEvent<CustomEvent>(window, 'resize')
			.pipe(
				map(event => event.target as Window),
				startWith(window),
				map(window => window.innerWidth),
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
		fromEvent<CustomEvent>(this, SchmancyEvents.NavDrawer_toggle)
			.pipe(
				tap(event => {
					event.stopPropagation()
				}),
				map(event => event.detail.state),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(state => {
				this.open = state
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
		'schmancy-nav-drawer': SchmancyNavigationDrawer
	}
}

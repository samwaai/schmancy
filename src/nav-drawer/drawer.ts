import { provide } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, startWith, takeUntil, tap } from 'rxjs'
import { SchmancyEvents } from '..'
import { fullHeight } from './../directives/height'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
	TSchmancyDrawerNavbarState,
} from './context'

/**
 * @element schmancy-nav-drawer
 * @slot appbar - The appbar slot
 * @slot - The content slot
 */
@customElement('schmancy-nav-drawer')
export class SchmancyNavigationDrawer extends $LitElement(css`
	:host {
		display: flex;
		flex-grow: 1;
		overflow: hidden;
	}
`) {
	// fullscreen property
	@property({ type: Boolean })
	fullscreen: boolean = false

	/**
	 * The minimum width of the sidebar
	 * @attr	breakpoint
	 * @type {number}
	 * @memberof SchmancyNavigationDrawer
	 */
	@property({ type: Number, attribute: 'breakpoint' })
	breakpoint: number = 768

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
				map(width => width >= this.breakpoint),
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
		fromEvent<CustomEvent>(window, SchmancyEvents.NavDrawer_toggle)
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
			<schmancy-grid
				cols=${this.fullscreen ? '1fr' : 'auto 1fr'}
				rows="auto 1fr"
				flow="row"
				justify="stretch"
				align="stretch"
				${fullHeight()}
			>
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

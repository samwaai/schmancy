import { provide } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, takeUntil, tap } from 'rxjs'
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
		/* Initially hide the component until it’s ready */
		visibility: hidden;
	}
	/* Once the component is ready, remove the hidden style */
	:host([data-ready]) {
		visibility: visible;
	}
`) {
	// fullscreen property
	@property({ type: Boolean })
	fullscreen: boolean = false

	/**
	 * The breakpoint for the sidebar based on Tailwind CSS breakpoints.
	 * Accepts: "sm", "md", "lg", or "xl".
	 *
	 * The following default values are used:
	 * - sm: 640px
	 * - md: 768px (default)
	 * - lg: 1024px
	 * - xl: 1280px
	 *
	 * @attr breakpoint
	 * @type {"sm" | "md" | "lg" | "xl"}
	 */
	@property({ type: String, attribute: 'breakpoint' })
	breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

	/**
	 * Mapping of Tailwind breakpoint tokens to their numeric pixel values.
	 */
	private static BREAKPOINTS: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280,
	}

	/**
	 * The mode of the sidebar.
	 */
	@provide({ context: SchmancyDrawerNavbarMode })
	@state()
	mode: TSchmancyDrawerNavbarMode

	/**
	 * The open/close state of the sidebar.
	 */
	@provide({ context: SchmancyDrawerNavbarState })
	@property()
	open: TSchmancyDrawerNavbarState

	/**
	 * A flag indicating that the initial state has been set.
	 */
	@state()
	private _initialized = false

	/**
	 * In firstUpdated, we can safely read attribute-set properties.
	 * We also initialize our state and subscribe to events.
	 */
	firstUpdated() {
		// Set the initial state based on the current window width.
		this.updateState(window.innerWidth)
		// Mark the component as ready
		this._initialized = true
		this.setAttribute('data-ready', '')

		// Subscribe to window resize events.
		fromEvent(window, 'resize')
			.pipe(
				// Extract the inner width.
				map(event => (event.target as Window).innerWidth),
				// Determine if we're above the breakpoint.
				map(width => width >= SchmancyNavigationDrawer.BREAKPOINTS[this.breakpoint]),
				distinctUntilChanged(),
				debounceTime(100),
				takeUntil(this.disconnecting),
			)
			.subscribe(isLargeScreen => {
				if (isLargeScreen) {
					this.mode = 'push'
					this.open = 'open'
				} else {
					this.mode = 'overlay'
					this.open = 'close'
				}
			})

		// Listen to the custom toggle event.
		fromEvent(window, SchmancyEvents.NavDrawer_toggle)
			.pipe(
				tap((event: CustomEvent) => {
					event.stopPropagation()
				}),
				map((event: CustomEvent) => event.detail.state),
				distinctUntilChanged(),
				takeUntil(this.disconnecting),
			)
			.subscribe(state => {
				console.log('Received toggle event:', state)
				// When in push mode, ignore a request to close the sidebar.
				if (this.mode === 'push' && state === 'close') return
				this.open = state
			})
	}

	/**
	 * Helper method to update state based on a given width.
	 */
	private updateState(width: number) {
		const isLargeScreen = width >= SchmancyNavigationDrawer.BREAKPOINTS[this.breakpoint]
		this.mode = isLargeScreen ? 'push' : 'overlay'
		this.open = isLargeScreen ? 'open' : 'close'
	}

	protected render() {
		// Optionally, you can check _initialized here,
		// but the CSS will already hide the component until it's ready.
		if (!this._initialized) return nothing

		return html`
			<schmancy-grid
				cols=${this.fullscreen ? '1fr' : 'auto 1fr'}
				rows="1fr"
				flow="col"
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

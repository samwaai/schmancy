import { provide } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { debounceTime, distinctUntilChanged, fromEvent, map, takeUntil, tap } from 'rxjs'
import { SchmancyEvents } from '..'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
	TSchmancyDrawerNavbarState,
} from './context'

/**
 * Responsive navigation drawer — a left sidebar that becomes a hamburger-triggered modal overlay on narrow viewports. Composes schmancy-nav-drawer-navbar (the nav rail), schmancy-nav-drawer-appbar (the top bar), and schmancy-nav-drawer-content (the main region).
 *
 * @element schmancy-nav-drawer
 * @summary The app-shell layout primitive. Wrap your whole app in this when you want "persistent sidebar on desktop, drawer on mobile" behavior. Mode auto-switches at the breakpoint.
 * @example
 * <schmancy-nav-drawer>
 *   <schmancy-nav-drawer-navbar>
 *     <!-- nav items, typically schmancy-list-item links -->
 *   </schmancy-nav-drawer-navbar>
 *   <schmancy-nav-drawer-appbar>App title</schmancy-nav-drawer-appbar>
 *   <schmancy-nav-drawer-content>
 *     <!-- router outlet / page content -->
 *   </schmancy-nav-drawer-content>
 * </schmancy-nav-drawer>
 * @platform div - Flex layout with viewport-width mode switching. Degrades to a stack of plain divs if the tag never registers.
 * @slot - The content slot
 * @fires schmancy-drawer-state - When the drawer open/close state changes on mobile.
 */
@customElement('schmancy-nav-drawer')
export class SchmancyNavigationDrawer extends $LitElement(css`
	:host {
		display: grid;
		grid-template-columns: auto 1fr;
		grid-template-rows: 1fr;
		flex-grow: 1;
		height: 100%;
		overflow: hidden;
		/* Initially hide the component until it's ready */
		visibility: hidden;
	}

	:host([data-ready]) {
		visibility: visible;
	}

	:host([fullscreen]) {
		grid-template-columns: 1fr;
	}
`) {
	@property({ type: Boolean, reflect: true })
	fullscreen: boolean = false

	/**
	 * The breakpoint for the sidebar based on Tailwind CSS breakpoints.
	 * Accepts: "sm", "md", "lg", or "xl".
	 */
	@property({ type: String, attribute: 'breakpoint' })
	breakpoint: 'sm' | 'md' | 'lg' | 'xl' = 'md'

	private static BREAKPOINTS: Record<'sm' | 'md' | 'lg' | 'xl', number> = {
		sm: 640,
		md: 768,
		lg: 1024,
		xl: 1280,
	}

	@provide({ context: SchmancyDrawerNavbarMode })
	@state()
	mode: TSchmancyDrawerNavbarMode

	@provide({ context: SchmancyDrawerNavbarState })
	@property()
	open: TSchmancyDrawerNavbarState

	firstUpdated() {
		this.updateState(window.innerWidth)
		this.setAttribute('data-ready', '')

		fromEvent(window, 'resize')
			.pipe(
				map(event => (event.target as Window).innerWidth),
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

		fromEvent(window, 'fullscreen').pipe(
			tap((event: Event) => {
				const customEvent = event as CustomEvent
				this.fullscreen = customEvent.detail
			}),
			takeUntil(this.disconnecting)
		).subscribe()

		fromEvent(window, SchmancyEvents.NavDrawer_toggle)
			.pipe(
				tap((event: CustomEvent) => {
					event.stopPropagation()
				}),
				map((event: CustomEvent) => event.detail.state),
				takeUntil(this.disconnecting),
				debounceTime(10),
			)
			.subscribe(state => {
				// Handle 'toggle' state
				if (state === 'toggle') {
					state = this.open === 'open' ? 'close' : 'open'
				}
				if (this.mode === 'push' && state === 'close') return
				this.open = state
			})
	}

	private updateState(width: number) {
		const isLargeScreen = width >= SchmancyNavigationDrawer.BREAKPOINTS[this.breakpoint]
		this.mode = isLargeScreen ? 'push' : 'overlay'
		this.open = isLargeScreen ? 'open' : 'close'
	}

	protected render() {
		return html`<slot></slot>`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer': SchmancyNavigationDrawer
	}
}

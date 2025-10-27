import { consume } from '@lit/context'
import { $LitElement } from '@mixins/index'
import { html } from 'lit'
import { customElement, property, query, state } from 'lit/decorators.js'
import { SchmancyEvents, SchmancyTheme, color } from '..'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
	TSchmancyDrawerNavbarState,
} from './context'

// Animation configuration constants.
const ANIMATION_EASING = 'cubic-bezier(0.5, 0.01, 0.25, 1)'
const OVERLAY_ANIM_DURATION_OPEN = 200
const OVERLAY_ANIM_DURATION_CLOSE = 150
const NAV_ANIM_DURATION = 200

@customElement('schmancy-nav-drawer-navbar')
export class SchmancyNavigationDrawerSidebar extends $LitElement() {
	// Consume context values. Renamed from "state" to "drawerState" to avoid confusion.
	@consume({ context: SchmancyDrawerNavbarMode, subscribe: true })
	@state()
	mode!: TSchmancyDrawerNavbarMode

	@consume({ context: SchmancyDrawerNavbarState, subscribe: true })
	@state()
	drawerState!: TSchmancyDrawerNavbarState

	@query('#overlay') overlay!: HTMLElement
	@query('nav') nav!: HTMLElement

	@property({ type: String }) width = '220px'
	@state() private _initialized = false

	/**
	 * firstUpdated()
	 * Set initial styles based on the current mode and consumed state.
	 */
	firstUpdated() {
		if (this.mode === 'overlay') {
			if (this.drawerState === 'close') {
				this.nav.style.transform = 'translateX(-100%)'
				this.overlay.style.display = 'none'
			} else if (this.drawerState === 'open') {
				this.nav.style.transform = 'translateX(0)'
				this.overlay.style.display = 'block'
				this.overlay.style.opacity = '0.4'
			}
		} else if (this.mode === 'push') {
			// In push mode, the nav is always visible and the overlay hidden.
			this.nav.style.transform = 'translateX(0)'
			this.overlay.style.display = 'none'
		}
		this._initialized = true
	}

	/**
	 * updated()
	 * Trigger animations when either the consumed mode or state changes.
	 */
	updated(changedProperties: Map<string, any>) {
		if (!this._initialized) return

		if (changedProperties.has('drawerState') || changedProperties.has('mode')) {
			if (this.mode === 'overlay') {
				if (this.drawerState === 'open') {
					// Animate only if the nav isn’t already open.
					if (this.nav.style.transform !== 'translateX(0)') {
						this.openOverlay()
						this.showNavDrawer()
					}
				} else if (this.drawerState === 'close') {
					if (this.nav.style.transform !== 'translateX(-100%)') {
						this.hideNavDrawer()
						this.closeOverlay()
					}
				}
			} else if (this.mode === 'push') {
				if (this.nav.style.transform !== 'translateX(0)') {
					this.showNavDrawer()
				}
				if (this.overlay.style.display !== 'none') {
					this.closeOverlay()
				}
			}
		}
	}

	/**
	 * Animate the overlay to fade in.
	 */
	openOverlay() {
		this.overlay.style.display = 'block'
		this.overlay.animate([{ opacity: 0 }, { opacity: 0.4 }], {
			duration: OVERLAY_ANIM_DURATION_OPEN,
			easing: ANIMATION_EASING,
			fill: 'forwards',
		})
	}

	/**
	 * Animate the overlay to fade out, then hide it.
	 */
	closeOverlay() {
		const animation = this.overlay.animate([{ opacity: 0.4 }, { opacity: 0 }], {
			duration: OVERLAY_ANIM_DURATION_CLOSE,
			easing: ANIMATION_EASING,
			fill: 'forwards',
		})
		animation.onfinish = () => {
			this.overlay.style.display = 'none'
		}
	}
	showNavDrawer() {
		// Use computed style if needed, but here we directly update inline style after animation.
		const animation = this.nav.animate([{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }], {
			duration: NAV_ANIM_DURATION,
			easing: ANIMATION_EASING,
			fill: 'forwards',
		})
		animation.onfinish = () => {
			this.nav.style.transform = 'translateX(0)'
		}
	}

	hideNavDrawer() {
		const animation = this.nav.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }], {
			duration: NAV_ANIM_DURATION,
			easing: ANIMATION_EASING,
			fill: 'forwards',
		})
		animation.onfinish = () => {
			this.nav.style.transform = 'translateX(-100%)'
		}
	}

	/**
	 * Handle overlay click events by dispatching a custom event
	 * to close the navigation drawer.
	 */
	private handleOverlayClick() {
		window.dispatchEvent(
			new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
				detail: { state: 'close' },
				bubbles: true,
				composed: true,
			}),
		)
	}

	protected render() {
		const sidebarClasses = {
			'p-2 max-w-[360px] w-fit h-full overflow-auto': true,
			block: this.mode === 'push',
			'fixed inset-0 z-50': this.mode === 'overlay',
		}
		const overlayClass = {
			'fixed inset-0 z-49 hidden': true,
		}
		const styleMap = {
			width: this.width,
		}

		return html`
			<nav
				style=${this.styleMap(styleMap)}
				class="${this.classMap({ ...sidebarClasses })}"
				${color({
					bgColor: SchmancyTheme.sys.color.surface.container,
				})}
			>
				<slot></slot>
			</nav>
			<div
				id="overlay"
				${color({
					bgColor: SchmancyTheme.sys.color.scrim,
				})}
				@click=${this.handleOverlayClick}
				class="${this.classMap({ ...overlayClass })}"
			></div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-nav-drawer-navbar': SchmancyNavigationDrawerSidebar
	}
}

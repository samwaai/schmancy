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

@customElement('schmancy-nav-drawer-navbar')
export class SchmancyNavigationDrawerSidebar extends $LitElement() {
	@consume({ context: SchmancyDrawerNavbarMode, subscribe: true })
	@state()
	mode: TSchmancyDrawerNavbarMode

	@consume({ context: SchmancyDrawerNavbarState, subscribe: true })
	@state()
	private state: TSchmancyDrawerNavbarState

	@query('#overlay') overlay!: HTMLElement
	@query('nav') nav!: HTMLElement

	@property({ type: String }) width = '320px'

	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('state')) {
			console.log('state changed', this.state, this.mode)
			if (this.mode === 'overlay') {
				if (this.state === 'close') {
					this.hideNavDrawer()
					this.closeOverlay()
				} else if (this.state === 'open') {
					this.openOverlay()
					this.showNavDrawer()
				}
			} else if (this.mode === 'push') {
				this.showNavDrawer()
				this.closeOverlay()
			}
		}
	}

	openOverlay() {
		// Equivalent to onBegin
		this.overlay.style.display = 'block'

		// Animate opacity from 0 to 0.4
		this.overlay.animate([{ opacity: 0 }, { opacity: 0.4 }], {
			duration: 200,
			easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
			fill: 'forwards', // <-- This keeps the final keyframe (0.4) after finishing
		})
		// If you want an onfinish here, you can add it:
		// .onfinish = () => console.log('overlay opened!')
	}

	closeOverlay() {
		// Animate opacity from 0.4 to 0
		const animation = this.overlay.animate([{ opacity: 0.4 }, { opacity: 0 }], {
			duration: 150,
			easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
			fill: 'forwards',
		})
		// translateX(-100%) when the animation is finished
		// Equivalent to onComplete
		animation.onfinish = () => {
			this.overlay.style.display = 'none'
		}
	}

	// show nav drawer
	showNavDrawer() {
		//  check the transform, skip if already open
		if (this.nav.style.transform === 'translateX(0)') return
		const animation = this.nav.animate([{ transform: 'translateX(-100%)' }, { transform: 'translateX(0)' }], {
			duration: 200,
			easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
			fill: 'forwards',
		})
		animation.onfinish = () => {
			this.state = 'open'
		}
	}

	// hide nav drawer
	hideNavDrawer() {
		// skip if already closed
		if (this.nav.style.transform === 'translateX(-100%)') return
		const animation = this.nav.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-100%)' }], {
			duration: 200,
			easing: 'cubic-bezier(0.5, 0.01, 0.25, 1)',
			fill: 'forwards',
		})
		animation.onfinish = () => {
			this.state = 'close'
		}
	}

	protected render() {
		const sidebarClasses = {
			'p-[16px] max-w-[360px] w-fit h-full overflow-auto': true,
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
				@click=${() => {
					window.dispatchEvent(
						new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
							detail: { state: 'close' },
							bubbles: true,
							composed: true,
						}),
					)
				}}
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

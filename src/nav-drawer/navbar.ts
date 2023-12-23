import { animate } from '@juliangarnierorg/anime-beta'
import { consume } from '@lit/context'
import { $LitElement } from '@mhmo91/lit-mixins/src'
import { css, html } from 'lit'
import { customElement, query, state } from 'lit/decorators.js'
import { SchmancyEvents, SchmancyTheme, color } from '..'
import {
	SchmancyDrawerNavbarMode,
	SchmancyDrawerNavbarState,
	TSchmancyDrawerNavbarMode,
	TSchmancyDrawerNavbarState,
} from './context'
@customElement('schmancy-nav-drawer-navbar')
export class SchmancyNavigationDrawerSidebar extends $LitElement(css``) {
	@consume({ context: SchmancyDrawerNavbarMode, subscribe: true })
	@state()
	mode: TSchmancyDrawerNavbarMode

	@consume({ context: SchmancyDrawerNavbarState, subscribe: true })
	@state()
	private state: TSchmancyDrawerNavbarState

	@query('#overlay') overlay!: HTMLElement

	updated(changedProperties: Map<string, any>) {
		if (changedProperties.has('state')) {
			if (this.mode === 'overlay') {
				if (this.state === 'close') {
					this.closeOverlay()
				} else if (this.state === 'open') {
					this.openOverlay()
				}
			} else if (this.mode === 'push') {
				this.closeOverlay()
			}
		}
	}

	openOverlay() {
		animate(this.overlay, {
			opacity: 0.4,
			duration: 500,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onBegin: () => {
				this.overlay.style.display = 'block'
			},
		})
	}

	closeOverlay() {
		animate(this.overlay, {
			opacity: [0.4, 0],
			duration: 500,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onComplete: () => {
				this.overlay.style.display = 'none'
			},
		})
	}

	protected render() {
		const animate = {
			'transition-all transform-gpu duration-[500ms] ease-[cubicBezier(0.5, 0.01, 0.25, 1)]': true,
		}

		const sidebarClasses = {
			'p-[16px] max-w-[360px] w-fit': true,
			block: this.mode === 'push',
			'fixed inset-0 translate-x-[-100%] z-50 min-w-[360px]': this.mode === 'overlay',
			'translate-x-0': this.mode === 'overlay' && this.state === 'open',
			'translate-x-[-100%]': this.mode === 'overlay' && this.state === 'close',
		}
		const overlayClass = {
			'fixed inset-0 z-[49] hidden': true,
		}

		return html`
			<nav
				class="${this.classMap({ ...sidebarClasses, ...animate })}"
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
					this.dispatchEvent(
						new CustomEvent(SchmancyEvents.NavDrawer_toggle, {
							detail: { state: 'close' },
							bubbles: true,
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

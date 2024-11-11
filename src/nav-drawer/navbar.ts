import { animate } from '@juliangarnierorg/anime-beta'
import { consume } from '@lit/context'
import { $LitElement } from '@schmancy/mixin/lit'
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

	@property({ type: String }) width = '320px'

	connectedCallback(): void {
		super.connectedCallback()
		// const touchStart$ = fromEvent<TouchEvent>(document, 'touchstart')
		// const touchMove$ = fromEvent<TouchEvent>(document, 'touchmove')
		// const touchEnd$ = fromEvent<TouchEvent>(document, 'touchend')
		// const swipeRight$ = touchStart$.pipe(
		// 	takeUntil(this.disconnecting),
		// 	switchMap(start => {
		// 		const startX = start.touches[0].clientX
		// 		const startY = start.touches[0].clientY

		// 		return touchMove$.pipe(
		// 			map(move => {
		// 				return {
		// 					startX,
		// 					startY,
		// 					moveX: move.touches[0].clientX,
		// 					moveY: move.touches[0].clientY,
		// 				}
		// 			}),
		// 			takeUntil(touchEnd$),
		// 		)
		// 	}),
		// 	filter(position => {
		// 		const xDist = position.moveX - position.startX
		// 		const yDist = Math.abs(position.moveY - position.startY)
		// 		return xDist > 120 && yDist < 30 // Thresholds for swipe right and vertical tolerance
		// 	}),
		// )

		// swipeRight$.subscribe(() => {
		// 	schmancyNavDrawer.open(this)
		// 	// Add your logic here for what should happen on a swipe right
		// })
	}

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
			duration: 300,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onBegin: () => {
				this.overlay.style.display = 'block'
			},
		})
	}

	closeOverlay() {
		animate(this.overlay, {
			opacity: [0.4, 0],
			duration: 250,
			ease: 'cubicBezier(0.5, 0.01, 0.25, 1)',
			onComplete: () => {
				this.overlay.style.display = 'none'
			},
		})
	}

	protected render() {
		const animate = {
			'transition-all transform-gpu duration-[300ms] ease-[cubicBezier(0.5, 0.01, 0.25, 1)]': true,
		}

		const sidebarClasses = {
			'p-[16px] max-w-[360px] w-fit h-full overflow-auto': true,
			block: this.mode === 'push',
			'fixed inset-0 translate-x-[-100%] z-50': this.mode === 'overlay',
			'translate-x-0': this.mode === 'overlay' && this.state === 'open',
			'translate-x-[-100%]': this.mode === 'overlay' && this.state === 'close',
		}
		const overlayClass = {
			'fixed inset-0 z-[49] hidden': true,
		}

		const styleMap = {
			width: this.width,
		}
		return html`
			<nav
				style=${this.styleMap(styleMap)}
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

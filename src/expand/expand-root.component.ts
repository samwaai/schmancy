import { css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { SchmancyElement, SurfaceMixin } from '@mixins/index'
import type { TSurfaceColor } from '@schmancy/types'
import { SPRING_SMOOTH } from '../utils/animation.js'
import { reducedMotion$ } from '../directives/reduced-motion'
import '../surface/surface.js'

@customElement('schmancy-expand-root')
export class SchmancyExpandRoot extends SurfaceMixin(SchmancyElement) {
	static styles = [css`
	:host {
		display: contents;
	}

	.portal-panel {
		position: fixed;
		transform-origin: top left;
		will-change: clip-path, opacity;
		border-radius: 1rem;
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.5);
		z-index: 9999;
	}

	.minimize-btn {
		position: absolute;
		top: 0.5rem;
		right: 0.5rem;
		z-index: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 2rem;
		height: 2rem;
		border-radius: 9999px;
		border: none;
		background: transparent;
		cursor: pointer;
		opacity: 0.5;
		transition: opacity 150ms, background 150ms;
		color: inherit;
	}

	.minimize-btn:hover {
		opacity: 1;
		background: rgb(0 0 0 / 0.08);
	}
`];
	@property({ reflect: true }) override type: TSurfaceColor = 'solid'
	@state() isOpen = false
	private summaryRect: DOMRect | null = null

	private _panelRef = createRef<HTMLElement>()
	private _backdropRef = createRef<HTMLDivElement>()
	private _btnRef = createRef<HTMLButtonElement>()
	private _owner: (Element & { close?: () => void }) | null = null
	private _hideIndicator = false
	private _backdrop = true

	/** Called by schmancy-expand before nodes are moved */
	prepare(rect: DOMRect, owner: Element, hideIndicator = false, backdrop = true) {
		this.summaryRect = rect
		this._owner = owner as Element & { close?: () => void }
		this._hideIndicator = hideIndicator
		this._backdrop = backdrop
	}

	/** Called by schmancy-expand after nodes are moved in */
	async triggerOpen() {
		this.isOpen = true
		await this.updateComplete

		const panel = this._panelRef.value
		if (!panel) return

		const src = this.summaryRect!

		// 1. Anchor at summary's top-left, measure natural content size
		//    Use nearly full viewport height for measurement so content near the bottom
		//    of the screen isn't artificially capped — the positioning step will move the panel up.
		Object.assign(panel.style, {
			visibility: 'hidden',
			top: `${src.top}px`,
			left: `${src.left}px`,
			minWidth: `${src.width}px`,
			width: 'max-content',
			maxWidth: `${window.innerWidth - src.left}px`,
			height: 'auto',
			maxHeight: `${window.innerHeight - 32}px`,
			overflowY: 'auto',
		})

		const measured = panel.getBoundingClientRect()
		const finalW = measured.width
		const finalH = measured.height

		// 2. Adjust position so panel stays within viewport
		let finalTop = src.top
		let finalLeft = src.left
		if (finalTop + finalH > window.innerHeight) {
			finalTop = Math.max(0, src.bottom - finalH)
		}
		if (finalLeft + finalW > window.innerWidth) {
			finalLeft = Math.max(0, window.innerWidth - finalW)
		}

		// 3. Compute clip-path insets — summary rect expressed relative to panel final position
		//    These insets shrink the visible area down to exactly the summary box
		const insetTop = Math.max(0, src.top - finalTop)
		const insetLeft = Math.max(0, src.left - finalLeft)
		const insetRight = Math.max(0, finalLeft + finalW - (src.left + src.width))
		const insetBottom = Math.max(0, finalTop + finalH - (src.top + src.height))

		// 4. Place panel at final size + position, masked to summary bounds (no flash)
		Object.assign(panel.style, {
			visibility: '',
			top: `${finalTop}px`,
			left: `${finalLeft}px`,
			minWidth: `${src.width}px`,
			width: `${finalW}px`,
			height: `${finalH}px`,
			maxWidth: '',
			maxHeight: '',
			clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 0.5rem)`,
		})

		// 5. Animate the mask open — content revealed, not stretched
		this._animateOpen(insetTop, insetRight, insetBottom, insetLeft, finalTop)
	}

	/** Animate close, return Promise resolving when done */
	async triggerClose(targetRect: DOMRect): Promise<void> {
		await this._animateClose(targetRect)
		this.isOpen = false
		this.summaryRect = null
	}

	private _animateOpen(insetTop: number, insetRight: number, insetBottom: number, insetLeft: number, finalTop: number) {
		const panel = this._panelRef.value
		if (!panel) return

		if (reducedMotion$.value) {
			panel.style.clipPath = ''
			return
		}

		const backdrop = this._backdropRef.value
		if (backdrop) {
			backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: SPRING_SMOOTH.duration,
				easing: SPRING_SMOOTH.easingFallback,
				fill: 'forwards',
			})
		}

		const keyframes: Keyframe[] = [
			{
				clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 0.5rem)`,
				opacity: 0.9,
			},
			{
				clipPath: 'inset(0px 0px 0px 0px round 1rem)',
				opacity: 1,
			},
		]

		const anim = panel.animate(keyframes, {
			duration: SPRING_SMOOTH.duration,
			easing: SPRING_SMOOTH.easingFallback,
			fill: 'forwards',
		})

		// Clear clip-path and fixed dimensions after animation so content can grow naturally,
		// but cap at viewport height so overflow-y: auto can scroll
		anim.finished.then(() => {
			if (panel.isConnected) {
				panel.style.clipPath = ''
				panel.style.height = 'auto'
				panel.style.maxHeight = `${window.innerHeight - finalTop - 16}px`
			}
			return
		})

		const btn = this._btnRef.value
		if (btn) {
			btn.animate([{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }], {
				duration: SPRING_SMOOTH.duration,
				easing: SPRING_SMOOTH.easingFallback,
				fill: 'forwards',
			})
		}
	}

	private _animateClose(targetRect: DOMRect): Promise<void> {
		const panel = this._panelRef.value
		if (!panel) return Promise.resolve()
		if (reducedMotion$.value) return Promise.resolve()

		// Compute insets to mask panel back down to the summary box
		const panelRect = panel.getBoundingClientRect()
		const insetTop = Math.max(0, targetRect.top - panelRect.top)
		const insetLeft = Math.max(0, targetRect.left - panelRect.left)
		const insetRight = Math.max(0, panelRect.right - targetRect.right)
		const insetBottom = Math.max(0, panelRect.bottom - targetRect.bottom)

		const closeDuration = Math.round(SPRING_SMOOTH.duration * 0.4)
		const closeEasing = 'cubic-bezier(0.4, 0, 1, 1)'

		const closeKeyframes: Keyframe[] = [
			{ clipPath: 'inset(0px 0px 0px 0px round 1rem)', opacity: 1 },
			{
				clipPath: `inset(${insetTop}px ${insetRight}px ${insetBottom}px ${insetLeft}px round 0.5rem)`,
				opacity: 0.6,
			},
		]

		const anim = panel.animate(closeKeyframes, { duration: closeDuration, easing: closeEasing, fill: 'forwards' })

		const backdrop = this._backdropRef.value
		if (backdrop) {
			backdrop.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: closeDuration,
				easing: closeEasing,
				fill: 'forwards',
			})
		}

		const btn = this._btnRef.value
		if (btn) {
			btn.animate([{ transform: 'rotate(180deg)' }, { transform: 'rotate(0deg)' }], {
				duration: closeDuration,
				easing: closeEasing,
				fill: 'forwards',
			})
		}

		return anim.finished as unknown as Promise<void>
	}

	render() {
		if (!this.isOpen) return nothing

		return html`
			${this._backdrop ? html`
				<div
					${ref(this._backdropRef)}
					class="fixed inset-0 z-9998 backdrop-blur-sm backdrop-saturate-150 backdrop-brightness-105 bg-black/[0.07] will-change-[opacity]"
					@click=${() => this._owner?.close?.()}
				></div>
			` : nothing}
			<schmancy-surface
				${ref(this._panelRef)}
				class="portal-panel"
				type=${this.type}
				style="overflow-y: auto;"
			>
				${!this._hideIndicator ? html`
					<button
						${ref(this._btnRef)}
						class="minimize-btn"
						aria-label="Minimize"
						@click=${() => this._owner?.close?.()}
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				` : nothing}
				<slot></slot>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-expand-root': SchmancyExpandRoot
	}
}

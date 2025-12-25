import { directive, PartInfo, PartType, ElementPart } from 'lit/directive.js'
import { AsyncDirective } from 'lit/async-directive.js'
import { noChange, TemplateResult } from 'lit'
import { html, render } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { flip } from './flip-directive.js'

export interface LightboxOptions {
	images?: string[]
	index?: number
	overlay?: TemplateResult
}

class LightboxDirective extends AsyncDirective {
	private element?: HTMLImageElement
	private clickHandler?: EventListener
	private keyHandler?: EventListener
	private overlayElement?: HTMLDivElement
	private currentIndex = 0
	private images: string[] = []
	private overlay?: TemplateResult
	private clickPosition?: { x: number; y: number }

	constructor(partInfo: PartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('lightbox directive can only be used on elements')
		}
	}

	render(_options?: LightboxOptions) {
		return noChange
	}

	update(part: ElementPart, [options]: [LightboxOptions?]) {
		this.element = part.element as HTMLImageElement

		// Setup click handler
		if (!this.clickHandler) {
			this.clickHandler = (e: Event) => {
				e.preventDefault()
				e.stopPropagation()

				// Capture click position from MouseEvent or TouchEvent
				if ('clientX' in e) {
					this.clickPosition = { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY }
				} else if ('touches' in e && (e as TouchEvent).touches.length) {
					const touch = (e as TouchEvent).touches[0]
					this.clickPosition = { x: touch.clientX, y: touch.clientY }
				}

				if (options?.images && options.images.length > 0) {
					this.images = options.images
					this.currentIndex = options.index || 0
				} else {
					this.images = [this.element!.src]
					this.currentIndex = 0
				}
				this.overlay = options?.overlay

				this.open()
			}

			this.element.addEventListener('click', this.clickHandler)
			this.element.style.cursor = 'pointer'
			this.element.classList.add('hover:opacity-80', 'transition-opacity')
		}

		return noChange
	}

	private open() {
		// Create overlay container with flex centering
		this.overlayElement = document.createElement('div')
		this.overlayElement.className = 'fixed inset-0 flex items-center justify-center opacity-0 bg-black/95 backdrop-blur-sm'
		this.overlayElement.style.zIndex = '1000'

		// Render lightbox content using Lit
		render(this.renderLightbox(), this.overlayElement)

		// Add to body
		document.body.appendChild(this.overlayElement)
		document.body.style.overflow = 'hidden'

		// Animate in overlay
		requestAnimationFrame(() => {
			this.overlayElement!.animate([{ opacity: 0 }, { opacity: 1 }], {
				duration: 300,
				easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
				fill: 'forwards',
			})
		})

		// Setup keyboard
		this.keyHandler = (e: KeyboardEvent) => {
			if (e.key === 'Escape') this.close()
			if (e.key === 'ArrowLeft' && this.images.length > 1) this.prev()
			if (e.key === 'ArrowRight' && this.images.length > 1) this.next()
		}
		document.addEventListener('keydown', this.keyHandler)

		// Click overlay to close
		this.overlayElement.addEventListener('click', e => {
			if (e.target === this.overlayElement) this.close()
		})
	}

	private close() {
		if (!this.overlayElement) return

		const contentContainer = this.overlayElement.querySelector('[data-lightbox-content]') as HTMLElement

		// Animate back to click position
		if (contentContainer && this.clickPosition) {
			const rect = contentContainer.getBoundingClientRect()

			// Animate container shrinking toward click point
			const deltaX = this.clickPosition.x - (rect.left + rect.width / 2)
			const deltaY = this.clickPosition.y - (rect.top + rect.height / 2)

			const containerAnim = contentContainer.animate(
				[
					{ transform: 'translate(0, 0) scale(1)', opacity: 1 },
					{ transform: `translate(${deltaX}px, ${deltaY}px) scale(0.1)`, opacity: 0 },
				],
				{
					duration: 300,
					easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
					fill: 'forwards',
				},
			)

			this.overlayElement.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 250,
				easing: 'ease-out',
				fill: 'forwards',
			})

			containerAnim.onfinish = () => {
				this.overlayElement?.remove()
				this.overlayElement = undefined
				document.body.style.overflow = ''
			}
		} else {
			// Fallback to simple fade
			const animation = this.overlayElement.animate([{ opacity: 1 }, { opacity: 0 }], {
				duration: 250,
				easing: 'ease-out',
				fill: 'forwards',
			})

			animation.onfinish = () => {
				this.overlayElement?.remove()
				this.overlayElement = undefined
				document.body.style.overflow = ''
			}
		}

		if (this.keyHandler) {
			document.removeEventListener('keydown', this.keyHandler)
			this.keyHandler = undefined
		}
	}

	private prev() {
		this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
		this.updateImage()
	}

	private next() {
		this.currentIndex = (this.currentIndex + 1) % this.images.length
		this.updateImage()
	}

	private updateImage() {
		if (!this.overlayElement) return
		render(this.renderLightbox(), this.overlayElement)
	}

	private renderLightbox() {
		const currentSrc = this.images[this.currentIndex]
		const isGallery = this.images.length > 1

		return html`
			<div
				data-lightbox-content
				class="relative"
				style=${styleMap({
					transformOrigin: 'center center',
				})}
				@click=${(e: Event) => e.stopPropagation()}
			>
				<!-- Close button -->
				<button
					class="absolute top-2 right-2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
					@click=${() => this.close()}
					aria-label="Close"
				>
					<span class="text-2xl">×</span>
				</button>

				<!-- Image container with optional overlay -->
				<div class="relative">
					<img
						src=${currentSrc}
						${flip({
							sourceElement: this.element,
							position: this.clickPosition,
							duration: 600,
							scale: true,
							blackbird: true,
						})}
						class="object-contain rounded-lg"
						style="max-height: calc(100vh - 40px); max-width: 90vw;"
						@click=${() => !isGallery && this.close()}
					/>
					${this.overlay ? this.overlay : ''}
				</div>

				<!-- Gallery controls -->
				${isGallery
					? html`
							<div class="flex items-center justify-center gap-4 text-white mt-4">
								<button
									class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
									@click=${() => this.prev()}
									aria-label="Previous"
								>
									←
								</button>

								<div class="text-lg">${this.currentIndex + 1} / ${this.images.length}</div>

								<button
									class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
									@click=${() => this.next()}
									aria-label="Next"
								>
									→
								</button>
							</div>
						`
					: ''}
			</div>
		`
	}

	disconnected() {
		if (this.element && this.clickHandler) {
			this.element.removeEventListener('click', this.clickHandler)
		}
		this.close()
	}
}

export const lightbox = directive(LightboxDirective)

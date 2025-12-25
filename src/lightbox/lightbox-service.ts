import { filter, fromEvent, map, Subject, switchMap, takeUntil, tap } from 'rxjs'
import { html, render } from 'lit'
import { styleMap } from 'lit/directives/style-map.js'
import { ComponentType } from '../area/router.types'
import { discoverComponent } from '@mixins/discovery.service'
import { lightbox as lightboxDirective, type LightboxOptions } from './lightbox.directive'

export type LightboxConfig = {
	// Image mode
	image?: string
	images?: string[]
	index?: number
	overlay?: ComponentType

	// Component-only mode (no image background)
	component?: ComponentType

	props?: Record<string, unknown>
}


/**
 * Lightbox service for centralized lightbox management.
 * Follows the same patterns as DialogService.
 */
class LightboxService {
	private static instance: LightboxService

	// Subject for lightbox opening requests
	private pushSubject = new Subject<LightboxConfig>()

	// Subject for lightbox dismissal requests
	private dismissSubject = new Subject<void>()

	// Track active lightbox
	private activeLightbox?: {
		element: HTMLDivElement
		config: LightboxConfig
		currentIndex: number
		images: string[]
	}

	private constructor() {
		this.setupLightboxOpeningLogic()
		this.setupLightboxDismissLogic()
	}

	/**
	 * Get the singleton instance
	 */
	public static getInstance(): LightboxService {
		if (!LightboxService.instance) {
			LightboxService.instance = new LightboxService()
		}
		return LightboxService.instance
	}

	/**
	 * Sets up the main lightbox opening logic using RxJS pipes
	 */
	private setupLightboxOpeningLogic() {
		this.pushSubject
			.pipe(
				switchMap(config => {
					// Use discoverComponent to find schmancy-theme (same pattern as sheet.service.ts)
					return discoverComponent<HTMLElement>('schmancy-theme').pipe(
						map(theme => {
							// Determine container - use theme or fallback to body
							const container = theme || document.body

							// Create overlay element
							const overlay = document.createElement('div')
							overlay.className = 'fixed inset-0 flex items-center justify-center opacity-0 bg-black/95 backdrop-blur-sm'
							overlay.style.zIndex = '1000'

							container.appendChild(overlay)
							document.body.style.overflow = 'hidden'

							return { overlay, config, container }
						})
					)
				}),
				tap(({ overlay, config }) => {
					// Setup images array
					let images: string[] = []
					let currentIndex = 0

					if (config.images && config.images.length > 0) {
						images = config.images
						currentIndex = config.index || 0
					} else if (config.image) {
						images = [config.image]
						currentIndex = 0
					}

					// Store active lightbox state
					this.activeLightbox = {
						element: overlay,
						config,
						currentIndex,
						images,
					}

					// Keyboard handling via RxJS
					fromEvent<KeyboardEvent>(document, 'keydown').pipe(
						takeUntil(this.dismissSubject),
						filter(() => !!this.activeLightbox),
						tap(e => {
							if (e.key === 'Escape') this.dismiss()
							if (e.key === 'ArrowLeft' && this.activeLightbox!.images.length > 1) this.navigatePrev()
							if (e.key === 'ArrowRight' && this.activeLightbox!.images.length > 1) this.navigateNext()
						})
					).subscribe()

					// Click overlay to close via RxJS
					fromEvent<MouseEvent>(overlay, 'click').pipe(
						takeUntil(this.dismissSubject),
						filter(e => e.target === overlay),
						tap(() => this.dismiss())
					).subscribe()

					// Render content
					if (config.component) {
						this.renderComponent(overlay, config)
					} else {
						this.renderLightbox(overlay, config, images, currentIndex)
					}

					// Animate in
					requestAnimationFrame(() => {
						overlay.animate([{ opacity: 0 }, { opacity: 1 }], {
							duration: 300,
							easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
							fill: 'forwards',
						})
					})
				}),
			)
			.subscribe()
	}

	/**
	 * Sets up the lightbox dismissal logic
	 */
	private setupLightboxDismissLogic() {
		this.dismissSubject
			.pipe(
				tap(() => {
					if (!this.activeLightbox) return

					const { element } = this.activeLightbox

					// Animate out
					const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
						duration: 250,
						easing: 'ease-out',
						fill: 'forwards',
					})

					animation.onfinish = () => {
						element.remove()
						document.body.style.overflow = ''
					}

					this.activeLightbox = undefined
				}),
			)
			.subscribe()
	}

	/**
	 * Push/open a lightbox
	 */
	public push(config: LightboxConfig): void {
		// Close any existing lightbox first
		if (this.activeLightbox) {
			this.dismiss()
		}
		this.pushSubject.next(config)
	}

	/**
	 * Dismiss the lightbox
	 */
	public dismiss(): void {
		this.dismissSubject.next()
	}

	/**
	 * Navigate to previous image
	 */
	private navigatePrev(): void {
		if (!this.activeLightbox || this.activeLightbox.images.length <= 1) return

		const { images, config, element } = this.activeLightbox
		this.activeLightbox.currentIndex = (this.activeLightbox.currentIndex - 1 + images.length) % images.length
		this.renderLightbox(element, config, images, this.activeLightbox.currentIndex)
	}

	/**
	 * Navigate to next image
	 */
	private navigateNext(): void {
		if (!this.activeLightbox || this.activeLightbox.images.length <= 1) return

		const { images, config, element } = this.activeLightbox
		this.activeLightbox.currentIndex = (this.activeLightbox.currentIndex + 1) % images.length
		this.renderLightbox(element, config, images, this.activeLightbox.currentIndex)
	}

	/**
	 * Render component-only mode (no image background)
	 */
	private renderComponent(overlay: HTMLDivElement, config: LightboxConfig): void {
		if (!config.component) return

		// Create the component
		let component: HTMLElement
		if (typeof config.component === 'string') {
			component = document.createElement(config.component)
		} else {
			component = new (config.component as CustomElementConstructor)()
		}

		// Set props
		if (config.props) {
			Object.entries(config.props).forEach(([key, value]) => {
				;(component as unknown as Record<string, unknown>)[key] = value
			})
		}

		// Create wrapper with close button
		const template = html`
			<div class="relative" @click=${(e: Event) => e.stopPropagation()}>
				<!-- Close button -->
				<button
					class="absolute -top-12 right-0 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
					@click=${() => this.dismiss()}
					aria-label="Close"
				>
					<span class="text-2xl">×</span>
				</button>

				<!-- Component container -->
				<div id="lightbox-component-container"></div>
			</div>
		`

		render(template, overlay)

		// Append component after render
		const container = overlay.querySelector('#lightbox-component-container')
		if (container) {
			container.appendChild(component)
		}
	}

	/**
	 * Render image lightbox
	 */
	private renderLightbox(overlay: HTMLDivElement, config: LightboxConfig, images: string[], currentIndex: number): void {
		const currentSrc = images[currentIndex]
		const isGallery = images.length > 1

		// Create overlay component if specified
		let overlayComponent: HTMLElement | null = null
		if (config.overlay) {
			if (typeof config.overlay === 'string') {
				overlayComponent = document.createElement(config.overlay)
			} else if (typeof config.overlay === 'function') {
				overlayComponent = new (config.overlay as CustomElementConstructor)()
			}

			// Set props on the component
			if (config.props && overlayComponent) {
				Object.entries(config.props).forEach(([key, value]) => {
					;(overlayComponent as unknown as Record<string, unknown>)[key] = value
				})
			}
		}

		const template = html`
			<div
				class="relative"
				style=${styleMap({ maxWidth: '90vw', maxHeight: '90vh' })}
				@click=${(e: Event) => e.stopPropagation()}
			>
				<!-- Close button -->
				<button
					class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
					@click=${() => this.dismiss()}
					aria-label="Close"
				>
					<span class="text-2xl">×</span>
				</button>

				<!-- Image container with optional overlay -->
				<div class="relative" id="lightbox-image-container">
					<img
						src=${currentSrc}
						class="max-w-full object-contain rounded-lg"
						style=${styleMap({ maxHeight: '85vh' })}
						@click=${() => !isGallery && this.dismiss()}
					/>
				</div>

				<!-- Gallery controls -->
				${isGallery
					? html`
							<div
								class="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 text-white"
								style=${styleMap({ bottom: '-60px' })}
							>
								<button
									class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
									@click=${() => this.navigatePrev()}
									aria-label="Previous"
								>
									←
								</button>

								<div class="text-lg">${currentIndex + 1} / ${images.length}</div>

								<button
									class="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
									@click=${() => this.navigateNext()}
									aria-label="Next"
								>
									→
								</button>
							</div>
						`
					: ''}
			</div>
		`

		render(template, overlay)

		// Append overlay component to image container after render
		if (overlayComponent) {
			const container = overlay.querySelector('#lightbox-image-container')
			if (container) {
				// Remove any existing overlay component
				const existing = container.querySelector('[data-lightbox-overlay]')
				if (existing) existing.remove()

				overlayComponent.setAttribute('data-lightbox-overlay', '')
				container.appendChild(overlayComponent)
			}
		}
	}
}

/**
 * Unified lightbox type - works as both directive and service
 */
export type LightboxAPI = {
	(options?: LightboxOptions): ReturnType<typeof lightboxDirective>
	push: (config: LightboxConfig) => void
	dismiss: () => void
}

/**
 * Unified lightbox export - works as both directive and service:
 * - Directive: ${lightbox()} or ${lightbox({ overlay: html`...` })}
 * - Service: lightbox.push({ image, overlay: 'component-name', props })
 */
export const lightbox: LightboxAPI = Object.assign(
	// Callable as directive (backward compatible)
	(options?: LightboxOptions) => lightboxDirective(options),
	// Also has service methods
	{
		push: (config: LightboxConfig) => LightboxService.getInstance().push(config),
		dismiss: () => LightboxService.getInstance().dismiss(),
	},
)

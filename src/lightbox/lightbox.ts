import { css, html, PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'
import { ref, createRef, Ref } from 'lit/directives/ref.js'
import { fromEvent } from 'rxjs'
import { filter, takeUntil, tap, switchMap, map, first } from 'rxjs/operators'
import { $LitElement } from '@mixins/index'

@customElement('schmancy-lightbox')
export class SchmancyLightbox extends $LitElement(css`
	:host {
		display: contents;
	}
`) {
	@property({ type: String }) src: string = ''
	@property({ type: Array }) images: string[] = []
	@property({ type: Number }) initialIndex: number = 0
	@property({ type: Boolean }) open: boolean = false

	@state() private currentIndex: number = 0
	@state() private isLoading: boolean = false

	private readonly swipeThreshold = 50
	private overlayRef: Ref<HTMLDivElement> = createRef()
	private contentRef: Ref<HTMLDivElement> = createRef()
	private imageRef: Ref<HTMLImageElement> = createRef()

	private get isGalleryMode(): boolean {
		return this.images.length > 0
	}

	private get currentImageSrc(): string {
		if (this.isGalleryMode) {
			return this.images[this.currentIndex] || ''
		}
		return this.src
	}

	connectedCallback() {
		super.connectedCallback()
		this.currentIndex = this.initialIndex
	}

	updated(changedProperties: PropertyValues) {
		super.updated(changedProperties)

		if (changedProperties.has('open')) {
			if (this.open) {
				document.body.style.overflow = 'hidden'
				this.animateIn()
				this.setupEventListeners()
			} else {
				document.body.style.overflow = ''
				this.animateOut()
			}
		}

		if (changedProperties.has('initialIndex')) {
			this.currentIndex = this.initialIndex
		}

		if (changedProperties.has('currentIndex') && this.open) {
			this.animateImageChange()
		}
	}

	private animateIn() {
		const overlay = this.overlayRef.value
		const content = this.contentRef.value
		const image = this.imageRef.value

		if (overlay) {
			// Set initial styles
			overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'
			overlay.style.opacity = '0'

			// Animate to visible state
			overlay.animate(
				[
					{ opacity: 0 },
					{ opacity: 1 },
				],
				{
					duration: 300,
					easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
					fill: 'forwards',
				},
			)

			// Manually set background color after a tick
			requestAnimationFrame(() => {
				overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.95)'
			})
		}

		if (content) {
			content.animate(
				[
					{ transform: 'scale(0.95)', opacity: 0 },
					{ transform: 'scale(1)', opacity: 1 },
				],
				{
					duration: 400,
					delay: 100,
					easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // Spring effect
					fill: 'forwards',
				},
			)
		}

		if (image) {
			image.animate(
				[
					{ opacity: 0, transform: 'scale(0.98)' },
					{ opacity: 1, transform: 'scale(1)' },
				],
				{
					duration: 350,
					delay: 150,
					easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
					fill: 'forwards',
				},
			)
		}
	}

	private animateOut() {
		const overlay = this.overlayRef.value
		const content = this.contentRef.value
		const image = this.imageRef.value

		if (image) {
			image.animate(
				[
					{ transform: 'scale(1)', opacity: 1 },
					{ transform: 'scale(0.95)', opacity: 0 },
				],
				{
					duration: 200,
					easing: 'ease-out',
					fill: 'forwards',
				},
			)
		}

		if (content) {
			content.animate(
				[
					{ transform: 'scale(1)', opacity: 1 },
					{ transform: 'scale(0.95)', opacity: 0 },
				],
				{
					duration: 250,
					easing: 'ease-out',
					fill: 'forwards',
				},
			)
		}

		if (overlay) {
			const animation = overlay.animate(
				[
					{ opacity: 1 },
					{ opacity: 0 },
				],
				{
					duration: 250,
					delay: 50,
					easing: 'ease-out',
					fill: 'forwards',
				},
			)

			animation.onfinish = () => {
				// Reset background color
				overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)'
				this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
			}
		}
	}

	private animateImageChange() {
		const image = this.imageRef.value
		if (!image) return

		// Fade out
		const fadeOut = image.animate(
			[
				{ opacity: 1, transform: 'scale(1)' },
				{ opacity: 0, transform: 'scale(0.98)' },
			],
			{
				duration: 150,
				easing: 'ease-out',
				fill: 'forwards',
			},
		)

		// Fade in after fade out completes
		fadeOut.onfinish = () => {
			image.animate(
				[
					{ opacity: 0, transform: 'scale(0.98)' },
					{ opacity: 1, transform: 'scale(1)' },
				],
				{
					duration: 200,
					easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
					fill: 'forwards',
				},
			)
		}
	}

	private setupEventListeners() {
		// Keyboard navigation
		fromEvent<KeyboardEvent>(document, 'keydown')
			.pipe(
				filter(() => this.open),
				tap(e => {
					switch (e.key) {
						case 'Escape':
							this.handleClose()
							break
						case 'ArrowLeft':
							this.handlePrevious()
							break
						case 'ArrowRight':
							this.handleNext()
							break
					}
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()

		// Touch/swipe events for mobile
		if (!this.isGalleryMode || this.images.length <= 1) return

		const content = this.contentRef.value
		if (!content) return

		const touchStart$ = fromEvent<TouchEvent>(content, 'touchstart')
		const touchEnd$ = fromEvent<TouchEvent>(content, 'touchend')

		touchStart$
			.pipe(
				switchMap(startEvent => {
					const startX = startEvent.touches[0].clientX
					return touchEnd$.pipe(
						first(),
						map(endEvent => {
							const endX = endEvent.changedTouches[0].clientX
							return endX - startX
						}),
					)
				}),
				filter(distance => Math.abs(distance) > this.swipeThreshold),
				tap(distance => (distance > 0 ? this.handlePrevious() : this.handleNext())),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	private handleClose = () => {
		this.open = false
	}

	private handlePrevious = () => {
		if (this.isGalleryMode && this.images.length > 1) {
			this.isLoading = true
			this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { index: this.currentIndex },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	private handleNext = () => {
		if (this.isGalleryMode && this.images.length > 1) {
			this.isLoading = true
			this.currentIndex = (this.currentIndex + 1) % this.images.length
			this.dispatchEvent(
				new CustomEvent('change', {
					detail: { index: this.currentIndex },
					bubbles: true,
					composed: true,
				}),
			)
		}
	}

	private handleImageLoad = () => {
		this.isLoading = false
	}

	private handleOverlayClick = (e: Event) => {
		// Close when clicking the overlay (not the content)
		if (e.target === e.currentTarget) {
			this.handleClose()
		}
	}

	render() {
		if (!this.open) return html``

		return html`
			<div
				${ref(this.overlayRef)}
				class="fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-sm"
				@click=${this.handleOverlayClick}
			>
				<div
					${ref(this.contentRef)}
					class="relative max-w-[90vw] max-h-[90vh]"
					@click=${(e: Event) => e.stopPropagation()}
				>
					<!-- Close Button -->
					<button
						class="absolute top-4 right-4 md:top-4 md:right-4 sm:top-2 sm:right-2 bg-white/15 backdrop-blur-md border border-white/20 text-white w-11 h-11 rounded-full flex items-center justify-center cursor-pointer z-10 transition-all duration-200 hover:bg-white/25 hover:scale-105 active:scale-95"
						@click=${this.handleClose}
						aria-label="Close lightbox"
						title="Close (Esc)"
					>
						<schmancy-icon>close</schmancy-icon>
					</button>

					<!-- Touch Zones for Gallery Navigation -->
					${when(
						this.isGalleryMode && this.images.length > 1,
						() => html`
							<div
								class="absolute top-0 bottom-0 left-0 w-1/3 cursor-pointer z-5"
								@click=${this.handlePrevious}
							></div>
							<div
								class="absolute top-0 bottom-0 right-0 w-1/3 cursor-pointer z-5"
								@click=${this.handleNext}
							></div>
						`,
					)}

					<!-- Loading Spinner -->
					${when(
						this.isLoading,
						() => html`
							<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
								<schmancy-progress indeterminate></schmancy-progress>
							</div>
						`,
					)}

					<!-- Main Image -->
					<img
						${ref(this.imageRef)}
						class="max-w-[90vw] max-h-[90vh] object-contain rounded select-none touch-pinch-zoom ${this
							.isGalleryMode
							? 'cursor-default'
							: 'cursor-pointer'}"
						.src=${this.currentImageSrc}
						alt="Full size image"
						@load=${this.handleImageLoad}
						@click=${() => (!this.isGalleryMode ? this.handleClose() : null)}
					/>

					<!-- Navigation Controls (Gallery Mode Only) -->
					${when(
						this.isGalleryMode && this.images.length > 1,
						() => html`
							<div
								class="absolute bottom-[-3.5rem] md:bottom-[-3.5rem] sm:bottom-[-3rem] left-1/2 -translate-x-1/2 flex items-center gap-4 z-10"
							>
								<button
									class="bg-white/15 backdrop-blur-md border border-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/25 hover:scale-105 active:scale-95"
									@click=${this.handlePrevious}
									aria-label="Previous image"
									title="Previous (←)"
								>
									<schmancy-icon>arrow_back</schmancy-icon>
								</button>

								<div class="text-white text-base font-medium min-w-16 text-center" aria-live="polite">
									${this.currentIndex + 1} / ${this.images.length}
								</div>

								<button
									class="bg-white/15 backdrop-blur-md border border-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-white/25 hover:scale-105 active:scale-95"
									@click=${this.handleNext}
									aria-label="Next image"
									title="Next (→)"
								>
									<schmancy-icon>arrow_forward</schmancy-icon>
								</button>
							</div>
						`,
					)}
				</div>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-lightbox': SchmancyLightbox
	}
}

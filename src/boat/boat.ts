import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { when } from 'lit/directives/when.js'

type BoatState = 'hidden' | 'minimized' | 'expanded'

@customElement('schmancy-boat')
export default class SchmancyBoat extends TailwindElement(css`
	/* Performance optimization - GPU hints only */
	.boat-container {
		will-change: transform, border-radius, width, max-width, box-shadow;
		contain: layout style;
		transform: translate3d(0, 0, 0); /* Force GPU acceleration */
		backface-visibility: hidden;
	}
`) {
	@property({
		type: String,
		reflect: true,
	})
	state: BoatState = 'hidden'

	@property({
		type: Boolean,
		reflect: true,
	})
	lowered: boolean = false

	@state()
	private contentVisible: boolean = false

	// Track previous state for animations
	 previousState: BoatState = 'hidden'

	// Web Animations API references
	private containerElement?: HTMLElement
	private contentElement?: HTMLElement
	private headerElement?: HTMLElement
	private iconElement?: HTMLElement

	// Active animations tracking
	private activeAnimations: Animation[] = []

	// Animation configs
	private readonly DURATIONS = {
		expand: 350,
		minimize: 250,
		hide: 200,
		contentFade: 300,
	}

	private readonly EASINGS = {
		emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
		emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
		emphasizedAccelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
		standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
	}

	// Shadow configurations for different states
	private readonly SHADOWS = {
		fab: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
		fabLowered:
			'0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
		expanded: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		none: 'none',
	}

	async toggleState() {
		// Cancel all active animations
		this.cancelActiveAnimations()

		const previousState = this.state
		const newState = this.state === 'minimized' ? 'expanded' : 'minimized'
		this.state = newState

		// Perform animations
		await this.animateStateChange(previousState, newState)

		this.dispatchEvent(
			new CustomEvent('toggle', {
				detail: this.state,
				bubbles: true,
				composed: true,
			}),
		)
	}

	private cancelActiveAnimations() {
		this.activeAnimations.forEach(animation => {
			animation.cancel()
		})
		this.activeAnimations = []
	}

	private async animateStateChange(from: BoatState, to: BoatState) {
		if (!this.containerElement) return

		const animations: Promise<void>[] = []

		// Get animation values for states
		const fromStyles = this.getStylesForState(from)
		const toStyles = this.getStylesForState(to)

		// Container animation - handles transform, dimensions, shadow, border-radius, and backdrop
		if (to === 'expanded') {
			// Expanding animation with overshoot
			const containerAnim = this.containerElement.animate(
				[
					{
						transform: fromStyles.transform,
						width: fromStyles.width,
						maxWidth: fromStyles.maxWidth,
						maxHeight: fromStyles.maxHeight,
						boxShadow: fromStyles.boxShadow,
						borderRadius: fromStyles.borderRadius,
						backdropFilter: fromStyles.backdropFilter,
						WebkitBackdropFilter: fromStyles.backdropFilter,
					} as any,
					{
						transform: 'translate3d(0, -8px, 0)',
						width: toStyles.width,
						maxWidth: toStyles.maxWidth,
						maxHeight: toStyles.maxHeight,
						boxShadow: toStyles.boxShadow,
						borderRadius: toStyles.borderRadius,
						backdropFilter: toStyles.backdropFilter,
						WebkitBackdropFilter: toStyles.backdropFilter,
						offset: 0.7,
					} as any,
					{
						transform: toStyles.transform,
						width: toStyles.width,
						maxWidth: toStyles.maxWidth,
						maxHeight: toStyles.maxHeight,
						boxShadow: toStyles.boxShadow,
						borderRadius: toStyles.borderRadius,
						backdropFilter: toStyles.backdropFilter,
						WebkitBackdropFilter: toStyles.backdropFilter,
					} as any,
				],
				{
					duration: this.DURATIONS.expand,
					easing: this.EASINGS.emphasizedDecelerate,
					fill: 'forwards',
				},
			)
			this.activeAnimations.push(containerAnim)
			animations.push(containerAnim.finished.then(() => {}))

			// Show content immediately for expanded state
			this.contentVisible = true

			// Animate content fade-in
			if (this.contentElement) {
				const contentAnim = this.contentElement.animate(
					[
						{ opacity: 0, transform: 'translateY(8px)' },
						{ opacity: 1, transform: 'translateY(0)' },
					],
					{
						duration: this.DURATIONS.contentFade,
						easing: this.EASINGS.standard,
						fill: 'forwards',
					},
				)
				this.activeAnimations.push(contentAnim)
				animations.push(contentAnim.finished.then(() => {}))
			}
		} else if (to === 'minimized') {
			// Minimizing animation
			const containerAnim = this.containerElement.animate(
				[
					{
						transform: fromStyles.transform,
						width: fromStyles.width,
						maxWidth: fromStyles.maxWidth,
						maxHeight: fromStyles.maxHeight,
						boxShadow: fromStyles.boxShadow,
						borderRadius: fromStyles.borderRadius,
						backdropFilter: fromStyles.backdropFilter,
						WebkitBackdropFilter: fromStyles.backdropFilter,
					} as any,
					{
						transform: toStyles.transform,
						width: toStyles.width,
						maxWidth: toStyles.maxWidth,
						maxHeight: toStyles.maxHeight,
						boxShadow: toStyles.boxShadow,
						borderRadius: toStyles.borderRadius,
						backdropFilter: toStyles.backdropFilter,
						WebkitBackdropFilter: toStyles.backdropFilter,
					} as any,
				],
				{
					duration: this.DURATIONS.minimize,
					easing: this.EASINGS.emphasizedAccelerate,
					fill: 'forwards',
				},
			)
			this.activeAnimations.push(containerAnim)

			// Hide content first, then animate container
			if (this.contentElement) {
				const contentAnim = this.contentElement.animate(
					[
						{ opacity: 1, transform: 'translateY(0)' },
						{ opacity: 0, transform: 'translateY(-8px)' },
					],
					{
						duration: 150,
						easing: this.EASINGS.standard,
						fill: 'forwards',
					},
				)
				this.activeAnimations.push(contentAnim)
				await contentAnim.finished
			}
			this.contentVisible = false

			animations.push(containerAnim.finished.then(() => {}))
		} else if (to === 'hidden') {
			// Hiding animation
			const containerAnim = this.containerElement.animate(
				[
					{
						transform: fromStyles.transform,
						width: fromStyles.width,
						maxWidth: fromStyles.maxWidth,
						maxHeight: fromStyles.maxHeight,
						boxShadow: fromStyles.boxShadow,
						borderRadius: fromStyles.borderRadius,
						backdropFilter: fromStyles.backdropFilter,
						WebkitBackdropFilter: fromStyles.backdropFilter,
					} as any,
					{
						transform: toStyles.transform,
						width: toStyles.width,
						maxWidth: toStyles.maxWidth,
						maxHeight: toStyles.maxHeight,
						boxShadow: toStyles.boxShadow,
						borderRadius: toStyles.borderRadius,
						backdropFilter: toStyles.backdropFilter,
						WebkitBackdropFilter: toStyles.backdropFilter,
					} as any,
				],
				{
					duration: this.DURATIONS.hide,
					easing: this.EASINGS.emphasizedAccelerate,
					fill: 'forwards',
				},
			)
			this.activeAnimations.push(containerAnim)
			this.contentVisible = false
			animations.push(containerAnim.finished.then(() => {}))
		}

		// Header scale animation
		if (this.headerElement) {
			const scale = to === 'minimized' ? 0.98 : 1
			const headerAnim = this.headerElement.animate(
				[{ transform: `scale(${from === 'minimized' ? 0.98 : 1})` }, { transform: `scale(${scale})` }],
				{
					duration: 200,
					easing: this.EASINGS.emphasized,
					fill: 'forwards',
				},
			)
			this.activeAnimations.push(headerAnim)
			animations.push(headerAnim.finished.then(() => {}))
		}

		// Icon rotation animation
		if (this.iconElement) {
			const rotation = to === 'expanded' ? 180 : 0
			const iconAnim = this.iconElement.animate(
				[{ transform: `rotate(${from === 'expanded' ? 180 : 0}deg)` }, { transform: `rotate(${rotation}deg)` }],
				{
					duration: 250,
					easing: this.EASINGS.emphasized,
					fill: 'forwards',
				},
			)
			this.activeAnimations.push(iconAnim)
			animations.push(iconAnim.finished.then(() => {}))
		}

		// Wait for all animations to complete
		await Promise.all(animations)

		// Clear completed animations
		this.activeAnimations = []
	}

	private getTransformForState(state: BoatState): string {
		switch (state) {
			case 'hidden':
				return 'translate3d(0, calc(100% + 16px), 0)'
			case 'minimized':
				return 'translate3d(0, calc(100% - 56px), 0)'
			case 'expanded':
				return 'translate3d(0, 0, 0)'
		}
	}

	private getStylesForState(state: BoatState) {
		const isMinimized = state === 'minimized'
		const isExpanded = state === 'expanded'
		const isHidden = state === 'hidden'

		// Calculate responsive width based on viewport
		let expandedWidth = '40vw'
		if (typeof window !== 'undefined') {
			const vw = window.innerWidth
			if (vw < 768) {
				expandedWidth = 'calc(100vw - 32px)'
			} else if (vw < 1024) {
				expandedWidth = '70vw'
			} else if (vw < 1280) {
				expandedWidth = '60vw'
			}
		}

		return {
			transform: this.getTransformForState(state),
			width: isMinimized ? '300px' : isExpanded ? expandedWidth : '300px',
			maxWidth: isMinimized ? '300px' : isExpanded ? '100%' : '300px',
			maxHeight: isExpanded ? '80vh' : 'auto',
			boxShadow: isHidden
				? this.SHADOWS.none
				: isMinimized
					? this.lowered
						? this.SHADOWS.fabLowered
						: this.SHADOWS.fab
					: this.SHADOWS.expanded,
			borderRadius: isMinimized ? '16px' : '8px 8px 0 0',
			backdropFilter: isExpanded ? 'blur(12px)' : 'none',
		}
	}

	firstUpdated() {
		// Get references for Web Animations API
		this.containerElement = this.shadowRoot?.querySelector('.boat-container') as HTMLElement
		this.contentElement = this.shadowRoot?.querySelector('.boat-content') as HTMLElement
		this.headerElement = this.shadowRoot?.querySelector('.boat-header') as HTMLElement
		this.iconElement = this.shadowRoot?.querySelector('.icon-container') as HTMLElement

		// Apply initial state styles programmatically
		if (this.containerElement) {
			const initialStyles = this.getStylesForState(this.state)

			// Set all animated properties
			this.containerElement.style.transform = initialStyles.transform
			this.containerElement.style.width = initialStyles.width
			this.containerElement.style.maxWidth = initialStyles.maxWidth
			this.containerElement.style.maxHeight = initialStyles.maxHeight
			this.containerElement.style.boxShadow = initialStyles.boxShadow
			this.containerElement.style.borderRadius = initialStyles.borderRadius
			this.containerElement.style.backdropFilter = initialStyles.backdropFilter
			;(this.containerElement.style as any).webkitBackdropFilter = initialStyles.backdropFilter
		}

		// Set initial header scale
		if (this.headerElement && this.state === 'minimized') {
			this.headerElement.style.transform = 'scale(0.98)'
		}

		// Set initial icon rotation
		if (this.iconElement && this.state === 'expanded') {
			this.iconElement.style.transform = 'rotate(180deg)'
		}

		// Set initial content visibility
		this.contentVisible = this.state === 'expanded'

		// Set initial content opacity
		if (this.contentElement) {
			this.contentElement.style.opacity = this.state === 'expanded' ? '1' : '0'
		}

		// Set initial previous state
		this.previousState = this.state
	}

	updated(changedProperties: Map<string | number | symbol, unknown>) {
		super.updated(changedProperties)

		// Handle external state changes
		if (changedProperties.has('state') && this.containerElement) {
			const oldState = changedProperties.get('state') as BoatState

			// Only animate if this is an external change (not from toggleState)
			if (oldState !== undefined && oldState !== this.state) {
				// Cancel any active animations
				this.cancelActiveAnimations()

				// Perform the animation from old state to new state
				this.animateStateChange(oldState, this.state).then(() => {
					// Update previous state after animation completes
					this.previousState = this.state
				})
			}
		}
	}

	protected render(): unknown {
		// Base structural classes only - all animated properties handled by Web Animations API
		const containerClasses = {
			// Base structural classes only
			'boat-container z-[100] fixed bottom-4 right-4 overflow-y-auto flex flex-col': true,
		}

		// Header classes - structural only
		const headerClasses = {
			'boat-header sticky top-0 px-3 py-2 flex items-center justify-between gap-3': true,
		}

		// Content container classes - structural only
		const contentClasses = {
			'boat-content z-0 flex-1': true,
		}

		// Dynamic surface elevation based on state (MD3: 3 for FAB, 1 for lowered, 4 for expanded)
		const surfaceElevation = this.state === 'minimized' ? (this.lowered ? '1' : '3') : '4'

		return html`
			<div class="${this.classMap(containerClasses)}">
				<section class="sticky top-0 z-10">
					<schmancy-surface
						elevation="${surfaceElevation}"
						class="cursor-pointer"
						rounded="${this.state === 'minimized' ? 'none' : 'top'}"
						type="containerLowest"
						@click=${() => this.toggleState()}
					>
						<div class="${this.classMap(headerClasses)}">
							<div class="flex-1 flex items-center min-w-0">
								<slot name="header"></slot>
							</div>

							<div class="flex items-center gap-1 flex-shrink-0">
								<schmancy-icon-button
									variant="${this.state === 'minimized' ? 'text' : 'filled tonal'}"
									@click=${async (e: Event) => {
										e.stopPropagation()
										await this.toggleState()
									}}
									title=${this.state === 'minimized' ? 'Expand' : 'Minimize'}
								>
									<span class="icon-container">
										${when(
											this.state === 'minimized',
											() => html`expand_less`,
											() => html`expand_more`,
										)}
									</span>
								</schmancy-icon-button>

								<schmancy-icon-button
									variant="text"
									@click=${async (e: Event) => {
										e.stopPropagation()
										this.cancelActiveAnimations()
										const previousState = this.state
										this.state = 'hidden'
										await this.animateStateChange(previousState, 'hidden')
										this.dispatchEvent(
											new CustomEvent('toggle', {
												detail: this.state,
												bubbles: true,
												composed: true,
											}),
										)
									}}
									title="Close"
								>
									close
								</schmancy-icon-button>
							</div>
						</div>
					</schmancy-surface>
				</section>
				<schmancy-surface .hidden=${!this.contentVisible} type="containerLow" class="${this.classMap(contentClasses)}">
					<slot></slot>
				</schmancy-surface>
			</div>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-boat': SchmancyBoat
	}
}

import { $LitElement } from '@mixins/index'
import { html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import { fromEvent, merge, race } from 'rxjs'
import { filter, switchMap, takeUntil, tap, finalize, map, take } from 'rxjs/operators'

type BoatState = 'hidden' | 'minimized' | 'expanded'

interface Position {
	x: number
	y: number
}

interface SavedPosition {
	x: number
	y: number
	anchor: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

@customElement('schmancy-boat')
export default class SchmancyBoat extends $LitElement(css`
	:host {
		display: contents;
	}
`) {
	@property({ type: String, reflect: true })
	get state(): BoatState {
		return this.currentState
	}
	set state(value: BoatState) {
		if (this.isAnimating || value === this.currentState) return
		this.animateToState(value)
	}

	@property({ type: String }) id: string = 'default'

	@property({ type: Boolean, reflect: true })
	get lowered(): boolean {
		return this.isLowered
	}
	set lowered(value: boolean) {
		this.isLowered = value
		this.requestUpdate()
	}

	// New properties for simplified API
	@property({ type: String }) icon?: string
	@property({ type: String }) label?: string
	@property() badge?: string | number

	// Element references
	private containerRef: Ref<HTMLDivElement> = createRef()
	private contentRef: Ref<HTMLElement> = createRef()
	private iconRef: Ref<HTMLElement> = createRef()
	private headerRef: Ref<HTMLElement> = createRef()

	// Current animation reference
	private currentAnimation?: Animation

	// Animation configuration
	private readonly ANIMATION_CONFIG = {
		durations: {
			expand: 350,
			minimize: 250,
			hide: 200,
			content: 300,
		},
		easing: {
			emphasized: 'cubic-bezier(0.2, 0.0, 0, 1.0)',
			decelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1.0)',
			accelerate: 'cubic-bezier(0.3, 0.0, 0.8, 0.15)',
			standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
		},
		shadows: {
			fab: '0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)',
			fabLowered:
				'0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12)',
			expanded: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
		},
	}

	// Reactive state for template
	@state() private currentState: BoatState = 'minimized'
	@state() private isContentVisible: boolean = false
	@state() private isAnimating: boolean = false
	@state() private isLowered: boolean = false
	@state() private isDragging: boolean = false
	@state() private position: Position = { x: 16, y: 16 }
	@state() private anchor: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' = 'bottom-right'

	connectedCallback() {
		super.connectedCallback()

		if (typeof window !== 'undefined') {
			fromEvent(window, 'resize')
				.pipe(takeUntil(this.disconnecting))
				.subscribe(() => {
					if (this.currentState === 'expanded') {
						this.updateExpandedWidth()
					}
				})

			// Keyboard shortcut - Escape key
			fromEvent<KeyboardEvent>(window, 'keydown')
				.pipe(
					filter(e => e.key === 'Escape' && this.currentState !== 'hidden'),
					tap(e => e.preventDefault()),
					takeUntil(this.disconnecting),
				)
				.subscribe(() => {
					if (this.currentState === 'expanded') {
						this.toggleState() // Minimize on Esc if expanded
					} else {
						this.close() // Hide on Esc if minimized
					}
				})
		}
	}

	private initializePosition() {
		if (typeof window === 'undefined') return

		const saved = localStorage.getItem(`schmancy-boat-${this.id}`)

		if (saved) {
			try {
				const parsed: SavedPosition = JSON.parse(saved)
				this.position = { x: parsed.x, y: parsed.y }
				this.anchor = parsed.anchor
				console.log('📍 Loaded position:', this.id, parsed)
			} catch (e) {
				// Use default position on parse error
			}
		}
		// If no saved position, use default from @state initialization
	}

	private async animateToState(targetState: BoatState) {
		if (this.isAnimating || targetState === this.currentState) return

		const previousState = this.currentState
		this.isAnimating = true

		try {
			await this.performTransition(previousState, targetState)
			this.currentState = targetState
			this.isContentVisible = targetState === 'expanded'

			// Dispatch event
			this.dispatchEvent(
				new CustomEvent('toggle', {
					detail: targetState,
					bubbles: true,
					composed: true,
				}),
			)
		} catch (err) {
			console.warn('Animation error:', err)
			this.currentState = targetState
			this.isContentVisible = targetState === 'expanded'
		} finally {
			this.isAnimating = false
		}
	}

	// Simplified animation transition
	private async performTransition(fromState: BoatState, toState: BoatState): Promise<void> {
		this.currentAnimation?.cancel()

		const container = this.containerRef.value
		if (!container) return

		// Update content visibility before expand
		if (toState === 'expanded') {
			this.isContentVisible = true
		}

		// Create animations
		const animations = this.createAnimations(fromState, toState)

		// Wait for main animation to complete
		if (animations.container) {
			this.currentAnimation = animations.container
			await animations.container.finished

			// Hide content after minimize
			if (toState !== 'expanded') {
				this.isContentVisible = false
			}
		}
	}

	// Create animations for state transition
	private createAnimations(fromState: BoatState, toState: BoatState) {
		const container = this.containerRef.value
		const content = this.contentRef.value
		const icon = this.iconRef.value
		const animations: { container?: Animation; content?: Animation; icon?: Animation } = {}

		if (!container) return animations

		const config = this.ANIMATION_CONFIG
		const fromStyles = this.getStyleForState(fromState)
		const toStyles = this.getStyleForState(toState)

		// Container animation
		if (toState === 'expanded') {
			// Expand animation without transform
			animations.container = container.animate([fromStyles, toStyles], {
				duration: config.durations.expand,
				easing: config.easing.decelerate,
				fill: 'forwards',
			})
		} else {
			animations.container = container.animate([fromStyles, toStyles], {
				duration: toState === 'hidden' ? config.durations.hide : config.durations.minimize,
				easing: config.easing.accelerate,
				fill: 'forwards',
			})
		}

		// Content animation (only for expand/minimize transitions)
		if (content && fromState === 'expanded' && toState === 'minimized') {
			// Fade out content before minimizing
			content.animate(
				[
					{ opacity: 1, transform: 'translateY(0)' },
					{ opacity: 0, transform: 'translateY(-8px)' },
				],
				{
					duration: 150,
					easing: config.easing.standard,
					fill: 'forwards',
				},
			)
		} else if (content && toState === 'expanded') {
			// Fade in content when expanding
			content.animate(
				[
					{ opacity: 0, transform: 'translateY(8px)' },
					{ opacity: 1, transform: 'translateY(0)' },
				],
				{
					duration: config.durations.content,
					easing: config.easing.standard,
					fill: 'forwards',
				},
			)
		}

		// Icon rotation animation
		if (icon) {
			const isExpanding = toState === 'expanded'
			const isCollapsing = fromState === 'expanded' && toState === 'minimized'

			if (isExpanding || isCollapsing) {
				icon.animate(
					[
						{ transform: isExpanding ? 'rotate(0deg)' : 'rotate(180deg)' },
						{ transform: isExpanding ? 'rotate(180deg)' : 'rotate(0deg)' },
					],
					{
						duration: 250,
						easing: config.easing.emphasized,
						fill: 'forwards',
					},
				)
			}
		}

		return animations
	}

	// Get styles for a specific state
	private getStyleForState(state: BoatState): Keyframe {
		const { shadows } = this.ANIMATION_CONFIG
		const baseStyles = {
			maxWidth: '300px',
			maxHeight: 'auto',
			borderRadius: '16px',
		}

		const stateStyles: Record<BoatState, Keyframe> = {
			hidden: {
				...baseStyles,
				opacity: '0',
				pointerEvents: 'none',
				boxShadow: 'none',
				backdropFilter: 'none',
			},
			minimized: {
				...baseStyles,
				opacity: '1',
				pointerEvents: 'auto',
				boxShadow: this.isLowered ? shadows.fabLowered : shadows.fab,
				backdropFilter: 'none',
			},
			expanded: {
				opacity: '1',
				pointerEvents: 'auto',
				width: this.getResponsiveWidth(),
				maxWidth: '100%',
				maxHeight: '80vh',
				boxShadow: shadows.expanded,
				borderRadius: '8px 8px 0 0',
				backdropFilter: 'blur(12px)',
			},
		}

		return stateStyles[state] as Keyframe
	}

	// Calculate responsive width based on viewport
	private getResponsiveWidth(): string {
		if (typeof window === 'undefined') return '40vw'

		const vw = window.innerWidth
		if (vw < 768) return 'calc(100vw - 32px)'
		if (vw < 1024) return '70vw'
		if (vw < 1280) return '60vw'
		return '40vw'
	}

	// Update expanded width on window resize
	private updateExpandedWidth() {
		const container = this.containerRef.value
		if (container && this.currentState === 'expanded') {
			container.style.width = this.getResponsiveWidth()
		}
	}

	firstUpdated() {
		this.initializePosition()
		this.applyInitialStyles()
		this.updateContainerPosition()
		this.setupDragPipeline()

		// Check for deprecated header slot usage
		const hasHeaderSlot = this.querySelector('[slot="header"]')
		if (hasHeaderSlot && !this.icon && !this.label) {
			console.warn(
				'[schmancy-boat] Using slot="header" is deprecated. ' +
					'Please use the icon, label, and badge properties instead. ' +
					'Example: <schmancy-boat icon="info" label="Title" badge="5">',
			)
		}
	}

	// Apply initial styles to elements
	private applyInitialStyles() {
		const container = this.containerRef.value
		const content = this.contentRef.value
		const icon = this.iconRef.value

		if (container) {
			const initialStyle = this.getStyleForState(this.currentState)
			Object.assign(container.style, initialStyle)

			// Safari compatibility for backdrop filter
			if ('webkitBackdropFilter' in container.style) {
				;(container.style as any).webkitBackdropFilter = initialStyle.backdropFilter
			}
		}

		// Set initial content opacity
		if (content) {
			content.style.opacity = this.isContentVisible ? '1' : '0'
		}

		// Set initial icon rotation
		if (icon && this.currentState === 'expanded') {
			icon.style.transform = 'rotate(180deg)'
		}
	}


	// Public method to toggle between minimized and expanded
	toggleState() {
		const newState = this.currentState === 'minimized' ? 'expanded' : 'minimized'
		this.animateToState(newState)
	}

	// Public method to close (hide) the boat
	close() {
		this.animateToState('hidden')
	}

	private closeAndAddToNav() {
		race(
			this.discover<any>('schmancy-navigation-rail'),
			this.discover<any>('schmancy-navigation-bar'),
			this.discover<any>('schmancy-nav-drawer'),
			this.discover<any>('app-navigation-rail'),
			this.discover<any>('app-navigation-bar'),
			this.discover<any>('app-nav-drawer'),
		)
			.pipe(
				take(1),
				tap(navComponent => {
					if (navComponent && typeof navComponent.addBoatItem === 'function') {
						// Use properties first, fall back to slot parsing
						const icon =
							this.icon ||
							(() => {
								const headerSlot = this.querySelector('[slot="header"]')
								const iconElement = headerSlot?.querySelector('schmancy-icon')
								return iconElement?.textContent?.trim() || 'widgets'
							})()

						const label =
							this.label ||
							(() => {
								const headerSlot = this.querySelector('[slot="header"]')
								let title = headerSlot?.textContent?.trim() || 'Boat'
								if (icon && title.includes(icon)) {
									title = title.replace(icon, '').trim()
								}
								return title || this.id
							})()

						// Add the boat to navigation
						const navItem = navComponent.addBoatItem({
							id: `boat-${this.id}`,
							title: label,
							icon: icon,
						})

						if (navItem) {
							// Simple fade out then hide
							const container = this.containerRef.value
							if (container) {
								container
									.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, easing: 'ease-out', fill: 'forwards' })
									.finished.then(() => {
										this.currentState = 'hidden'
										this.isContentVisible = false
									})
							} else {
								this.currentState = 'hidden'
								this.isContentVisible = false
							}

							// Set up click listener to reopen - using RxJS pattern
							fromEvent(navItem, 'click')
								.pipe(
									tap(() => this.state = 'expanded'),
									takeUntil(this.disconnecting)
								)
								.subscribe()
						}
					} else {
						// No nav component found, just hide
						this.close()
					}
				}),
			)
			.subscribe()
	}


	private calculateDragPosition(
		clientX: number,
		clientY: number,
		offsetX: number,
		offsetY: number,
		initialRect: DOMRect,
	): Position {
		const targetLeft = clientX - offsetX
		const targetTop = clientY - offsetY
		const vw = window.innerWidth
		const vh = window.innerHeight
		const clampedLeft = Math.max(0, Math.min(targetLeft, vw - initialRect.width))
		const clampedTop = Math.max(0, Math.min(targetTop, vh - initialRect.height))

		const newX = this.anchor.includes('right') ? vw - (clampedLeft + initialRect.width) : clampedLeft

		const newY = this.anchor.includes('bottom') ? vh - (clampedTop + initialRect.height) : clampedTop

		return { x: Math.max(0, newX), y: Math.max(0, newY) }
	}

	private savePosition() {
		if (typeof window === 'undefined') return

		const toSave: SavedPosition = {
			x: this.position.x,
			y: this.position.y,
			anchor: this.anchor,
		}
		const key = `schmancy-boat-${this.id}`
		localStorage.setItem(key, JSON.stringify(toSave))
		console.log('💾 Saved position:', key, toSave)
	}

	private setupDragPipeline() {
		if (typeof window === 'undefined') return

		const header = this.headerRef.value
		const container = this.containerRef.value
		if (!header || !container) return

		let hasDragged = false
		const DRAG_THRESHOLD = 5

		// Merge mouse and touch start events
		merge(
			fromEvent<MouseEvent>(header, 'mousedown').pipe(
				filter(e => e.button === 0),
				tap(e => {
					e.preventDefault()
					e.stopPropagation()
				}),
				map(e => ({
					clientX: e.clientX,
					clientY: e.clientY,
					type: 'mouse' as const,
				})),
			),
			fromEvent<TouchEvent>(header, 'touchstart').pipe(
				map(e => ({
					clientX: e.touches[0].clientX,
					clientY: e.touches[0].clientY,
					type: 'touch' as const,
				})),
			),
		)
			.pipe(
				map(({ clientX, clientY, type }) => {
					const rect = container.getBoundingClientRect()
					hasDragged = false
					return {
						startX: clientX,
						startY: clientY,
						offsetX: clientX - rect.left,
						offsetY: clientY - rect.top,
						initialRect: rect,
						type,
					}
				}),
			)
			.pipe(
				switchMap(({ startX, startY, offsetX, offsetY, initialRect, type }) => {
					const move$ =
						type === 'mouse'
							? fromEvent<MouseEvent>(window, 'mousemove').pipe(map(e => ({ clientX: e.clientX, clientY: e.clientY })))
							: fromEvent<TouchEvent>(window, 'touchmove').pipe(
									map(e => ({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })),
								)

					const end$ = type === 'mouse' ? fromEvent(window, 'mouseup') : fromEvent(window, 'touchend')

					return move$.pipe(
						map(({ clientX, clientY }) => {
							const deltaX = clientX - startX
							const deltaY = clientY - startY
							const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

							if (distance > DRAG_THRESHOLD && !hasDragged) {
								hasDragged = true
								this.isDragging = true
							}

							if (!hasDragged) return null

							return this.calculateDragPosition(clientX, clientY, offsetX, offsetY, initialRect)
						}),
						filter(position => position !== null),
						tap(position => {
							if (position) {
								this.position = position
								this.updateContainerPosition()
							}
						}),
						takeUntil(end$),
					)
				}),
				finalize(() => {
					if (hasDragged) {
						this.updateAnchor()
						this.savePosition()
					} else {
						this.toggleState()
					}
					this.isDragging = false
					hasDragged = false
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	// Update container position based on anchor and position values
	private updateContainerPosition() {
		const container = this.containerRef.value
		if (!container) return

		// Reset all position styles
		container.style.removeProperty('left')
		container.style.removeProperty('right')
		container.style.removeProperty('top')
		container.style.removeProperty('bottom')

		// Apply new position based on anchor
		if (this.anchor.includes('right')) {
			container.style.right = `${this.position.x}px`
		} else {
			container.style.left = `${this.position.x}px`
		}

		if (this.anchor.includes('bottom')) {
			container.style.bottom = `${this.position.y}px`
		} else {
			container.style.top = `${this.position.y}px`
		}
	}

	// Update anchor based on current position
	private updateAnchor() {
		if (typeof window === 'undefined') return

		const container = this.containerRef.value
		if (!container) return

		const rect = container.getBoundingClientRect()
		const vw = window.innerWidth
		const vh = window.innerHeight

		const isRight = rect.left > vw / 2
		const isBottom = rect.top > vh / 2

		const newAnchor = `${isBottom ? 'bottom' : 'top'}-${isRight ? 'right' : 'left'}` as typeof this.anchor

		if (newAnchor !== this.anchor) {
			// Calculate new position values for the new anchor
			if (isRight) {
				this.position.x = vw - rect.right
			} else {
				this.position.x = rect.left
			}

			if (isBottom) {
				this.position.y = vh - rect.bottom
			} else {
				this.position.y = rect.top
			}

			this.anchor = newAnchor
		}
	}

	// Cleanup on component disconnect
	disconnectedCallback() {
		super.disconnectedCallback()
		this.currentAnimation?.cancel()
	}

	protected render(): unknown {
		const surfaceElevation = this.currentState === 'minimized' ? (this.isLowered ? '1' : '3') : '4'
		const isMinimized = this.currentState === 'minimized'

		// Set transform origin based on anchor for proper expansion
		const transformOrigin = this.anchor.includes('bottom')
			? (this.anchor.includes('right') ? 'bottom right' : 'bottom left')
			: (this.anchor.includes('right') ? 'top right' : 'top left')

		const containerClasses = {
			'z-50':true,
			fixed: true,
			'overflow-y-auto': true,
			flex: true,
			'flex-col': true,
			'select-none': true,
			'will-change-transform': true,
			'[contain:layout_style]': true,
			'[transform:translate3d(0,0,0)]': true,
			'[backface-visibility:hidden]': true,
			'transition-shadow': true,
			'opacity-95': this.isDragging,
			'shadow-[0_24px_48px_-8px_rgba(0,0,0,0.2),0_12px_24px_-4px_rgba(0,0,0,0.12)]': this.isDragging,
		}

		return html`
			<div
				class=${this.classMap(containerClasses)}
				style="transform-origin: ${transformOrigin}"
				${ref(this.containerRef)}
			>
				<!-- Header section -->
				<section class="sticky top-0">
					<schmancy-surface
						elevation="${surfaceElevation}"
						rounded="${isMinimized ? 'none' : 'top'}"
						type="containerLowest"
					>
						<div
							class="group sticky top-0 px-3 py-2 flex items-center justify-between gap-3 ${this.isDragging
								? 'cursor-grabbing'
								: 'cursor-move'}"
							${ref(this.headerRef)}
							title="Drag to move, double-click to toggle"
							@dblclick=${(e: Event) => {
								e.preventDefault()
								e.stopPropagation()
								this.toggleState()
							}}
						>
							<!-- Drag handle indicator -->
							<div
								class="flex items-center text-surface-onVariant opacity-40 transition-opacity duration-200 group-hover:opacity-100"
							>
								<schmancy-icon style="font-size: 20px">drag_indicator</schmancy-icon>
							</div>

							<!-- Header content - use properties if provided, else fallback to slot -->
							<div class="flex-1 min-w-fit items-center flex justify-start">
								${this.icon || this.label
									? html`
											<div class="flex gap-2 items-center">
												${this.icon ? html`<schmancy-icon>${this.icon}</schmancy-icon>` : ''}
												${this.label
													? html`<schmancy-typography type="title" token="md">${this.label}</schmancy-typography>`
													: ''}
												${this.badge !== undefined && this.badge !== null && this.badge !== ''
													? html`<schmancy-badge>${this.badge}</schmancy-badge>`
													: ''}
											</div>
										`
									: html`<slot name="header"></slot>`}
							</div>

							<!-- Control buttons -->
							<div class="flex items-center gap-1 flex-shrink-0">
								${isMinimized
									? html`
											<!-- Expand button (when minimized) -->
											<schmancy-icon-button
												variant="text"
												@click=${(e: Event) => {
													e.stopPropagation()
													this.state = 'expanded'
												}}
												title="Expand"
											>
												<schmancy-icon ${ref(this.iconRef)}>expand_less</schmancy-icon>
											</schmancy-icon-button>
										`
									: html`
											<!-- Minimize button (when expanded) -->
											<schmancy-icon-button
												variant="filled tonal"
												@click=${(e: Event) => {
													e.stopPropagation()
													this.state = 'minimized'
												}}
												title="Minimize"
											>
												<schmancy-icon ${ref(this.iconRef)}>expand_more</schmancy-icon>
											</schmancy-icon-button>
										`}

								<!-- Close button -->
								<schmancy-icon-button
									variant="text"
									@click=${(e: Event) => {
										e.stopPropagation()
										this.closeAndAddToNav()
									}}
									title="Close and add to navigation"
								>
									<schmancy-icon>close</schmancy-icon>
								</schmancy-icon-button>
							</div>
						</div>
					</schmancy-surface>
				</section>

				<!-- Content section -->
				<schmancy-surface .hidden=${!this.isContentVisible} type="containerLow" class="flex-1" ${ref(this.contentRef)}>
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

import { TailwindElement } from '@mixins/tailwind.mixin'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'
import { Subject, fromEvent, merge, of, EMPTY } from 'rxjs'
import {
	filter,
	switchMap,
	takeUntil,
	tap,
	finalize,
	catchError,
	debounceTime,
	scan,
	shareReplay,
	map,
} from 'rxjs/operators'

type BoatState = 'hidden' | 'minimized' | 'expanded'

// State change event for the unified pipeline
interface StateChangeEvent {
	source: 'internal' | 'external' | 'resize'
	target?: BoatState
	type: 'state' | 'lowered' | 'resize'
}

// Position interface for drag functionality
interface Position {
	x: number
	y: number
}

// Saved position from localStorage
interface SavedPosition {
	x: number
	y: number
	anchor: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

@customElement('schmancy-boat')
export default class SchmancyBoat extends TailwindElement(css`
	/* Performance optimization - GPU hints only */
	.boat-container {
		will-change: transform, border-radius, width, max-width, box-shadow;
		contain: layout style;
		transform: translate3d(0, 0, 0); /* Force GPU acceleration */
		backface-visibility: hidden;
		user-select: none; /* Prevent text selection during drag */
	}

	/* Dragging state styles */
	.boat-container.dragging {
		box-shadow: 0 24px 48px -8px rgba(0, 0, 0, 0.2), 0 12px 24px -4px rgba(0, 0, 0, 0.12);
	}

	/* Drag handle hover effect */
	.drag-handle {
		transition: opacity 0.2s ease;
	}

	.boat-header:hover .drag-handle {
		opacity: 1 !important;
	}
`) {
	// Public properties - route ALL changes through stateChange$
	@property({ type: String, reflect: true })
	get state(): BoatState {
		return this.currentState
	}
	set state(value: BoatState) {
		// Route external state changes through the unified pipeline
		this.stateChange$.next({
			source: 'external',
			target: value,
			type: 'state',
		})
	}

	@property({ type: Boolean, reflect: true })
	get lowered(): boolean {
		return this.isLowered
	}
	set lowered(value: boolean) {
		this.stateChange$.next({
			source: 'external',
			target: this.currentState,
			type: 'lowered',
		})
		this.isLowered = value
	}

	// Single unified state change stream - ALL state changes go through this
	private stateChange$ = new Subject<StateChangeEvent>()

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
		this.loadSavedPosition()
		this.setupUnifiedPipeline()
		this.setupDragPipeline()
	}

	private setupUnifiedPipeline() {
		// Create resize stream
		const resize$ =
			typeof window !== 'undefined'
				? fromEvent(window, 'resize').pipe(
						debounceTime(100),
						filter(() => this.currentState === 'expanded'),
						tap(() =>
							this.stateChange$.next({
								source: 'resize',
								type: 'resize',
							}),
						),
					)
				: EMPTY

		// SINGLE UNIFIED PIPELINE - All state management in ONE place
		merge(
			// Initial state
			of({
				source: 'internal' as const,
				target: 'minimized' as BoatState,
				type: 'state' as const,
			}),
			// All state changes
			this.stateChange$,
			// Window resize events
			resize$,
		)
			.pipe(
				// Accumulate state and handle all changes
				scan(
					(state, event: StateChangeEvent) => {
						// Handle different event types
						if (event.type === 'resize' && this.currentState === 'expanded') {
							// Just update width, no animation needed
							this.updateExpandedWidth()
							return { ...state, resized: true }
						}

						if (event.type === 'lowered') {
							// Update lowered state
							return { ...state, lowered: !state.lowered }
						}

						// Handle state changes
						if (event.type === 'state' && event.target && event.target !== state.current) {
							return {
								...state,
								previous: state.current,
								current: event.target,
								pending: true,
								source: event.source,
							}
						}

						return state
					},
					{
						current: 'minimized' as BoatState,
						previous: 'minimized' as BoatState,
						pending: false,
						lowered: false,
						resized: false,
						source: 'internal' as 'internal' | 'external' | 'resize',
					},
				),

				// Only process when there's a pending state change
				tap(state => {
					// Always update lowered state
					this.isLowered = state.lowered
				}),

				// Handle animations for state transitions
				switchMap(state => {
					if (!state.pending || this.isAnimating) {
						return of(state)
					}

					// Mark as animating
					this.isAnimating = true

					// Animate the transition
					return this.animateTransition(state.previous, state.current).pipe(
						tap(() => {
							// Update state after animation completes
							this.currentState = state.current
							this.isContentVisible = state.current === 'expanded'

							// Dispatch event
							this.dispatchEvent(
								new CustomEvent('toggle', {
									detail: state.current,
									bubbles: true,
									composed: true,
								}),
							)
						}),
						catchError(err => {
							console.warn('Animation error:', err)
							// Still update state even if animation fails
							this.currentState = state.current
							this.isContentVisible = state.current === 'expanded'
							return of(state)
						}),
						finalize(() => {
							this.isAnimating = false
						}),
						// Return the state for next iteration
						tap(() => (state.pending = false)),
					)
				}),

				// Share the pipeline result
				shareReplay(1),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	// Simplified animation transition method
	private animateTransition(fromState: BoatState, toState: BoatState) {
		return of({ fromState, toState }).pipe(
			tap(() => this.currentAnimation?.cancel()),
			switchMap(({ fromState, toState }) => {
				const container = this.containerRef.value
				if (!container) return EMPTY

				// Update content visibility before expand, after minimize
				if (toState === 'expanded') {
					this.isContentVisible = true
				}

				// Create animation based on target state
				const animations = this.createAnimations(fromState, toState)

				// Execute animations and return completion promise
				return new Promise<void>(resolve => {
					const mainAnimation = animations.container
					if (mainAnimation) {
						this.currentAnimation = mainAnimation
						mainAnimation.finished
							.then(() => {
								if (toState !== 'expanded') {
									this.isContentVisible = false
								}
								resolve()
							})
							.catch(() => resolve())
					} else {
						resolve()
					}
				})
			}),
		)
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
			width: '300px',
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

	// Initialize component styles after first render
	firstUpdated() {
		// Apply initial styles
		this.applyInitialStyles()
		// Apply saved position
		this.updateContainerPosition()
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
		this.stateChange$.next({
			source: 'internal',
			target: newState,
			type: 'state',
		})
	}

	// Public method to close (hide) the boat
	close() {
		this.stateChange$.next({
			source: 'internal',
			target: 'hidden',
			type: 'state',
		})
	}

	// Load saved position from localStorage
	private loadSavedPosition() {
		if (typeof window === 'undefined') return

		const saved = localStorage.getItem('schmancy-boat-position')
		if (saved) {
			try {
				const parsed: SavedPosition = JSON.parse(saved)
				this.position = { x: parsed.x, y: parsed.y }
				this.anchor = parsed.anchor
			} catch (e) {
				// Use default position if parse fails
			}
		}
	}

	// Save position to localStorage
	private savePosition() {
		if (typeof window === 'undefined') return

		const toSave: SavedPosition = {
			x: this.position.x,
			y: this.position.y,
			anchor: this.anchor,
		}
		localStorage.setItem('schmancy-boat-position', JSON.stringify(toSave))
	}

	// Setup drag pipeline for the header
	private setupDragPipeline() {
		if (typeof window === 'undefined') return

		// Wait for header element to be available
		setTimeout(() => {
			const header = this.headerRef.value
			const container = this.containerRef.value
			if (!header || !container) return

			// Track whether we should process click events
			let hasDragged = false
			const DRAG_THRESHOLD = 5 // pixels

			const dragStart$ = fromEvent<MouseEvent>(header, 'mousedown').pipe(
				filter((e: MouseEvent) => e.button === 0), // Left mouse button only
				tap((e: MouseEvent) => {
					e.preventDefault()
					e.stopPropagation()
					// Don't set isDragging yet - wait to see if user actually drags
					hasDragged = false
				}),
				map((e: MouseEvent) => {
					// Get the current position of the boat in viewport coordinates
					const rect = container.getBoundingClientRect()

					// Calculate the offset from where the user clicked to the boat's position
					// This offset will be maintained throughout the drag
					const offsetX = e.clientX - rect.left
					const offsetY = e.clientY - rect.top

					return {
						startMouseX: e.clientX,
						startMouseY: e.clientY,
						offsetX,
						offsetY,
						initialRect: rect,
					}
				}),
			)

			const dragMove$ = fromEvent<MouseEvent>(window, 'mousemove')
			const dragEnd$ = fromEvent<MouseEvent>(window, 'mouseup')

			dragStart$
				.pipe(
					switchMap(({ startMouseX, startMouseY, offsetX, offsetY, initialRect }) =>
						dragMove$.pipe(
							// Remove throttling for smoother movement
							map((moveEvent: MouseEvent) => {
								const deltaX = moveEvent.clientX - startMouseX
								const deltaY = moveEvent.clientY - startMouseY

								// Check if we've moved beyond the threshold
								const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
								if (distance > DRAG_THRESHOLD && !hasDragged) {
									hasDragged = true
									this.isDragging = true
								}

								// Only update position if actually dragging
								if (!hasDragged) {
									return null
								}

								// Calculate where the boat should be positioned
								// The boat should follow the cursor while maintaining the initial offset
								const targetLeft = moveEvent.clientX - offsetX
								const targetTop = moveEvent.clientY - offsetY

								// Get viewport dimensions
								const vw = window.innerWidth
								const vh = window.innerHeight

								// Clamp to viewport bounds
								const clampedLeft = Math.max(0, Math.min(targetLeft, vw - initialRect.width))
								const clampedTop = Math.max(0, Math.min(targetTop, vh - initialRect.height))

								// Convert to position values based on current anchor
								let newX: number
								let newY: number

								if (this.anchor.includes('right')) {
									// Distance from right edge
									newX = vw - (clampedLeft + initialRect.width)
								} else {
									// Distance from left edge
									newX = clampedLeft
								}

								if (this.anchor.includes('bottom')) {
									// Distance from bottom edge
									newY = vh - (clampedTop + initialRect.height)
								} else {
									// Distance from top edge
									newY = clampedTop
								}

								return { x: Math.max(0, newX), y: Math.max(0, newY) }
							}),
							filter(position => position !== null),
							tap(position => {
								if (hasDragged && position) {
									this.position = position
									this.updateContainerPosition()
									// Check if we need to update anchor
									this.updateAnchor()
								}
							}),
							takeUntil(dragEnd$),
						),
					),
					finalize(() => {
						// If we didn't drag, trigger the click
						if (!hasDragged) {
							this.toggleState()
						} else {
							// Save position only if we actually dragged
							this.savePosition()
						}
						this.isDragging = false
						hasDragged = false
					}),
					takeUntil(this.disconnecting),
				)
				.subscribe()
		}, 100)
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
		this.stateChange$.complete()
	}

	// Render the component
	protected render(): unknown {
		// Calculate dynamic values
		const surfaceElevation = this.currentState === 'minimized' ? (this.isLowered ? '1' : '3') : '4'
		const isMinimized = this.currentState === 'minimized'
		const iconName = isMinimized ? 'expand_less' : 'expand_more'

		// Dynamic styles for dragging state
		const containerClass = `boat-container z-[9999] fixed overflow-y-auto flex flex-col transition-shadow ${
			this.isDragging ? 'dragging opacity-95' : ''
		}`

		return html`
			<div class="${containerClass}" ${ref(this.containerRef)}>
				<!-- Header section -->
				<section class="sticky top-0 z-10">
					<schmancy-surface
						elevation="${surfaceElevation}"
						rounded="${isMinimized ? 'none' : 'top'}"
						type="containerLowest"
					>
						<div
							class="boat-header sticky top-0 px-3 py-2 flex items-center justify-between gap-3 ${this.isDragging ? 'cursor-grabbing' : 'cursor-move'}"
							${ref(this.headerRef)}
							title="Drag to move, click to expand/collapse"
						>
							<!-- Drag handle indicator -->
							<div class="drag-handle flex items-center text-surface-onVariant opacity-40">
								<schmancy-icon style="font-size: 20px">drag_indicator</schmancy-icon>
							</div>

							<!-- Header content slot -->
							<div class="flex-1 min-w-fit items-center justify-start">
								<slot name="header"></slot>
							</div>

							<!-- Control buttons -->
							<div class="flex items-center gap-1 flex-shrink-0">
								<!-- Toggle button -->
								<schmancy-icon-button
									variant="${isMinimized ? 'text' : 'filled tonal'}"
									@click=${(e: Event) => {
										e.stopPropagation()
										this.toggleState()
									}}
									title=${isMinimized ? 'Expand' : 'Minimize'}
								>
									<span class="icon-container" ${ref(this.iconRef)}> ${iconName} </span>
								</schmancy-icon-button>

								<!-- Close button -->
								<schmancy-icon-button
									variant="text"
									@click=${(e: Event) => {
										e.stopPropagation()
										this.close()
									}}
									title="Close"
								>
									close
								</schmancy-icon-button>
							</div>
						</div>
					</schmancy-surface>
				</section>

				<!-- Content section -->
				<schmancy-surface
					.hidden=${!this.isContentVisible}
					type="containerLow"
					class="boat-content z-0 flex-1"
					${ref(this.contentRef)}
				>
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

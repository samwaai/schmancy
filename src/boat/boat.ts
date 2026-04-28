import { $LitElement } from '@mixins/index'
import { css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { when } from 'lit/directives/when.js'
import { filter, finalize, fromEvent, map, merge, switchMap, takeUntil, tap } from 'rxjs'
import { SPRING_SMOOTH, SPRING_SNAPPY } from '../utils/animation.js'
import { reducedMotion$ } from '../directives/reduced-motion'
import { theme } from '../theme/theme.service.js'

const FAB_HEIGHT = 44
const DRAG_THRESHOLD = 5
const POSITION_STORAGE_KEY_PREFIX = 'schmancy-boat-'

type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
type BoatState = 'collapsed' | 'expanded'
interface Position {
	x: number
	y: number
}

@customElement('schmancy-boat')
export default class SchmancyBoat extends $LitElement(css`
	:host {
		display: contents;
		position: relative;
		z-index: 1000;
	}
	:host([hidden]) {
		display: none !important;
	}
`) {
	@property({ type: String }) id: string = 'default'
	@property({ type: String }) icon?: string
	@property({ type: String }) label?: string
	/** Override the expanded panel width (e.g. '320px', '24rem'). Defaults to responsive sizing. */
	@property({ type: String }) expandedWidth?: string
	/** When true, uses a lower elevation shadow in the minimized (FAB) state. */
	@property({ type: Boolean, reflect: true }) lowered: boolean = false
	/** Corner the boat is anchored to. */
	@property({ type: String }) corner: Corner = 'bottom-right'
	/** Whether the panel is open. */
	@property({ type: Boolean, reflect: true }) open: boolean = false

	/**
	 * State property.
	 * Maps 'expanded' → open=true, 'collapsed' → open=false (FAB visible).
	 */
	get state(): BoatState {
		return this.open ? 'expanded' : 'collapsed'
	}
	set state(val: BoatState) {
		if (val === 'expanded') {
			this.expand()
		} else {
			// collapsed
			this.close()
		}
	}

	// Internal drag state (triggers re-render for cursor class)
	@state() private isDragging = false

	// Internal position — plain fields, updated directly during drag (no re-render needed)
	private _position: Position = { x: 16, y: 16 }
	@state() private _currentCorner: Corner = 'bottom-right'

	// Refs
	private _containerRef = createRef<HTMLElement>()
	private _contentRef = createRef<HTMLElement>()
	private _headerRef = createRef<HTMLElement>()
	private _currentAnimation?: Animation

	// ============================================
	// COMPUTED
	// ============================================

	private get panelWidth(): string {
		return this.expandedWidth ?? 'min(360px, calc(100vw - 32px))'
	}

	private get isBottomCorner(): boolean {
		return this._currentCorner.startsWith('bottom')
	}

	private get closedClipPath(): string {
		return this.isBottomCorner
			? `inset(calc(100% - ${FAB_HEIGHT}px) 0px 0px 0px round 22px)`
			: `inset(0px 0px calc(100% - ${FAB_HEIGHT}px) 0px round 22px)`
	}

	private get openClipPath(): string {
		return 'inset(0px 0px 0px 0px round 12px)'
	}

	private get elevation(): 0 | 1 | 2 | 3 | 4 | 5 {
		if (this.open) return 4
		return this.lowered ? 1 : 3
	}

	// ============================================
	// POSITION MANAGEMENT
	// ============================================

	private _applyContainerPosition() {
		const container = this._containerRef.value
		if (!container) return
		container.style.removeProperty('left')
		container.style.removeProperty('right')
		container.style.removeProperty('top')
		container.style.removeProperty('bottom')
		const { x, y } = this._position
		if (this._currentCorner.includes('right')) {
			container.style.right = `${x}px`
		} else {
			container.style.left = `${x}px`
		}
		if (this._currentCorner.includes('bottom')) {
			container.style.bottom = `${y + theme.bottomOffset}px`
		} else {
			container.style.top = `${y}px`
		}
	}

	private _loadPosition() {
		try {
			const saved = localStorage.getItem(POSITION_STORAGE_KEY_PREFIX + this.id)
			if (saved) {
				const parsed = JSON.parse(saved) as { x: number; y: number; anchor: Corner }
				this._position = { x: parsed.x, y: parsed.y }
				this._currentCorner = parsed.anchor
			}
		} catch {
			// ignore localStorage errors
		}
	}

	private _savePosition() {
		try {
			localStorage.setItem(
				POSITION_STORAGE_KEY_PREFIX + this.id,
				JSON.stringify({ ...this._position, anchor: this._currentCorner }),
			)
		} catch {
			// ignore localStorage errors
		}
	}

	private _validateBounds() {
		const container = this._containerRef.value
		if (!container) return
		const rect = container.getBoundingClientRect()
		if (rect.width === 0) return
		const vw = window.innerWidth
		const vh = window.innerHeight
		const isRight = this._currentCorner.includes('right')
		const isBottom = this._currentCorner.includes('bottom')
		const actualLeft = isRight ? vw - this._position.x - rect.width : this._position.x
		const actualTop = isBottom ? vh - this._position.y - rect.height : this._position.y
		const newLeft = Math.max(0, Math.min(actualLeft, vw - rect.width))
		const newTop = Math.max(0, Math.min(actualTop, vh - rect.height))
		this._position = {
			x: isRight ? vw - newLeft - rect.width : newLeft,
			y: isBottom ? vh - newTop - rect.height : newTop,
		}
		this._applyContainerPosition()
	}


	// ============================================
	// CORNER SNAPPING
	// ============================================

	private _reorientToNearestCorner(skipAnimation = false): void {
		const container = this._containerRef.value
		if (!container) return

		// F — record current screen position before DOM mutation
		const rect = container.getBoundingClientRect()

		// L — calculate nearest corner using FAB visual center (container is always collapsed during drag)
		const currentIsBottom = this._currentCorner.includes('bottom')
		const fabCenterX = rect.left + rect.width / 2
		const fabCenterY = currentIsBottom
			? rect.bottom - FAB_HEIGHT / 2
			: rect.top + FAB_HEIGHT / 2
		const side = fabCenterX > window.innerWidth / 2 ? 'right' : 'left'
		const vert = fabCenterY > window.innerHeight / 2 ? 'bottom' : 'top'
		const newCorner: Corner = `${vert}-${side}` as Corner

		// Snap corner and reset offset to standard edge gap
		this._currentCorner = newCorner
		this._position = { x: 16, y: 16 }
		this._applyContainerPosition()
		// Sync clip-path to new corner — managed imperatively, not via styleMap
		if (!this.open) {
			container.style.clipPath = this.closedClipPath
		}

		if (skipAnimation || reducedMotion$.value) {
			this._savePosition()
			return
		}

		// I — invert: shift element back to its original visual position
		const newRect = container.getBoundingClientRect()
		const dx = rect.left - newRect.left
		const dy = rect.top - newRect.top
		container.style.transform = `translate(${dx}px, ${dy}px)`

		// P — play: animate from the inverse offset to natural resting position
		this._currentAnimation?.cancel()
		const anim = container.animate(
			[{ transform: container.style.transform }, { transform: 'translate(0,0)' }],
			{
				duration: SPRING_SMOOTH.duration,
				easing: SPRING_SMOOTH.easingFallback,
				fill: 'forwards',
			},
		)
		this._currentAnimation = anim
		anim.finished.then(() => {
			if (container.isConnected) {
				container.style.transform = ''
			}
			return
		})

		this._savePosition()
	}

	// ============================================
	// DRAG PIPELINE
	// ============================================

	private _setupDrag() {
		const header = this._headerRef.value
		const container = this._containerRef.value
		if (!header || !container) return

		let didDrag = false

		fromEvent<PointerEvent>(header, 'pointerdown')
			.pipe(
				filter(e => e.button === 0),
				tap(e => {
					e.preventDefault()
					e.stopPropagation()
					header.setPointerCapture(e.pointerId)
				}),
				map(e => {
					const rect = container.getBoundingClientRect()
					const isBottom = this._currentCorner.includes('bottom')
					const wasOpen = this.open
					didDrag = false
					return {
						pointerId: e.pointerId,
						startX: e.clientX,
						startY: e.clientY,
						offsetX: e.clientX - rect.left,
						offsetY: e.clientY - rect.top,
						rect,
						isBottom,
						wasOpen,
					}
				}),
				switchMap(({ pointerId, startX, startY, offsetX, offsetY, rect, isBottom, wasOpen }) => {
					const sameId = (e: PointerEvent) => e.pointerId === pointerId
					const move$ = fromEvent<PointerEvent>(window, 'pointermove').pipe(filter(sameId))
					const end$ = merge(
						fromEvent<PointerEvent>(window, 'pointerup'),
						fromEvent<PointerEvent>(window, 'pointercancel'),
					).pipe(filter(sameId))

					return move$.pipe(
						tap(({ clientX, clientY }) => {
							const dx = clientX - startX
							const dy = clientY - startY
							if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD && !didDrag) {
								didDrag = true
								this.isDragging = true
								// Collapse on first confirmed drag move (not on click)
								if (wasOpen) {
									this._currentAnimation?.cancel()
									this.open = false
									container.style.clipPath = this.closedClipPath
									container.style.overflow = 'hidden'
									const content = this._contentRef.value
									if (content) {
										content.inert = true
										content.style.visibility = 'hidden'
									}
								}
							}
							if (!didDrag) return

							const vw = window.innerWidth
							const vh = window.innerHeight
							const left = Math.max(0, Math.min(clientX - offsetX, vw - rect.width))
							// Allow container to go partially off-screen so FAB stays reachable at all edges
							const minTop = isBottom ? FAB_HEIGHT - rect.height : 0
							const maxTop = isBottom ? vh - rect.height : vh - FAB_HEIGHT
							const top = Math.max(minTop, Math.min(clientY - offsetY, maxTop))

							this._position = {
								x: this._currentCorner.includes('right') ? vw - left - rect.width : left,
								y: isBottom ? vh - top - rect.height : top,
							}
							this._applyContainerPosition()
						}),
						takeUntil(end$),
						finalize(() => {
							if (didDrag) {
								this._reorientToNearestCorner()
								this.isDragging = false
								didDrag = false
							} else {
								this.isDragging = false
								didDrag = false
								this.toggle()
							}
						}),
					)
				}),
				takeUntil(this.disconnecting),
			)
			.subscribe()
	}

	// ============================================
	// LIFECYCLE
	// ============================================

	connectedCallback() {
		super.connectedCallback()

		fromEvent(window, 'resize')
			.pipe(takeUntil(this.disconnecting))
			.subscribe(() => this._validateBounds())

		theme.bottomOffset$.pipe(
			tap(() => this._applyContainerPosition()),
			takeUntil(this.disconnecting),
		).subscribe()
	}

	firstUpdated() {
		// Initialize corner from property
		this._currentCorner = this.corner

		// Load saved drag position from localStorage
		this._loadPosition()

		const container = this._containerRef.value
		const content = this._contentRef.value
		if (!container) return

		// Apply initial position
		this._applyContainerPosition()

		// Set initial open/closed visual state
		if (this.open) {
			container.style.overflow = ''
			if (content) {
				content.inert = false
				content.style.visibility = 'visible'
			}
		} else {
			container.style.clipPath = this.closedClipPath
			container.style.overflow = 'hidden'
			if (content) {
				content.inert = true
				content.style.visibility = 'hidden'
			}
		}

		// Set up drag
		this._setupDrag()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this._currentAnimation?.cancel()
	}

	// ============================================
	// ANIMATION
	// ============================================

	private async _animateOpen(): Promise<void> {
		const container = this._containerRef.value
		const content = this._contentRef.value
		if (!container) return

		if (content) {
			content.style.visibility = 'visible'
			content.inert = false
		}

		this.open = true
		await this.updateComplete

		if (reducedMotion$.value) {
			container.style.clipPath = ''
			container.style.overflow = ''
			this.dispatchScopedEvent('toggle', 'expanded')
			return
		}

		this._currentAnimation?.cancel()
		container.style.overflow = 'hidden'

		const openKeyframes: Keyframe[] = [
			{ clipPath: this.closedClipPath, opacity: 0.95 },
			{ clipPath: this.openClipPath, opacity: 1 },
		]
		const anim = container.animate(openKeyframes, {
			duration: SPRING_SMOOTH.duration,
			easing: SPRING_SMOOTH.easingFallback,
			fill: 'forwards',
		})
		this._currentAnimation = anim

		// Clear clip-path so overflow/scroll work normally after animation
		anim.finished.then(() => {
			if (container.isConnected) {
				container.style.clipPath = ''
				container.style.overflow = ''
			}
			return
		})

		this.dispatchScopedEvent('toggle', 'expanded')
	}

	private async _animateClose(): Promise<void> {
		const container = this._containerRef.value
		if (!container) return

		if (reducedMotion$.value) {
			container.style.clipPath = this.closedClipPath
			container.style.overflow = 'hidden'
			this.open = false
			const content = this._contentRef.value
			if (content) {
				content.inert = true
				content.style.visibility = 'hidden'
			}
			this.dispatchScopedEvent('toggle', 'collapsed')
			return
		}

		this._currentAnimation?.cancel()
		container.style.overflow = 'hidden'

		const closeKeyframes: Keyframe[] = [
			{ clipPath: this.openClipPath, opacity: 1 },
			{ clipPath: this.closedClipPath, opacity: 0.95 },
		]
		const anim = container.animate(closeKeyframes, {
			duration: Math.round(SPRING_SNAPPY.duration * 0.9),
			easing: 'cubic-bezier(0.4, 0, 0.8, 0.15)',
			fill: 'forwards',
		})
		this._currentAnimation = anim

		await anim.finished

		this.open = false

		const content = this._contentRef.value
		if (content) {
			content.inert = true
			content.style.visibility = 'hidden'
		}

		this.dispatchScopedEvent('toggle', 'collapsed')
	}

	// ============================================
	// PUBLIC API
	// ============================================

	toggle() {
		if (this.open) this._animateClose()
		else this._animateOpen()
	}

	expand() {
		if (this.open) return
		this.removeAttribute('hidden')
		if (!this._containerRef.value) {
			this.open = true
			return
		}
		this._animateOpen()
	}

	/** Alias for expand() — kept for backwards compatibility. */
	show() {
		this.expand()
	}

	close() {
		if (!this.open) return
		if (!this._containerRef.value) {
			this.open = false
			return
		}
		this._animateClose()
	}

	// ============================================
	// RENDER
	// ============================================

	protected render(): unknown {
		const isBottom = this._currentCorner.startsWith('bottom')

		const containerClasses = classMap({
			flex: true,
			'flex-col': isBottom,
			'flex-col-reverse': !isBottom,
			'will-change-[clip-path]': true,
			'z-1000': true,
			'ring-1': true,
			'ring-primary-default/15': this.open,
			'rounded-2xl': this.open,
			'ring-outline-variant/40': !this.open,
			'rounded-[22px]': !this.open,
			'overflow-hidden': true,
			'opacity-95': this.isDragging,
		})

		const containerStyles = styleMap({
			position: 'fixed',
			width: this.panelWidth,
			'max-height': 'calc(100vh - 32px)',
			'pointer-events': 'none',
		})

		const contentStyles = styleMap({
			'pointer-events': this.open ? 'auto' : 'none',
		})

		const headerClasses = classMap({
			'h-full': true,
			'px-3': true,
			flex: true,
			'items-center': true,
			'gap-2': true,
			'select-none': true,
			'touch-none': true,
			'cursor-grabbing': this.isDragging,
			'cursor-move': !this.isDragging,
			'transition-opacity': true,
			'duration-200': true,
		})

		return html`
			<!-- schmancy-surface owns background color and elevation-based shadow.
			     Position is managed imperatively via _applyContainerPosition(). -->
			<schmancy-surface
				${ref(this._containerRef)}
				type="glass"
				.elevation=${this.elevation}
				class=${containerClasses}
				style=${containerStyles}
				aria-expanded=${this.open}
			>
				<!-- Content section (visually above header for bottom corners) -->
				<section
					${ref(this._contentRef)}
					class="flex-1 min-h-0 overflow-hidden flex flex-col"
					style=${contentStyles}
					role="dialog"
					aria-label="${this.label ?? 'Floating panel'}"
				>
					<schmancy-surface type="solid" class="flex flex-col flex-1 min-h-0 overflow-hidden">
						<schmancy-scroll hide class="flex-1">
							<slot></slot>
						</schmancy-scroll>
					</schmancy-surface>
				</section>

				<!-- Gradient separator between header and content — only when open -->
				${when(
					this.open,
					() =>
						html`<div
							class="h-px shrink-0 bg-linear-to-r from-transparent via-primary-default/30 to-transparent"
						></div>`,
				)}

				<!-- Header / FAB section — always interactive, always visible -->
				<section
					class="shrink-0 bg-surface-containerLowest"
					style=${styleMap({ 'pointer-events': 'auto', height: `${FAB_HEIGHT}px` })}
				>
					<div
						${ref(this._headerRef)}
						class=${headerClasses}
						title="Drag to move"
						aria-label="Drag to reposition panel"
					>
						<!-- Summary slot rendered once — avoids DOM teardown on toggle -->
						<div class="flex-1 min-w-0">
							<slot name="summary"></slot>
						</div>

						<!-- Toggle button: collapse when open, expand when closed -->
						${when(
							this.open,
							() => html`
								<schmancy-icon-button
									size="sm"
									variant="text"
									@click=${(e: Event) => {
										e.stopPropagation()
										this.close()
									}}
									title="Collapse"
								>
									close_fullscreen
								</schmancy-icon-button>
							`,
							() => html`
								<schmancy-icon-button
									size="sm"
									variant="text"
									@click=${(e: Event) => {
										e.stopPropagation()
										this.expand()
									}}
									title="Expand"
								>
									fullscreen
								</schmancy-icon-button>
							`,
						)}
					</div>
				</section>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-boat': SchmancyBoat
	}
}

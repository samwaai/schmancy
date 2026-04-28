import { $LitElement } from '@mixins/index'
import { css, html, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import {
	animationFrameScheduler,
	auditTime,
	catchError,
	EMPTY,
	filter,
	finalize,
	from,
	fromEvent,
	map,
	merge,
	Observable,
	switchMap,
	take,
	takeUntil,
	tap,
} from 'rxjs'
import { SPRING_SMOOTH, SPRING_SNAPPY } from '../utils/animation.js'
import { cursorGlow } from '../directives/cursor-glow'
import { reducedMotion$ } from '../directives/reduced-motion'
import { theme } from '../theme/theme.service.js'
import type { SnapCorner, WindowBounds, WindowVisualState } from './window-registry.js'
import { windowManager } from './window-manager.js'
import { resolveOverlap } from './window-position.js'

const HEAD_HEIGHT = 48
const DRAG_THRESHOLD = 5

interface Position {
	x: number
	y: number
}

@customElement('schmancy-window')
export default class SchmancyWindow extends $LitElement(css`
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
	/** Override the expanded panel width (e.g. '320px', '24rem'). Defaults to responsive sizing. */
	@property({ type: String }) expandedWidth?: string
	/** Override the expanded panel height (e.g. '400px', '50vh'). */
	@property({ type: String }) expandedHeight?: string
	/** When true, uses a lower elevation shadow in the collapsed state. */
	@property({ type: Boolean, reflect: true }) lowered: boolean = false
	/** Corner the window is anchored to. */
	@property({ type: String }) corner: SnapCorner = 'bottom-right'
	/** When true, window can be resized by the user. */
	@property({ type: Boolean }) resizable = false
	/** When true, window stays at its dragged position instead of snapping to a corner. */
	@property({ type: Boolean }) freePosition = false
	/** Visual state of the window (minimized, normal, maximized). */
	@property({ type: String, reflect: true }) visualState: WindowVisualState = 'normal'
	/** Minimum width in pixels. */
	@property({ type: Number }) minWidth = 280
	/** Minimum height in pixels. */
	@property({ type: Number }) minHeight = 200

	/** Whether the body is expanded. */
	@property({ type: Boolean, reflect: true }) open = false

	private _currentAnimation?: Animation

	/** Lazy rendering: body content not in DOM until first expand. */
	@state() private _hasOpened = false
	/** Whether this window is the focused window in the manager — drives visual ring */
	@state() private _focused = false

	// Internal position -- plain fields, updated directly during drag
	private _position: Position = { x: 16, y: 16 }
	@state() private _currentCorner: SnapCorner = 'bottom-right'

	// Track applied corner to avoid unnecessary style.removeProperty calls during drag
	private _appliedCorner: string = ''

	// Refs
	private _containerRef = createRef<HTMLElement>()
	private _bodyRef = createRef<HTMLElement>()
	private _headRef = createRef<HTMLElement>()

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
			? `inset(calc(100% - ${HEAD_HEIGHT}px) 0px 0px 0px round 22px)`
			: `inset(0px 0px calc(100% - ${HEAD_HEIGHT}px) 0px round 22px)`
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
		// Only clear position properties when corner changes (avoids 4 style invalidations per drag frame)
		if (this._appliedCorner !== this._currentCorner) {
			container.style.removeProperty('left')
			container.style.removeProperty('right')
			container.style.removeProperty('top')
			container.style.removeProperty('bottom')
			this._appliedCorner = this._currentCorner
		}
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

	private static readonly VALID_CORNERS = new Set<string>(['top-left', 'top-right', 'bottom-left', 'bottom-right'])

	private _loadPosition() {
		const saved = windowManager.loadPosition(this.id)
		if (saved) {
			this._position = { x: saved.x, y: saved.y }
			if (SchmancyWindow.VALID_CORNERS.has(saved.anchor)) {
				this._currentCorner = saved.anchor as SnapCorner
			}
		}
	}

	private _savePosition() {
		windowManager.savePosition(this.id, { ...this._position, anchor: this._currentCorner })
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
		// Free position mode: skip corner snapping
		if (this.freePosition) {
			this._savePosition()
			const rect = this._containerRef.value?.getBoundingClientRect()
			if (rect) {
				windowManager.updateBounds(this.id, { left: rect.left, top: rect.top, width: rect.width, height: rect.height })
			}
			return
		}

		const container = this._containerRef.value
		if (!container) return

		// F -- record current screen position before DOM mutation
		const rect = container.getBoundingClientRect()

		// L -- calculate nearest corner using head visual center
		const currentIsBottom = this._currentCorner.includes('bottom')
		const headCenterX = rect.left + rect.width / 2
		const headCenterY = currentIsBottom
			? rect.bottom - HEAD_HEIGHT / 2
			: rect.top + HEAD_HEIGHT / 2
		const side = headCenterX > window.innerWidth / 2 ? 'right' : 'left'
		const vert = headCenterY > window.innerHeight / 2 ? 'bottom' : 'top'
		const newCorner: SnapCorner = `${vert}-${side}` as SnapCorner

		// Snap corner and reset offset to standard edge gap
		this._currentCorner = newCorner
		this._position = { x: 16, y: 16 }
		this._applyContainerPosition()
		// Sync clip-path to new corner
		if (!this.open) {
			container.style.clipPath = this.closedClipPath
		}

		if (skipAnimation || reducedMotion$.value) {
			this._savePosition()
			const snapRect = container.getBoundingClientRect()
			windowManager.updateBounds(this.id, { left: snapRect.left, top: snapRect.top, width: snapRect.width, height: snapRect.height })
			return
		}

		// I -- invert: shift element back to its original visual position
		const newRect = container.getBoundingClientRect()
		const dx = rect.left - newRect.left
		const dy = rect.top - newRect.top
		container.style.translate = `${dx}px ${dy}px`

		// P -- play: animate from the inverse offset to natural resting position
		const flipKeyframes: Keyframe[] = [{ translate: `${dx}px ${dy}px` }, { translate: '0px 0px' }]
		const anim = container.animate(
			flipKeyframes,
			{
				duration: SPRING_SMOOTH.duration,
				easing: SPRING_SMOOTH.easingFallback,
				fill: 'forwards',
			},
		)
		from(anim.finished).pipe(
			take(1),
			tap(() => {
				if (container.isConnected) container.style.translate = ''
				// Report final resting bounds after animation completes
				const finalRect = container.getBoundingClientRect()
				windowManager.updateBounds(this.id, { left: finalRect.left, top: finalRect.top, width: finalRect.width, height: finalRect.height })
			}),
			catchError(() => EMPTY),
			takeUntil(this.disconnecting),
		).subscribe()

		this._savePosition()
	}

	// ============================================
	// DRAG PIPELINE
	// ============================================

	private _drag$(): Observable<never> {
		return new Observable(() => {
			const head = this._headRef.value
			const container = this._containerRef.value
			if (!head || !container) return

			let didDrag = false

			const sub = fromEvent<PointerEvent>(head, 'pointerdown').pipe(
				filter(e => e.button === 0),
				filter(e => {
					const tag = (e.target as HTMLElement).tagName?.toLowerCase()
					return !['input', 'textarea', 'select', 'button'].includes(tag)
						&& !(e.target as HTMLElement).closest('schmancy-input, schmancy-icon-button, button, a')
				}),
				tap(e => {
					e.preventDefault()
					e.stopPropagation()
				}),
			)
				.pipe(
					map(e => {
						const rect = container.getBoundingClientRect()
						const isBottom = this._currentCorner.includes('bottom')
						const wasOpen = this.open
						didDrag = false
						return {
							startX: e.clientX,
							startY: e.clientY,
							offsetX: e.clientX - rect.left,
							offsetY: e.clientY - rect.top,
							rect,
							vw: window.innerWidth,
							vh: window.innerHeight,
							isBottom,
							wasOpen,
							pointerId: e.pointerId,
						}
					}),
					switchMap(({ startX, startY, offsetX, offsetY, rect, vw, vh, isBottom, wasOpen, pointerId }) => {
						const move$ = fromEvent<PointerEvent>(window, 'pointermove').pipe(
							filter(e => e.pointerId === pointerId),
							auditTime(0, animationFrameScheduler),
							map(e => ({ clientX: e.clientX, clientY: e.clientY })),
						)
						const end$ = fromEvent<PointerEvent>(window, 'pointerup').pipe(
							filter(e => e.pointerId === pointerId),
						)

						return move$.pipe(
							tap(({ clientX, clientY }) => {
								const dx = clientX - startX
								const dy = clientY - startY
								if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD && !didDrag) {
									didDrag = true
									this._applyDragVisuals(true)
									// Collapse on first confirmed drag move
									if (wasOpen) {
										this.open = false
										container.style.clipPath = this.closedClipPath
										container.style.overflow = 'hidden'
										const body = this._bodyRef.value
										if (body) {
											body.inert = true
											body.style.visibility = 'hidden'
										}
									}
								}
								if (!didDrag) return

								const left = Math.max(0, Math.min(clientX - offsetX, vw - rect.width))
								const minTop = isBottom ? HEAD_HEIGHT - rect.height : 0
								const maxTop = isBottom ? vh - rect.height : vh - HEAD_HEIGHT
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
									this._applyDragVisuals(false)
									didDrag = false
								} else {
									didDrag = false
									this.toggle()
								}
							}),
						)
					}),
				)
				.subscribe()

			return () => sub.unsubscribe()
		})
	}

	// ============================================
	// LIFECYCLE
	// ============================================

	connectedCallback() {
		super.connectedCallback()

		// Pipeline 1: DOM setup + manager registration + drag + z-index sync
		from(this.updateComplete).pipe(
			take(1),
			tap(() => {
				this._currentCorner = this.corner
				this._loadPosition()
				this._applyContainerPosition()
				this._initDOMState()
				// Register with window manager
				const container = this._containerRef.value
				if (container) {
					const rect = container.getBoundingClientRect()
					const bounds: WindowBounds = { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
					windowManager.register(this.id, bounds, this.freePosition ? 'free' : this._currentCorner)
				}
			}),
			switchMap(() => merge(
				this._drag$(),
				windowManager.selectWindow(this.id).pipe(
					tap(record => {
						if (!record) return
						const container = this._containerRef.value
						if (container) container.style.zIndex = String(record.zIndex)
					}),
				),
				windowManager.selectFocused().pipe(
					tap(focusedId => {
						this._focused = focusedId === this.id
					}),
				),
			)),
			takeUntil(this.disconnecting),
		).subscribe()


		// Pipeline 3: Environment -- one subscription
		merge(
			fromEvent(window, 'resize').pipe(
				auditTime(0, animationFrameScheduler),
				tap(() => this._validateBounds()),
			),
			theme.bottomOffset$.pipe(
				tap(() => this._applyContainerPosition()),
			),
		).pipe(takeUntil(this.disconnecting)).subscribe()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		windowManager.unregister(this.id)
	}

	private _initDOMState() {
		const container = this._containerRef.value
		const body = this._bodyRef.value
		if (!container) return

		this._applyContainerPosition()

		if (this.open) {
			this._hasOpened = true
			container.style.overflow = ''
			if (body) {
				body.inert = false
				body.style.visibility = 'visible'
			}
		} else {
			container.style.clipPath = this.closedClipPath
			container.style.overflow = 'hidden'
			if (body) {
				body.inert = true
				body.style.visibility = 'hidden'
			}
		}
	}

	// ============================================
	// ANIMATION
	// ============================================

	private _animateOpen() {
		const container = this._containerRef.value
		const body = this._bodyRef.value
		if (!container) return

		this._hasOpened = true
		this.open = true

		// Overlap avoidance
		const rect = container.getBoundingClientRect()
		const projectedBounds: WindowBounds = {
			left: rect.left,
			top: this.isBottomCorner ? rect.top - 400 : rect.top,
			width: rect.width,
			height: 400 + HEAD_HEIGHT,
		}
		const overlaps = windowManager.findOverlaps(projectedBounds, this.id)
		if (overlaps.length > 0) {
			const resolved = resolveOverlap(projectedBounds, overlaps, { width: window.innerWidth, height: window.innerHeight })
			if (Math.abs(resolved.left - projectedBounds.left) > 10 || Math.abs(resolved.top - projectedBounds.top) > 10) {
				const isRight = this._currentCorner.includes('right')
				const isBottom = this._currentCorner.includes('bottom')
				this._position = {
					x: isRight ? window.innerWidth - resolved.left - resolved.width : resolved.left,
					y: isBottom ? window.innerHeight - resolved.top - resolved.height : resolved.top,
				}
				this._applyContainerPosition()
			}
		}

		if (body) {
			body.style.visibility = 'visible'
			body.inert = false
		}

		if (reducedMotion$.value) {
			container.style.clipPath = ''
			container.style.overflow = ''
			this.dispatchScopedEvent('window-toggle', { state: 'expanded' })
			return
		}

		this._currentAnimation?.cancel()
		container.style.overflow = 'hidden'
		container.style.willChange = 'opacity'
		const openKeyframes: Keyframe[] = [
			{ clipPath: this.closedClipPath, opacity: 0.95 },
			{ clipPath: this.openClipPath, opacity: 1 },
		]
		const anim = container.animate(openKeyframes, {
			duration: SPRING_SNAPPY.duration,
			easing: SPRING_SNAPPY.easingFallback,
			fill: 'forwards',
		})
		this._currentAnimation = anim

		from(anim.finished).pipe(
			take(1),
			tap(() => {
				if (container.isConnected) {
					container.style.clipPath = ''
					container.style.overflow = ''
					container.style.willChange = ''
				}
			}),
			catchError(() => EMPTY),
			takeUntil(this.disconnecting),
		).subscribe()

		this.dispatchScopedEvent('window-toggle', { state: 'expanded' })
	}

	private _animateClose() {
		const container = this._containerRef.value
		if (!container) return

		if (reducedMotion$.value) {
			container.style.clipPath = this.closedClipPath
			container.style.overflow = 'hidden'
			this.open = false
			const body = this._bodyRef.value
			if (body) { body.inert = true; body.style.visibility = 'hidden' }
			this.dispatchScopedEvent('window-toggle', { state: 'collapsed' })
			return
		}

		this._currentAnimation?.cancel()
		container.style.overflow = 'hidden'
		container.style.willChange = 'opacity'
		const closeKeyframes: Keyframe[] = [
			{ clipPath: this.openClipPath, opacity: 1 },
			{ clipPath: this.closedClipPath, opacity: 0.95 },
		]
		const anim = container.animate(closeKeyframes, {
			duration: Math.round(SPRING_SNAPPY.duration * 0.7),
			easing: 'cubic-bezier(0.4, 0, 0.8, 0.15)',
			fill: 'forwards',
		})
		this._currentAnimation = anim

		from(anim.finished).pipe(
			take(1),
			tap(() => {
				this.open = false
				container.style.willChange = ''
				const body = this._bodyRef.value
				if (body) { body.inert = true; body.style.visibility = 'hidden' }
			}),
			catchError(() => EMPTY),
			takeUntil(this.disconnecting),
		).subscribe()

		this.dispatchScopedEvent('window-toggle', { state: 'collapsed' })
	}

	// ============================================
	// VISUAL STATE HELPERS
	// ============================================

	/** Apply drag visuals directly on DOM refs — avoids full Lit re-render for cursor + opacity */
	private _applyDragVisuals(dragging: boolean) {
		const head = this._headRef.value
		const container = this._containerRef.value
		if (head) {
			head.classList.toggle('cursor-grabbing', dragging)
			head.classList.toggle('cursor-move', !dragging)
		}
		if (container) {
			container.style.opacity = dragging ? '0.95' : ''
		}
	}

	private _handleFocus = () => windowManager.focus(this.id)

	private _handleHeadKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			this.toggle()
			return
		}
		if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
			e.preventDefault()
			const step = e.shiftKey ? 20 : 5
			const dx = e.key === 'ArrowRight' ? step : e.key === 'ArrowLeft' ? -step : 0
			const dy = e.key === 'ArrowDown' ? step : e.key === 'ArrowUp' ? -step : 0
			this._position = { x: this._position.x + dx, y: this._position.y + dy }
			this._applyContainerPosition()
			this._savePosition()
		}
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
		this._animateOpen()
	}

	close() {
		if (!this.open) return
		this._animateClose()
	}

	// ============================================
	// RENDER
	// ============================================

	protected render(): unknown {
		const isBottom = this._currentCorner.startsWith('bottom')

		const containerClasses = classMap({
			fixed: true,
			flex: true,
			'flex-col': isBottom,
			'flex-col-reverse': !isBottom,
			'z-1000': true,
			'ring-1': !this._focused,
			'ring-2': this._focused,
			'ring-primary-default/30': this._focused,
			'ring-primary-default/15': this.open && !this._focused,
			'rounded-2xl': this.open,
			'ring-outline-variant/40': !this.open && !this._focused,
			'rounded-[22px]': !this.open,
			'overflow-hidden': true,
		})

		const containerStyles = styleMap({
			width: this.panelWidth,
			'max-height': 'calc(100vh - 32px)',
			'pointer-events': 'none',
		})

		const bodyStyles = styleMap({
			'pointer-events': this.open ? 'auto' : 'none',
		})

		const headClasses = classMap({
			'h-full': true,
			'px-3': true,
			flex: true,
			'items-center': true,
			'gap-2': true,
			'select-none': true,
			'cursor-move': true,
		})

		return html`
			<schmancy-surface
				${ref(this._containerRef)}
				type="glass"
				.elevation=${this.elevation}
				class=${containerClasses}
				style=${containerStyles}
				aria-expanded=${this.open}
				@pointerdown=${this._handleFocus}
			>
				<!-- Details section (visually above summary for bottom corners) -->
				<section
					${ref(this._bodyRef)}
					class="flex-1 min-h-0 overflow-hidden flex flex-col"
					style=${bodyStyles}
					role="region"
					aria-label="Expandable content"
				>
					${this._hasOpened ? html`<slot name="details"></slot>` : nothing}
				</section>

				<!-- Summary section -- always interactive, always visible -->
				<section
					class="shrink-0 bg-surface-lowest"
					style=${styleMap({ 'pointer-events': 'auto', height: `${HEAD_HEIGHT}px` })}
				>
					<div
						${ref(this._headRef)}
						${cursorGlow({ radius: 200, intensity: 0.10 })}
						class=${headClasses}
						role="button"
						tabindex="0"
						title="Drag to move, click to expand"
						aria-label="${this.open ? 'Collapse window' : 'Expand window'}"
						@keydown=${this._handleHeadKeydown}
					>
						<div class="flex-1 min-w-0">
							<slot></slot>
						</div>
						<svg
							width="16" height="16" viewBox="0 0 24 24" fill="none"
							class="shrink-0 text-surface-on/40 transition-transform duration-200 ${this.open ? 'rotate-180' : ''}"
							aria-hidden="true"
						>
							<path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</div>
				</section>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-window': SchmancyWindow
	}
}

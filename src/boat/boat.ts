import { SchmancyElement } from '@mixins/index'
import { css, html, nothing, type PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { when } from 'lit/directives/when.js'
import { filter, finalize, fromEvent, map, merge, type Subscription, switchMap, takeUntil, tap } from 'rxjs'
import { SPRING_SMOOTH } from '../utils/animation.js'
import { reducedMotion$ } from '../directives/reduced-motion'
import { show } from '../overlay/overlay.service'
import { theme } from '../theme/theme.service.js'

const DRAG_THRESHOLD = 5
const POSITION_STORAGE_KEY_PREFIX = 'schmancy-boat-'

type Corner = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
interface Position {
	x: number
	y: number
}

/**
 * Material-3 extended FAB that delegates its expanded panel to the `show()`
 * overlay service. Collapsed: a draggable, corner-anchored pill (icon + label,
 * circular when no label). Activated: the default-slot content blooms from the
 * FAB as an overlay (backdrop / Esc / back-button / sheet-on-narrow handled by
 * the overlay primitive).
 */
@customElement('schmancy-boat')
export default class SchmancyBoat extends SchmancyElement {
	static styles = [css`
		:host {
			display: contents;
		}
		:host([hidden]) {
			display: none !important;
		}
	`]

	@property({ type: String }) id: string = 'default'
	@property({ type: String }) icon?: string
	@property({ type: String }) label?: string
	/** When true, uses a lower elevation shadow on the FAB. */
	@property({ type: Boolean, reflect: true }) lowered: boolean = false
	/** Corner the FAB is anchored to. */
	@property({ type: String }) corner: Corner = 'bottom-right'
	/** Open state. Bind `?open=${…}` to drive the overlay; reflected to the attribute. */
	@property({ type: Boolean, reflect: true }) open: boolean = false

	@state() private isDragging = false
	@state() private _currentCorner: Corner = 'bottom-right'

	@queryAssignedElements() private _slotted!: Element[]

	private _position: Position = { x: 16, y: 16 }
	private _containerRef = createRef<HTMLElement>()
	private _headerRef = createRef<HTMLElement>()
	private _currentAnimation?: Animation

	#ready = false
	#sub?: Subscription
	#captured: Element[] = []

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
	// CORNER SNAPPING (FLIP)
	// ============================================

	private _reorientToNearestCorner(): void {
		const container = this._containerRef.value
		if (!container) return

		const rect = container.getBoundingClientRect()
		const fabCenterX = rect.left + rect.width / 2
		const fabCenterY = rect.top + rect.height / 2
		const side = fabCenterX > window.innerWidth / 2 ? 'right' : 'left'
		const vert = fabCenterY > window.innerHeight / 2 ? 'bottom' : 'top'
		this._currentCorner = `${vert}-${side}` as Corner
		this._position = { x: 16, y: 16 }
		this._applyContainerPosition()

		if (reducedMotion$.value) {
			this._savePosition()
			return
		}

		const newRect = container.getBoundingClientRect()
		const dx = rect.left - newRect.left
		const dy = rect.top - newRect.top
		container.style.transform = `translate(${dx}px, ${dy}px)`

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
			if (container.isConnected) container.style.transform = ''
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
					didDrag = false
					return {
						pointerId: e.pointerId,
						startX: e.clientX,
						startY: e.clientY,
						offsetX: e.clientX - rect.left,
						offsetY: e.clientY - rect.top,
						rect,
					}
				}),
				switchMap(({ pointerId, startX, startY, offsetX, offsetY, rect }) => {
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
							}
							if (!didDrag) return

							const vw = window.innerWidth
							const vh = window.innerHeight
							const left = Math.max(0, Math.min(clientX - offsetX, vw - rect.width))
							const top = Math.max(0, Math.min(clientY - offsetY, vh - rect.height))
							this._position = {
								x: this._currentCorner.includes('right') ? vw - left - rect.width : left,
								y: this._currentCorner.includes('bottom') ? vh - top - rect.height : top,
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
	// OVERLAY DELEGATION
	// ============================================

	private _openOverlay() {
		if (this.#sub) return
		const anchor = this._containerRef.value
		const wrapper = document.createElement('div')
		wrapper.className = 'flex flex-col'
		this.#captured = [...this._slotted]
		this.#captured.forEach(node => wrapper.appendChild(node))

		this.#sub = show(wrapper, {
			anchor: anchor ?? undefined,
			dismissable: true,
			historyStrategy: 'silent',
		})
			.pipe(
				finalize(() => this._restoreSlotted()),
				takeUntil(this.disconnecting),
			)
			.subscribe()

		this.dispatchScopedEvent('toggle', 'open')
	}

	private _restoreSlotted() {
		this.#captured.forEach(node => this.appendChild(node))
		this.#captured = []
		this.#sub = undefined
		if (this.open) this.open = false
		this.dispatchScopedEvent('toggle', 'closed')
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
		this._currentCorner = this.corner
		this._loadPosition()
		if (!this._containerRef.value) return
		this._applyContainerPosition()
		this._setupDrag()
		this.#ready = true
		if (this.open) this._openOverlay()
	}

	protected willUpdate(changed: PropertyValues<this>) {
		if (!this.#ready || !changed.has('open')) return
		if (this.open && !this.#sub) this._openOverlay()
		else if (!this.open && this.#sub) this.#sub.unsubscribe()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this._currentAnimation?.cancel()
		this.#sub?.unsubscribe()
	}

	// ============================================
	// PUBLIC API
	// ============================================

	/** Flip open ↔ closed. */
	toggle() {
		this.open = !this.open
	}

	// ============================================
	// RENDER
	// ============================================

	protected render(): unknown {
		const containerClasses = classMap({
			'inline-flex': true,
			'rounded-full': true,
			'overflow-hidden': true,
			'transition-opacity': true,
			'duration-200': true,
			'opacity-85': this.isDragging,
			'scale-95': this.isDragging,
		})

		const containerStyles = styleMap({
			position: 'fixed',
			'pointer-events': 'auto',
		})

		const fabClasses = classMap({
			'h-14': true,
			'rounded-full': true,
			flex: true,
			'items-center': true,
			'gap-3': true,
			'select-none': true,
			'touch-none': true,
			'cursor-grabbing': this.isDragging,
			'cursor-pointer': !this.isDragging,
			'px-5': !!this.label,
			'w-14': !this.label,
			'justify-center': !this.label,
		})

		return html`
			<schmancy-surface
				${ref(this._containerRef)}
				type="glass"
				.elevation=${this.lowered ? 1 : 3}
				class=${containerClasses}
				style=${containerStyles}
				aria-expanded=${this.open}
			>
				<div
					${ref(this._headerRef)}
					class=${fabClasses}
					role="button"
					tabindex="0"
					aria-label=${this.label ?? 'Open panel'}
					title="Drag to move · click to open"
				>
					<slot name="header">
						${when(
							!!this.icon,
							() => html`<schmancy-icon>${this.icon}</schmancy-icon>`,
							() => nothing,
						)}
					</slot>
					${when(
						!!this.label,
						() => html`<schmancy-typography type="label" token="lg" class="whitespace-nowrap">
							${this.label}
						</schmancy-typography>`,
						() => nothing,
					)}
					<slot name="summary"></slot>
				</div>

				<!-- Default-slot content parks here (hidden) while collapsed;
				     relocated into the show() overlay on open. -->
				<div hidden><slot></slot></div>
			</schmancy-surface>
		`
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'schmancy-boat': SchmancyBoat
	}
}

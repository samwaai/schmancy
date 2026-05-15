import { SchmancyElement } from '@mixins/index'
import { css, html, type PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { filter, finalize, fromEvent, map, merge, type Subscription, switchMap, takeUntil, tap } from 'rxjs'
import { reducedMotion$ } from '../directives/reduced-motion'
import { show } from '../overlay/overlay.service'
import { theme } from '../theme/theme.service.js'
import { SPRING_SMOOTH } from '../utils/animation.js'

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

	/** Identity for localStorage drag-position persistence. */
	@property({ type: String }) id: string = 'default'
	/** Corner the FAB is anchored to. */
	@property({ type: String }) corner: Corner = 'bottom-right'
	/** Open state. Bind `?open=${…}` to drive the overlay; reflected to the attribute. */
	@property({ type: Boolean, reflect: true }) open: boolean = false

	@state() private isDragging = false
	@state() private currentCorner: Corner = 'bottom-right'

	@queryAssignedElements() private slotted!: Element[]

	private position: Position = { x: 16, y: 16 }
	private containerRef = createRef<HTMLElement>()
	private headerRef = createRef<HTMLElement>()
	private currentAnimation?: Animation

	#ready = false
	#sub?: Subscription
	#captured: Element[] = []

	// ============================================
	// POSITION MANAGEMENT
	// ============================================

	private applyContainerPosition() {
		const container = this.containerRef.value
		if (!container) return
		container.style.removeProperty('left')
		container.style.removeProperty('right')
		container.style.removeProperty('top')
		container.style.removeProperty('bottom')
		const { x, y } = this.position
		if (this.currentCorner.includes('right')) {
			container.style.right = `${x}px`
		} else {
			container.style.left = `${x}px`
		}
		if (this.currentCorner.includes('bottom')) {
			container.style.bottom = `${y + theme.bottomOffset}px`
		} else {
			container.style.top = `${y}px`
		}
	}

	private loadPosition() {
		try {
			const saved = localStorage.getItem(POSITION_STORAGE_KEY_PREFIX + this.id)
			if (saved) {
				const parsed = JSON.parse(saved) as { x: number; y: number; anchor: Corner }
				this.position = { x: parsed.x, y: parsed.y }
				this.currentCorner = parsed.anchor
			}
		} catch {
			// ignore localStorage errors
		}
	}

	private savePosition() {
		try {
			localStorage.setItem(
				POSITION_STORAGE_KEY_PREFIX + this.id,
				JSON.stringify({ ...this.position, anchor: this.currentCorner }),
			)
		} catch {
			// ignore localStorage errors
		}
	}

	private validateBounds() {
		const container = this.containerRef.value
		if (!container) return
		const rect = container.getBoundingClientRect()
		if (rect.width === 0) return
		const vw = window.innerWidth
		const vh = window.innerHeight
		const isRight = this.currentCorner.includes('right')
		const isBottom = this.currentCorner.includes('bottom')
		const actualLeft = isRight ? vw - this.position.x - rect.width : this.position.x
		const actualTop = isBottom ? vh - this.position.y - rect.height : this.position.y
		const newLeft = Math.max(0, Math.min(actualLeft, vw - rect.width))
		const newTop = Math.max(0, Math.min(actualTop, vh - rect.height))
		this.position = {
			x: isRight ? vw - newLeft - rect.width : newLeft,
			y: isBottom ? vh - newTop - rect.height : newTop,
		}
		this.applyContainerPosition()
	}

	// ============================================
	// CORNER SNAPPING (FLIP)
	// ============================================

	private reorientToNearestCorner(): void {
		const container = this.containerRef.value
		if (!container) return

		const rect = container.getBoundingClientRect()
		const fabCenterX = rect.left + rect.width / 2
		const fabCenterY = rect.top + rect.height / 2
		const side = fabCenterX > window.innerWidth / 2 ? 'right' : 'left'
		const vert = fabCenterY > window.innerHeight / 2 ? 'bottom' : 'top'
		this.currentCorner = `${vert}-${side}` as Corner
		this.position = { x: 16, y: 16 }
		this.applyContainerPosition()

		if (reducedMotion$.value) {
			this.savePosition()
			return
		}

		const newRect = container.getBoundingClientRect()
		const dx = rect.left - newRect.left
		const dy = rect.top - newRect.top
		container.style.transform = `translate(${dx}px, ${dy}px)`

		this.currentAnimation?.cancel()
		const anim = container.animate(
			[{ transform: container.style.transform }, { transform: 'translate(0,0)' }],
			{
				duration: SPRING_SMOOTH.duration,
				easing: SPRING_SMOOTH.easingFallback,
				fill: 'forwards',
			},
		)
		this.currentAnimation = anim
		anim.finished.then(() => {
			if (container.isConnected) container.style.transform = ''
			return
		})

		this.savePosition()
	}

	// ============================================
	// DRAG PIPELINE
	// ============================================

	private setupDrag() {
		const header = this.headerRef.value
		const container = this.containerRef.value
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
							this.position = {
								x: this.currentCorner.includes('right') ? vw - left - rect.width : left,
								y: this.currentCorner.includes('bottom') ? vh - top - rect.height : top,
							}
							this.applyContainerPosition()
						}),
						takeUntil(end$),
						finalize(() => {
							if (didDrag) {
								this.reorientToNearestCorner()
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

	private openOverlay() {
		if (this.#sub) return
		const anchor = this.containerRef.value
		const wrapper = document.createElement('div')
		wrapper.className = 'flex flex-col'
		this.#captured = [...this.slotted]
		this.#captured.forEach(node => wrapper.appendChild(node))

		this.#sub = show(wrapper, {
			anchor: anchor ?? undefined,
			dismissable: true,
			historyStrategy: 'silent',
		})
			.pipe(
				finalize(() => this.restoreSlotted()),
				takeUntil(this.disconnecting),
			)
			.subscribe()

		this.dispatchScopedEvent('toggle', 'open')
	}

	private restoreSlotted() {
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
			.subscribe(() => this.validateBounds())

		theme.bottomOffset$.pipe(
			tap(() => this.applyContainerPosition()),
			takeUntil(this.disconnecting),
		).subscribe()
	}

	firstUpdated() {
		this.currentCorner = this.corner
		this.loadPosition()
		if (!this.containerRef.value) return
		this.applyContainerPosition()
		this.setupDrag()
		this.#ready = true
		if (this.open) this.openOverlay()
	}

	protected willUpdate(changed: PropertyValues<this>) {
		if (!this.#ready || !changed.has('open')) return
		if (this.open && !this.#sub) this.openOverlay()
		else if (!this.open && this.#sub) this.#sub.unsubscribe()
	}

	disconnectedCallback() {
		super.disconnectedCallback()
		this.currentAnimation?.cancel()
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
			'min-w-14': true,
			'px-4': true,
			'rounded-full': true,
			flex: true,
			'items-center': true,
			'justify-center': true,
			'gap-3': true,
			'select-none': true,
			'touch-none': true,
			'cursor-grabbing': this.isDragging,
			'cursor-pointer': !this.isDragging,
		})

		return html`
			<schmancy-surface
				${ref(this.containerRef)}
				type="glass"
				.elevation=${3}
				class=${containerClasses}
				style=${containerStyles}
				aria-expanded=${this.open}
			>
				<div
					${ref(this.headerRef)}
					class=${fabClasses}
					role="button"
					tabindex="0"
					aria-label="Open panel"
					title="Drag to move · click to open"
				>
					<slot name="header"></slot>
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

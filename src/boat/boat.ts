import { SchmancyElement } from '@mixins/index'
import { html, type PropertyValues } from 'lit'
import { customElement, property, queryAssignedElements, state } from 'lit/decorators.js'
import { classMap } from 'lit/directives/class-map.js'
import { createRef, ref } from 'lit/directives/ref.js'
import { styleMap } from 'lit/directives/style-map.js'
import { exhaustMap, filter, finalize, fromEvent, merge, type Subscription, takeUntil, tap } from 'rxjs'
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
 * Corner-anchored launcher that delegates its expanded panel to the `show()`
 * overlay service.
 *
 * Three slots, three non-overlapping intents — no element-type sniffing,
 * ever:
 *
 *   - `trigger`  — pure consumer content. A native click anywhere on it
 *     opens the panel; interactive children (buttons, FABs, inputs) work
 *     with zero special-casing because the boat never calls
 *     `preventDefault` / `stopPropagation` / `setPointerCapture` here.
 *   - `drag-handle` — opt-in. Pointer-drag is wired ONLY to this slot's
 *     boat-owned wrapper. Slot it to make the boat draggable; omit it and
 *     the boat is static at its corner. (A no-move tap on the handle also
 *     opens, so the grip doubles as a launcher.)
 *   - _(default)_ — the panel body; parked hidden while collapsed,
 *     relocated into the `show()` overlay on open.
 *
 * The boat owns drag, corner-snapping, position persistence and the glass
 * surface — never the collapsed shape.
 */
@customElement('schmancy-boat')
export default class SchmancyBoat extends SchmancyElement {


	/** Identity for localStorage drag-position persistence. */
	@property({ type: String }) id: string = 'default'
	/** Corner the launcher is anchored to. */
	@property({ type: String }) corner: Corner = 'bottom-right'
	/** Open state. Bind `?open=${…}` to drive the overlay; reflected to the attribute. */
	@property({ type: Boolean, reflect: true }) open: boolean = false

	@state() private isDragging = false
	@state() private currentCorner: Corner = 'bottom-right'
	@state() private hasHandle = false

	/** Default-slot nodes — the overlay body. */
	@queryAssignedElements() private slotted!: Element[]
	/** Slotted drag-handle nodes — presence toggles draggability. */
	@queryAssignedElements({ slot: 'drag-handle' }) private handleNodes!: Element[]

	private position: Position = { x: 16, y: 16 }
	private containerRef = createRef<HTMLElement>()
	private triggerRef = createRef<HTMLElement>()
	private handleRef = createRef<HTMLElement>()
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

		// One concern: keep the container in place when the environment
		// shifts. Viewport resize re-validates bounds; a theme bottom-offset
		// change (e.g. a snackbar pushing the safe area) re-applies position.
		merge(
			fromEvent(window, 'resize').pipe(tap(() => this.validateBounds())),
			theme.bottomOffset$.pipe(tap(() => this.applyContainerPosition())),
		)
			.pipe(takeUntil(this.disconnecting))
			.subscribe()
	}

	firstUpdated() {
		this.currentCorner = this.corner
		this.hasHandle = this.handleNodes.length > 0
		this.loadPosition()
		const container = this.containerRef.value
		const trigger = this.triggerRef.value
		const handle = this.handleRef.value
		if (!container || !trigger || !handle) return
		this.applyContainerPosition()

		// Three intents, three sources, one pipeline, one subscribe.
		//
		// open$  — a plain click/Enter/Space on the trigger region. No
		//          preventDefault/stopPropagation: a slotted button's own
		//          click still fires; it merely also bubbles to "open".
		// drag$  — pointerdown on the boat-owned drag-handle wrapper. A
		//          dedicated region, so every pointerdown there is a drag
		//          intent — no element-type sniffing. A session ends on
		//          pointerup/cancel; settle = move past threshold ? snap to
		//          the nearest corner : treat as a tap and open.
		merge(
			fromEvent<MouseEvent>(trigger, 'click').pipe(tap(() => this.toggle())),
			fromEvent<KeyboardEvent>(trigger, 'keydown').pipe(
				filter(e => e.key === 'Enter' || e.key === ' '),
				tap(e => {
					e.preventDefault()
					this.toggle()
				}),
			),
			fromEvent<PointerEvent>(handle, 'pointerdown').pipe(
				filter(e => e.button === 0),
				tap(e => {
					e.preventDefault()
					// Capture can throw InvalidStateError if the pointer is
					// already released (fast tap) — drag still works without it.
					try {
						handle.setPointerCapture(e.pointerId)
					} catch {
						// no active pointer to capture; ignore
					}
				}),
				exhaustMap(down => {
					const rect = container.getBoundingClientRect()
					const offsetX = down.clientX - rect.left
					const offsetY = down.clientY - rect.top
					let moved = false
					const sameId = (e: PointerEvent) => e.pointerId === down.pointerId
					const end$ = merge(
						fromEvent<PointerEvent>(window, 'pointerup'),
						fromEvent<PointerEvent>(window, 'pointercancel'),
					).pipe(filter(sameId))

					return fromEvent<PointerEvent>(window, 'pointermove').pipe(
						filter(sameId),
						tap(e => {
							const dx = e.clientX - down.clientX
							const dy = e.clientY - down.clientY
							if (!moved && Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
								moved = true
								this.isDragging = true
							}
							if (!moved) return
							const vw = window.innerWidth
							const vh = window.innerHeight
							const left = Math.max(0, Math.min(e.clientX - offsetX, vw - rect.width))
							const top = Math.max(0, Math.min(e.clientY - offsetY, vh - rect.height))
							this.position = {
								x: this.currentCorner.includes('right') ? vw - left - rect.width : left,
								y: this.currentCorner.includes('bottom') ? vh - top - rect.height : top,
							}
							this.applyContainerPosition()
						}),
						takeUntil(end$),
						finalize(() => {
							if (moved) this.reorientToNearestCorner()
							else this.toggle()
							this.isDragging = false
						}),
					)
				}),
			),
		)
			.pipe(takeUntil(this.disconnecting))
			.subscribe()

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

	private onHandleSlotChange = () => {
		this.hasHandle = this.handleNodes.length > 0
	}

	protected render(): unknown {
		const containerClasses = classMap({
			'inline-flex': true,
			'transition-opacity': true,
			'duration-200': true,
			'opacity-85': this.isDragging,
			'scale-95': this.isDragging,
		})

		const containerStyles = styleMap({
			position: 'fixed',
			'pointer-events': 'auto',
		})

		// Boat-owned drag region — wraps ONLY the drag-handle slot, so every
		// pointerdown inside it is unambiguously a drag intent. Hidden (and
		// out of layout) when the consumer slots no handle: the boat is then
		// simply not draggable.
		const handleClasses = classMap({
			flex: true,
			'items-center': true,
			'touch-none': true,
			'select-none': true,
			hidden: !this.hasHandle,
			'cursor-grabbing': this.isDragging,
			'cursor-grab': !this.isDragging,
		})

		return html`
			<schmancy-surface
				${ref(this.containerRef)}
				type="glass"
				rounded="all"
				.elevation=${3}
				class="${containerClasses} overflow-hidden rounded-2xl"
				style=${containerStyles}
				aria-expanded=${this.open}
			>
				<div
					${ref(this.handleRef)}
					class=${handleClasses}
					aria-label="Drag to move"
				>
					<slot name="drag-handle" @slotchange=${this.onHandleSlotChange}></slot>
				</div>

				<div
					${ref(this.triggerRef)}
					class="flex items-center cursor-pointer"
					role="button"
					tabindex="0"
					aria-label="Open panel"
					title="Click to open"
				>
					<slot name="trigger"></slot>
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

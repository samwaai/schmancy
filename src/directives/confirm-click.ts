import { Directive, directive, ElementPart, PartInfo, PartType } from 'lit/directive.js'
import { animationFrameScheduler, fromEvent, interval, merge, of, Subject, Subscription, timer } from 'rxjs'
import { filter, map, observeOn, take, takeUntil, takeWhile, tap } from 'rxjs/operators'

export interface ConfirmClickOptions {
	/** Auto-reset timeout in ms (default: 3000) */
	timeout?: number
	/** Override icon for confirmation state (default: inherits from host element) */
	icon?: string
}

interface ConfirmClickState {
	subscription: Subscription
	callback: () => void
	options: ConfirmClickOptions
	overlayElement: HTMLElement | null
	isConfirming: boolean
	cancel$: Subject<void>
}

const confirmClickMap = new WeakMap<Element, ConfirmClickState>()

/** Resolve a CSS variable value from the document root */
function resolveCssColor(varExpr: string, fallback: string): string {
	const match = varExpr.match(/var\(([^,)]+)/)
	if (!match) return fallback
	const value = getComputedStyle(document.documentElement).getPropertyValue(match[1]).trim()
	return value || fallback
}

class ConfirmClickDirective extends Directive {
	constructor(partInfo: PartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('confirmClick directive can only be used on elements')
		}
	}

	render(_callback: () => void, _options?: ConfirmClickOptions) {
		return undefined
	}

	update(part: ElementPart, [callback, options = {}]: [() => void, ConfirmClickOptions?]) {
		const element = part.element as HTMLElement
		const existing = confirmClickMap.get(element)

		if (existing) {
			// Always update callback ref (arrow functions change identity every render)
			existing.callback = callback

			// Only re-subscribe if options changed
			if (this.optionsEqual(existing.options, options)) {
				return undefined
			}
			this.cleanup(element)
		}

		const cancel$ = new Subject<void>()
		const subscription = this.setupClickListener(element, options ?? {}, cancel$)

		confirmClickMap.set(element, {
			subscription,
			callback,
			options: options ?? {},
			overlayElement: null,
			isConfirming: false,
			cancel$,
		})

		return undefined
	}

	private optionsEqual(a: ConfirmClickOptions, b: ConfirmClickOptions | undefined): boolean {
		if (!b) return Object.keys(a).length === 0
		return a.timeout === b.timeout && a.icon === b.icon
	}

	private setupClickListener(
		element: HTMLElement,
		options: ConfirmClickOptions,
		cancel$: Subject<void>,
	): Subscription {
		return fromEvent<MouseEvent>(element, 'click')
			.pipe(
				tap(e => {
					const state = confirmClickMap.get(element)
					if (!state || state.isConfirming) return

					e.stopPropagation()
					e.preventDefault()

					state.isConfirming = true
					this.showOverlay(element, state, options, cancel$)
				}),
			)
			.subscribe()
	}

	private showOverlay(
		element: HTMLElement,
		state: ConfirmClickState,
		options: ConfirmClickOptions,
		cancel$: Subject<void>,
	) {
		const timeout = options.timeout ?? 3000

		// Read the host's icon — reuse it so the user sees the same action "armed"
		const iconButton = element as HTMLElement & { icon?: string; _capturedIcon?: string }
		const hostIcon =
			options.icon ??
			iconButton.icon ??
			iconButton._capturedIcon ??
			element.textContent?.trim() ??
			'warning'

		// --- Resolve theme colors for canvas ---
		const errorColor = resolveCssColor('var(--schmancy-sys-color-error-default)', '#dc2626')
		const errorOnColor = resolveCssColor('var(--schmancy-sys-color-error-on)', '#ffffff')
		const errorContainerColor = resolveCssColor('var(--schmancy-sys-color-error-container)', '#fecaca')

		// --- Build overlay container ---
		const overlay = document.createElement('div')
		overlay.setAttribute('role', 'status')
		overlay.setAttribute('aria-label', 'Click again to confirm')

		const rect = element.getBoundingClientRect()
		const w = rect.width
		const h = rect.height
		const dpr = window.devicePixelRatio || 1
		const computedStyle = getComputedStyle(element)

		Object.assign(overlay.style, {
			position: 'fixed',
			top: `${rect.top}px`,
			left: `${rect.left}px`,
			width: `${w}px`,
			height: `${h}px`,
			zIndex: '10000',
			borderRadius: computedStyle.borderRadius || '50%',
			overflow: 'hidden',
			cursor: 'pointer',
			opacity: '0',
			transform: 'scale(0.6)',
			transition: 'opacity 250ms cubic-bezier(0.22, 1.25, 0.36, 1), transform 300ms cubic-bezier(0.22, 1.25, 0.36, 1)',
		})

		// --- Canvas for animated countdown ring ---
		const canvas = document.createElement('canvas')
		canvas.width = w * dpr
		canvas.height = h * dpr
		canvas.style.width = `${w}px`
		canvas.style.height = `${h}px`
		canvas.style.position = 'absolute'
		canvas.style.top = '0'
		canvas.style.left = '0'
		overlay.appendChild(canvas)

		// --- Icon element centered on top of canvas ---
		const iconSize = Math.round(Math.min(w, h) * 0.5)
		const iconEl = document.createElement('schmancy-icon')
		iconEl.textContent = hostIcon
		iconEl.setAttribute('size', `${iconSize}px`)
		Object.assign(iconEl.style, {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			color: errorOnColor,
			pointerEvents: 'none',
		})
		overlay.appendChild(iconEl)

		document.body.appendChild(overlay)
		state.overlayElement = overlay

		// --- Trigger entry animation ---
		of(null).pipe(observeOn(animationFrameScheduler)).subscribe(() => {
			overlay.style.opacity = '1'
			overlay.style.transform = 'scale(1)'
		})

		// --- Canvas drawing function ---
		const ctx = canvas.getContext('2d')
		if (!ctx) return
		ctx.scale(dpr, dpr)

		const cx = w / 2
		const cy = h / 2
		const radius = Math.min(w, h) / 2 - 1
		const ringWidth = 3
		const innerRadius = radius - ringWidth

		const drawFrame = (progress: number) => {
			ctx.clearRect(0, 0, w, h)

			// Filled circle background
			ctx.beginPath()
			ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2)
			ctx.fillStyle = errorColor
			ctx.fill()

			// Countdown ring — depletes clockwise from top
			const remaining = 1 - progress
			if (remaining > 0) {
				const startAngle = -Math.PI / 2
				const endAngle = startAngle + Math.PI * 2 * remaining
				ctx.beginPath()
				ctx.arc(cx, cy, radius, startAngle, endAngle)
				ctx.arc(cx, cy, innerRadius, endAngle, startAngle, true)
				ctx.closePath()
				ctx.fillStyle = errorContainerColor
				ctx.fill()
			}
		}

		// Initial full ring
		drawFrame(0)

		// --- Animate countdown with RxJS animationFrameScheduler ---
		const startTime = performance.now()
		const animSub = interval(0, animationFrameScheduler)
			.pipe(
				map(() => (performance.now() - startTime) / timeout),
				takeWhile(p => p <= 1),
				takeUntil(cancel$),
				tap(progress => drawFrame(progress)),
			)
			.subscribe({
				complete: () => {
					// Auto-dismiss when countdown finishes
					const s = confirmClickMap.get(element)
					if (s?.isConfirming) {
						this.hideOverlay(element)
					}
				},
			})

		state.subscription.add(animSub)

		// --- Second click on overlay → confirm ---
		const overlayClick$ = fromEvent<MouseEvent>(overlay, 'click').pipe(
			take(1),
			tap(() => {
				state.callback()
				this.hideOverlay(element)
			}),
		)

		// --- Outside click → cancel ---
		const outsideClick$ = fromEvent<MouseEvent>(document, 'click', { capture: true }).pipe(
			filter(e => !overlay.contains(e.target as Node) && !element.contains(e.target as Node)),
			take(1),
			tap(() => this.hideOverlay(element)),
		)

		// --- Escape key → cancel ---
		const escape$ = fromEvent<KeyboardEvent>(document, 'keydown').pipe(
			filter(e => e.key === 'Escape'),
			take(1),
			tap(() => this.hideOverlay(element)),
		)

		const dismissSub = merge(overlayClick$, outsideClick$, escape$)
			.pipe(take(1), takeUntil(cancel$))
			.subscribe()

		state.subscription.add(dismissSub)
	}

	private hideOverlay(element: Element) {
		const state = confirmClickMap.get(element)
		if (!state) return

		state.cancel$.next()
		state.isConfirming = false

		if (state.overlayElement) {
			const overlay = state.overlayElement
			overlay.style.opacity = '0'
			overlay.style.transform = 'scale(0.6)'

			// Remove after exit animation
			timer(250)
				.pipe(
					tap(() => {
						if (document.body.contains(overlay)) {
							document.body.removeChild(overlay)
						}
					}),
				)
				.subscribe()

			state.overlayElement = null
		}
	}

	private cleanup(element: Element) {
		const state = confirmClickMap.get(element)
		if (state) {
			state.cancel$.next()
			state.cancel$.complete()
			state.subscription.unsubscribe()
			if (state.overlayElement && document.body.contains(state.overlayElement)) {
				document.body.removeChild(state.overlayElement)
			}
			confirmClickMap.delete(element)
		}
	}

	disconnected(part: ElementPart) {
		this.cleanup(part.element)
	}

	reconnected(part: ElementPart) {
		const element = part.element as HTMLElement
		const data = confirmClickMap.get(element)

		if (data) {
			const cancel$ = new Subject<void>()
			const subscription = this.setupClickListener(element, data.options, cancel$)
			confirmClickMap.set(element, {
				subscription,
				callback: data.callback,
				options: data.options,
				overlayElement: null,
				isConfirming: false,
				cancel$,
			})
		}
	}
}

/**
 * Two-stage click confirmation directive with animated canvas countdown.
 *
 * First click shows an in-place overlay with a depleting ring that
 * visually communicates the confirmation window. Second click confirms.
 * Auto-resets when the ring empties, or on outside click / Escape.
 *
 * @param callback - Function to call on confirmed second click
 * @param options - Optional configuration
 * @param options.timeout - Countdown duration in ms (default: 3000)
 * @param options.icon - Override icon (default: inherits from host element)
 *
 * @example
 * ```typescript
 * html`<schmancy-icon-button ${confirmClick(() => this.deleteItem(item))}>delete</schmancy-icon-button>`
 * ```
 */
export const confirmClick = directive(ConfirmClickDirective)

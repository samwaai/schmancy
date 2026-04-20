import { Directive, directive, ElementPart, PartInfo, PartType } from 'lit/directive.js'
import { fromEvent, timer, merge, Subscription } from 'rxjs'
import { switchMap, takeUntil, tap, filter, first } from 'rxjs/operators'

export interface LongPressOptions {
	/** Duration in milliseconds before long-press triggers (default: 500) */
	duration?: number
	/** Movement threshold in pixels that cancels the long-press (default: 10) */
	movementThreshold?: number
}

// Store subscription data for elements using WeakMap for proper cleanup
const longPressMap = new WeakMap<
	Element,
	{
		subscription: Subscription
		callback: () => void
		options: LongPressOptions
	}
>()

class LongPressDirective extends Directive {
	constructor(partInfo: PartInfo) {
		super(partInfo)
		if (partInfo.type !== PartType.ELEMENT) {
			throw new Error('longPress directive can only be used on elements')
		}
	}

	render(_callback: () => void, _options?: LongPressOptions) {
		// Directives that set up event listeners don't render content
		return undefined
	}

	update(part: ElementPart, [callback, options = {}]: [() => void, LongPressOptions?]) {
		const element = part.element

		// Check if we already have data for this element
		const existingData = longPressMap.get(element)

		// If callback or options changed, we need to re-setup
		if (existingData) {
			// Only re-setup if callback or options actually changed
			if (existingData.callback === callback && this.optionsEqual(existingData.options, options)) {
				return undefined
			}
			// Clean up old subscription
			existingData.subscription.unsubscribe()
		}

		// Setup the long-press detection
		const subscription = this.setupLongPress(element, callback, options)

		// Store for cleanup
		longPressMap.set(element, {
			subscription,
			callback,
			options: options || {},
		})

		return undefined
	}

	private optionsEqual(a: LongPressOptions, b: LongPressOptions | undefined): boolean {
		if (!b) return Object.keys(a).length === 0
		return a.duration === b.duration && a.movementThreshold === b.movementThreshold
	}

	private setupLongPress(element: Element, callback: () => void, options: LongPressOptions = {}): Subscription {
		const duration = options.duration ?? 500
		const threshold = options.movementThreshold ?? 10

		const pointerDown$ = fromEvent<PointerEvent>(element, 'pointerdown')
		const pointerUp$ = fromEvent<PointerEvent>(window, 'pointerup')
		const pointerMove$ = fromEvent<PointerEvent>(window, 'pointermove')
		const pointerCancel$ = fromEvent<PointerEvent>(window, 'pointercancel')

		return pointerDown$
			.pipe(
				switchMap(startEvent => {
					const startX = startEvent.clientX
					const startY = startEvent.clientY

					// Cancel if pointer is released, cancelled, or moved too far
					const cancel$ = merge(
						pointerUp$,
						pointerCancel$,
						pointerMove$.pipe(
							filter(e => {
								const dx = e.clientX - startX
								const dy = e.clientY - startY
								return Math.sqrt(dx * dx + dy * dy) > threshold
							}),
						),
					).pipe(first())

					// Wait for duration, cancel if cancel$ emits first
					return timer(duration).pipe(
						takeUntil(cancel$),
						tap(() => callback()),
					)
				}),
			)
			.subscribe()
	}

	disconnected(part: ElementPart) {
		const element = part.element
		const data = longPressMap.get(element)

		if (data) {
			data.subscription.unsubscribe()
			longPressMap.delete(element)
		}
	}

	reconnected(part: ElementPart) {
		// On reconnect, check if we need to re-setup (data should still be in WeakMap)
		const element = part.element
		const data = longPressMap.get(element)

		if (data) {
			// Re-setup with stored callback and options
			const subscription = this.setupLongPress(element, data.callback, data.options)
			data.subscription = subscription
		}
	}
}

/**
 * Long-press gesture directive for Lit components.
 *
 * Detects long-press (press-and-hold) gestures with movement cancellation.
 * Works with both touch and mouse events via PointerEvents API.
 *
 * @param callback - Function to call when long-press is detected
 * @param options - Optional configuration
 * @param options.duration - Time in ms before trigger (default: 500)
 * @param options.movementThreshold - Max movement in px before cancel (default: 10)
 *
 * @example
 * ```typescript
 * // Basic usage
 * html`<div ${longPress(() => this.showDialog())}></div>`
 *
 * // With custom options
 * html`<div ${longPress(() => this.showMenu(), { duration: 800, movementThreshold: 15 })}></div>`
 * ```
 */
export const longPress = directive(LongPressDirective)

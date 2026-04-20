/**
 * Intersect Directive - Simplified IntersectionObserver for Lit
 *
 * Automatically handles observer setup and cleanup. Replaces manual
 * IntersectionObserver management across the codebase.
 *
 * @example
 * ```ts
 * // Basic - callback when visible
 * html`<div ${intersect(() => this.loadData())}>Lazy content</div>`
 *
 * // Once mode - fires only once then disconnects
 * html`<img ${intersect(() => this.loadImage(), { once: true })} />`
 *
 * // With options
 * html`<div ${intersect(
 *   (isVisible) => isVisible && this.playAnimation(),
 *   { threshold: 0.5, rootMargin: '100px' }
 * )}>Animated content</div>`
 *
 * // Enter/exit callbacks
 * html`<video ${intersect({
 *   onEnter: () => this.play(),
 *   onExit: () => this.pause()
 * })}>Video</video>`
 * ```
 */

import { noChange } from 'lit'
import { AsyncDirective, directive } from 'lit/async-directive.js'
import type { ElementPart } from 'lit'
import { Subscription, timer } from 'rxjs'
import { take, tap } from 'rxjs/operators'

export interface IntersectOptions {
	/** Fire callback only once then disconnect (default: false) */
	once?: boolean
	/** IntersectionObserver threshold (default: 0) */
	threshold?: number | number[]
	/** IntersectionObserver rootMargin (default: '0px') */
	rootMargin?: string
	/** Delay in ms before triggering callback (default: 0) */
	delay?: number
}

export interface IntersectCallbacks {
	/** Called when element enters viewport */
	onEnter?: () => void
	/** Called when element exits viewport */
	onExit?: () => void
	/** IntersectionObserver options */
	options?: IntersectOptions
}

type IntersectCallback = (isVisible: boolean, entry: IntersectionObserverEntry) => void

interface IntersectState {
	element: HTMLElement
	observer: IntersectionObserver
	callback: IntersectCallback
	onEnter?: () => void
	onExit?: () => void
	once: boolean
	delay: number
	delayTimerSub?: Subscription
	hasFired: boolean
}

class IntersectDirective extends AsyncDirective {
	private state: IntersectState | null = null

	render(
		_callbackOrOptions: IntersectCallback | IntersectCallbacks,
		_options?: IntersectOptions,
	) {
		return noChange
	}

	override update(
		part: ElementPart,
		[callbackOrOptions, options]: [IntersectCallback | IntersectCallbacks, IntersectOptions?],
	) {
		const element = part.element as HTMLElement

		// Parse arguments
		let callback: IntersectCallback | undefined
		let onEnter: (() => void) | undefined
		let onExit: (() => void) | undefined
		let finalOptions: IntersectOptions = {}

		if (typeof callbackOrOptions === 'function') {
			callback = callbackOrOptions
			finalOptions = options || {}
		} else {
			onEnter = callbackOrOptions.onEnter
			onExit = callbackOrOptions.onExit
			finalOptions = callbackOrOptions.options || {}
			// Create a unified callback from enter/exit
			callback = (isVisible) => {
				if (isVisible && onEnter) onEnter()
				if (!isVisible && onExit) onExit()
			}
		}

		// Skip if already set up for this element
		if (this.state?.element === element) {
			return noChange
		}

		// Cleanup previous state
		this.cleanup()

		const { once = false, threshold = 0, rootMargin = '0px', delay = 0 } = finalOptions

		// Create observer
		const observer = new IntersectionObserver(
			(entries) => {
				if (!this.state) return
				const entry = entries[0]
				const isVisible = entry.isIntersecting

				// Handle delay
				if (delay > 0 && isVisible) {
					if (this.state.delayTimerSub) {
						this.state.delayTimerSub.unsubscribe()
					}
					this.state.delayTimerSub = timer(delay).pipe(
						take(1),
						tap(() => this.triggerCallback(isVisible, entry)),
					).subscribe()
				} else {
					// Clear any pending delayed callback if element exits
					if (!isVisible && this.state.delayTimerSub) {
						this.state.delayTimerSub.unsubscribe()
						this.state.delayTimerSub = undefined
					}
					this.triggerCallback(isVisible, entry)
				}
			},
			{ threshold, rootMargin },
		)

		this.state = {
			element,
			observer,
			callback: callback!,
			onEnter,
			onExit,
			once,
			delay,
			hasFired: false,
		}

		// Start observing
		observer.observe(element)

		return noChange
	}

	private triggerCallback(isVisible: boolean, entry: IntersectionObserverEntry): void {
		if (!this.state) return

		// For once mode, only fire on enter and only once
		if (this.state.once) {
			if (isVisible && !this.state.hasFired) {
				this.state.hasFired = true
				this.state.callback(isVisible, entry)
				// Disconnect after firing
				this.cleanup()
			}
			return
		}

		// Normal mode - fire on every change
		this.state.callback(isVisible, entry)
	}

	private cleanup(): void {
		if (!this.state) return

		this.state.delayTimerSub?.unsubscribe()
		this.state.delayTimerSub = undefined
		this.state.observer.disconnect()
		this.state = null
	}

	private pause(): void {
		if (!this.state) return
		this.state.delayTimerSub?.unsubscribe()
		this.state.observer.disconnect()
	}

	override disconnected(): void {
		this.pause()
	}

	override reconnected(): void {
		if (this.state) {
			this.state.observer.observe(this.state.element)
		}
	}
}

export const intersect = directive(IntersectDirective)
